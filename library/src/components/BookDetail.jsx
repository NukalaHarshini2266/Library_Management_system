import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axiosConfig";

const BookDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [book, setBook] = useState(null);
  const [reservedBookIds, setReservedBookIds] = useState([]);
  const [loading, setLoading] = useState({
    borrow: false,
    reserve: false,
    cancel: false,
    complete: false
  });

  const storedUser = JSON.parse(localStorage.getItem("user"));
  const userId = storedUser?.id;
  const role = storedUser?.role || "USER";

  useEffect(() => {
    const fetchBook = async () => {
      try {
        const res = await api.get(`/api/books/${id}`);
        setBook(res.data);
      } catch (err) {
        console.error("Failed to fetch book:", err);
      }
    };
    fetchBook();
  }, [id]);

  useEffect(() => {
    const checkReservation = async () => {
      if (!userId || !id) return;

      try {
        const res = await api.get(`/api/reservation/active/${userId}/${id}`);

        if (res.data) {
          setReservedBookIds([id]);
          setBook(prev => ({
            ...prev,
            reservationId: res.data.id,
            reservationStatus: res.data.status,
            expiryDate: res.data.expiryDate
          }));
        }
      } catch (err) {
        console.error("Reservation check failed:", err);
      }
    };

    checkReservation();
  }, [id, userId]);

  if (!book)
    return (
      <div className="container mt-5 text-center">
        Loading book details...
      </div>
    );

  const userHasReservation =
    reservedBookIds.includes(book.id) ||
    book.reservationStatus === "PENDING" ||
    book.reservationStatus === "NOTIFIED";

  // ⭐ BORROW FUNCTION with loading state
  const handleBorrow = async () => {
    if (!userId) return alert("User not found. Please login.");
    
    setLoading(prev => ({ ...prev, borrow: true }));
    try {
      await api.post(`/api/borrow/request?userId=${userId}&bookId=${book.id}`);
      alert("Book request sent successfully!");
      navigate("/borrowed-books");
    } catch (err) {
      console.error(err);
      alert("Failed to borrow book");
    } finally {
      setLoading(prev => ({ ...prev, borrow: false }));
    }
  };

  // ⭐ RESERVE FUNCTION with loading state
  const reserveBook = async (bookId, e) => {
    if (!userId) return alert("User not found.");

    setLoading(prev => ({ ...prev, reserve: true }));
    try {
      const res = await api.post("/api/reservation/add", null, {
        params: { userId, bookId },
      });

      setReservedBookIds(prev => [...prev, bookId]);
      setBook(prev => ({
        ...prev,
        reservationId: res.data.id
      }));

      alert(
        `Reservation successful for "${res.data.book.title}". You will be notified when available.`
      );
    } catch (err) {
      console.error(err);
      alert("Reservation failed!");
    } finally {
      setLoading(prev => ({ ...prev, reserve: false }));
    }
  };

  // ⭐ CANCEL RESERVATION FUNCTION with loading state
  const cancelReservation = async () => {
    if (!book.reservationId) return alert("No reservation found");

    setLoading(prev => ({ ...prev, cancel: true }));
    try {
      await api.post(
        `/api/reservation/cancel?reservationId=${book.reservationId}`
      );

      alert("Reservation cancelled!");

      setReservedBookIds(prev => prev.filter(id => id !== book.id));
      setBook(prev => ({
        ...prev,
        reservationId: null
      }));

    } catch (err) {
      console.error(err);
      alert("Failed to cancel reservation");
    } finally {
      setLoading(prev => ({ ...prev, cancel: false }));
    }
  };

  // ⭐ COMPLETE RESERVATION FUNCTION with loading state
  const completeReservation = async () => {
    try {
      if (!book.reservationId) return alert("No reservation found!");

      setLoading(prev => ({ ...prev, complete: true }));
      const res = await api.post(
        `/api/reservation/complete?reservationId=${book.reservationId}`
      );

      alert("Reservation completed! Borrow request generated.");
      navigate("/borrowed-books");

    } catch (err) {
      console.error(err);
      alert("Failed to complete reservation!");
    } finally {
      setLoading(prev => ({ ...prev, complete: false }));
    }
  };

  const handleUpdate = () => navigate(`/update-book/${book.id}`);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;

    try {
      await api.delete(`/api/books/delete/${book.id}`);
      alert("Book deleted");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Failed to delete");
    }
  };

  return (
    <div
      className="container-fluid p-5"
      style={{ background: "#f9f9f9", minHeight: "100vh" }}
    >
      <div className="row justify-content-center align-items-center">
        {/* LEFT IMAGE */}
        <div className="col-md-4 text-center">
          <img
            src={
              book.imageUrl ||
              "https://via.placeholder.com/400x600?text=No+Image"
            }
            alt={book.title}
            className="img-fluid rounded shadow"
            style={{ height: "480px", objectFit: "cover" }}
          />
        </div>

        {/* RIGHT DETAILS */}
        <div className="col-md-6 ms-md-5">
          <h1 className="fw-bold text-primary mb-3" style={{ fontSize: "2rem" }}>
            {book.title}
          </h1>
          <h5 className="text-muted mb-4" style={{ fontSize: "1.25rem" }}>
            by {book.author}
          </h5>

          <p><strong>Category:</strong> {book.categories?.map(c => c.name).join(", ")}</p>
          <p><strong>Publisher:</strong> {book.publisher || "N/A"}</p>
          <p><strong>Available Copies:</strong> {book.availableCopies}</p>

          <p
            className={`fw-bold ${
              book.availableCopies > 0 ? "text-success" : "text-danger"
            }`}
          >
            {book.availableCopies > 0 ? "Available" : "Not Available"}
          </p>

          <p><strong>Price:</strong> ₹{book.price}</p>

          {/* ABOUT BOOK */}
          <div className="mt-4">
            <h5 className="fw-bold text-secondary">About this book</h5>
            <p>
              Explore "{book.title}" by {book.author}. This book provides captivating
              insights and engaging content.
            </p>
          </div>

          {/* ⭐ BUTTONS SECTION ⭐ */}
          <div className="mt-4 d-flex flex-column gap-2">

            {/* USER BUTTONS */}
            {role === "USER" && (
              <>
                {/* ⭐ If user already has a reservation → ONLY show Cancel */}
                {userHasReservation && (
                  <>
                    {/* Show cancel only if NOT PENDING */}
                    {book.reservationStatus === "PENDING" && (
                      <button
                        className="btn btn-danger btn-sm w-100"
                        onClick={cancelReservation}
                        disabled={loading.cancel}
                      >
                        {loading.cancel ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Cancelling...
                          </>
                        ) : (
                          "Cancel Reservation"
                        )}
                      </button>
                    )}

                    {/* ⭐ Show COMPLETE button only when notified */}
                    {book.reservationStatus === "NOTIFIED" && (
                      <button
                        className="btn btn-success btn-sm w-100"
                        onClick={completeReservation}
                        disabled={loading.complete}
                      >
                        {loading.complete ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                            Processing...
                          </>
                        ) : (
                          "Complete Reservation (Collect Book)"
                        )}
                      </button>
                    )}
                  </>
                )}

                {/* ⭐ If book is available AND user has no reservation → Borrow */}
                {!userHasReservation && book.availableCopies > 0 && (
                  <button
                    className="btn btn-warning btn-sm w-100"
                    onClick={handleBorrow}
                    disabled={loading.borrow}
                  >
                    {loading.borrow ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Sending Request...
                      </>
                    ) : (
                      "Borrow"
                    )}
                  </button>
                )}

                {/* ⭐ If book unavailable AND user has no reservation → Reserve */}
                {!userHasReservation && book.availableCopies === 0 && (
                  <>
                    <button className="btn btn-warning btn-sm w-100" disabled>
                      Unavailable
                    </button>

                    <p className="text-center text-muted my-1">No available copies</p>

                    <button
                      className="btn btn-info btn-sm w-100"
                      onClick={(e) => reserveBook(book.id, e)}
                      disabled={loading.reserve}
                    >
                      {loading.reserve ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Reserving...
                        </>
                      ) : (
                        "Reserve"
                      )}
                    </button>
                  </>
                )}
              </>
            )}

            {/* ADMIN / LIBRARIAN BUTTONS */}
            {(role === "ADMIN" || role === "LIBRARIAN") && (
              <>
                <button className="btn btn-warning px-4" onClick={handleUpdate}>
                  ✏️ Update
                </button>
                <button className="btn btn-danger px-4" onClick={handleDelete}>
                  🗑️ Delete
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetail;