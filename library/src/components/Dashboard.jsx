
import React, { useEffect, useState, useRef } from "react";
import api from "../api/axiosConfig";
import { FaBars, FaSearch } from "react-icons/fa";
import Sidebar from "./Sidebar";
import { useNavigate } from "react-router-dom";
import BorrowedTable from "./BorrowedTable";
import BorrowRequests from "./BorrowRequests";


const Dashboard = () => {
  const [books, setBooks] = useState([]);
  const [allBooks, setAllBooks] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loadingBorrowId, setLoadingBorrowId] = useState(null);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedAvailability, setSelectedAvailability] = useState("");
  const [showSidebar, setShowSidebar] = useState(false);
  const [showBorrowedView, setShowBorrowedView] = useState(false);
  const [showBorrowRequests, setShowBorrowRequests] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const mountedRef = useRef(true);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) setUser(storedUser);

    fetchBooks();
    fetchCategories();
  }, []);

  const fetchBooks = async () => {
    try {
      const res = await api.get("/api/books");
      if (!mountedRef.current) return;
      setBooks(Array.isArray(res.data) ? res.data : []);
      setAllBooks(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("fetchBooks:", err);
      setBooks([]);
      setAllBooks([]);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get("/api/categories/all");
      setCategories(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("fetchCategories:", err);
      setCategories([]);
    }
  };

  const handleCategoryChange = async (e) => {
    const cat = e.target.value;
    setSelectedCategory(cat);
    setSelectedAvailability("");
    setQuery("");
    if (!cat) {
      setBooks(allBooks);
      return;
    }
    try {
      const res = await api.get(`/api/books/search/category?category=${encodeURIComponent(cat)}`);
      setBooks(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("category search:", err);
      setBooks([]);
    }
  };
  const handleAvailabilityChange = async (e) => {
    const status = e.target.value;
    setSelectedAvailability(status);
    setQuery(""); // clear search
    setSelectedCategory(""); // clear category filter if needed

    if (!status) {
      setBooks(allBooks);
      return;
    }

    try {
      const res = await api.get(`/api/books/availability?available=${status === "available"}`);
      setBooks(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("availability filter:", err);
      setBooks([]);
    }
  };

  useEffect(() => {
  if (!query) {
    setBooks(allBooks);
    return;
  }

  const fetchSearchResults = async () => {
    try {
      const res = await api.get(`/api/books/search?keyword=${query}`);
      setBooks(res.data);
    } catch (err) {
      console.error("Search failed:", err);
    }
  };

    fetchSearchResults();
  }, [query]);


  const handleBorrow = async (book) => {
    if (!user?.id) return alert("User not found. Please login.");

    setLoadingBorrowId(book.id); // set loading state for this book

    try {
      await api.post(`/api/borrow/request?userId=${user.id}&bookId=${book.id}`);
      alert("Book request sent successfully!");
      navigate("/borrowed-books");
    } catch (err) {
      console.error(err);
      alert("Failed to borrow book");
    } finally {
      setLoadingBorrowId(null); // reset after request completes
    }
  };


  const handleDelete = async (bookId, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this book?")) return;

    try {
      await api.delete(`/api/books/delete/${bookId}`);
      alert("Deleted");
      fetchBooks();
    } catch (err) {
      console.error("delete err:", err);
      alert("Failed to delete");
    }
  };

  const showBorrowed = () => setShowBorrowedView(true);
  const showBooks = () => {
    setShowBorrowedView(false);
    fetchBooks();
  };
const showBorrowRequestsView = () => {
  setShowBorrowRequests(true);
  setShowBorrowedView(false);
};

  return (
    <div className="container-fluid p-0">
      {/* Top bar */}
      <header
        className="d-flex justify-content-between align-items-center px-4 py-2"
        style={{ 
          background: "linear-gradient(135deg, #f5e6ca 0%, #cbb279 40%, #8c6239 100%)",
          position: "sticky", 
          top: 0, 
          zIndex: 1000 
        }}
      >
        <div className="d-flex align-items-center">
          <button
            className="btn btn-light me-3"
            onClick={(e) => {
              e.stopPropagation();
              setShowSidebar((s) => !s);
            }}
          >
            <FaBars />
          </button>
          <div>
            <h4 className="mb-0">Library Management</h4>
            {user && (
              <small className="text-dark">
                Welcome, <strong>{user.name}</strong> 👋
              </small>
            )}
          </div>
        </div>
      </header>

      

      {/* Sidebar */}
      <Sidebar
        show={showSidebar}
        onClose={() => setShowSidebar(false)}
        user={user}
        onShowBooks={showBooks}
        onShowBorrowed={showBorrowed}
        onShowBorrowRequests={showBorrowRequestsView}
      />

      {/* Main content */}
      <main
        className="p-3"
        style={{ backgroundColor: "#f8f9fa", minHeight: "90vh" }}
        onClick={() => setShowSidebar(false)}
      >
        {/* Search bar */}
      <div className="d-flex justify-content-center align-items-center my-3">
        <div className="input-group w-50 shadow-sm">
          <span className="input-group-text bg-white">
            <FaSearch />
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search by title or author or publisher..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>
        {!showBorrowedView ? (
          <>
            {/* Filters */}
            <div className="mb-3 d-flex align-items-center gap-3 flex-wrap">
              {/* Category Dropdown */}
              <div>
                <label className="fw-semibold me-2">Category:</label>
                <select
                  className="form-select d-inline-block w-auto"
                  value={selectedCategory}
                  onChange={handleCategoryChange}
                >
                  <option value="">All Categories</option>
                  {categories.map((c) => (
                    <option key={c.id || c.name} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Availability Dropdown */}
              <div>
                <label className="fw-semibold me-2">Availability:</label>
                <select
                  className="form-select d-inline-block w-auto"
                  value={selectedAvailability}
                  onChange={handleAvailabilityChange}
                >
                  <option value="">All Books</option>
                  <option value="available">Available Books</option>
                  <option value="unavailable">Not Available Books</option>
                </select>
              </div>
            </div>


            {/* Books grid */}
            <div className="row justify-content-center g-4">
              {books && books.length > 0 ? (
                books.map((book) => (
                  <div key={book.id} className="col-6 col-md-3 col-lg-2">
                    <div className="card h-100 shadow-sm border-0" style={{ minHeight: "400px" }}>
                      {/* Clickable Area */}
                      {/* <div onClick={() => navigate(`/book-detail/${book.id}`)} style={{ cursor: "pointer" }}> */}
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("Navigating to:", `/book-detail/${book.id}`);
                          navigate(`/book-detail/${book.id}`);
                        }}
                        style={{ cursor: "pointer" }}
                      >

                        <div
                          className="d-flex align-items-center justify-content-center"
                          style={{ height: "260px", overflow: "hidden", backgroundColor: "#f8f9fa" }}
                        >
                          <img
                            src={book.imageUrl || "https://via.placeholder.com/200x260?text=No+Image"}
                            alt={book.title}
                            style={{ height: "100%", width: "auto", objectFit: "contain" }}
                          />
                        </div>
                        <div className="card-body text-center p-2">
                          <h6 className="card-title text-truncate fw-semibold" style={{ fontSize: "1.4rem" }}>
                            {book.title}
                          </h6>
                          <p className="text-danger fw-bold mb-0" style={{ fontSize: "1.2rem" }}>
                            Price: ₹{book.price ?? "—"}
                          </p>
                        </div>
                      </div>

                      {/* Buttons */}
                      <div className="card-body d-flex flex-column p-2">
                        {user?.role === "USER" && (
                            <button
                              className="btn btn-warning btn-sm w-100"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleBorrow(book);
                              }}
                              disabled={loadingBorrowId === book.id} // disable while request running
                            >
                              {loadingBorrowId === book.id ? "Sending Request..." : "Borrow"}
                            </button>
                          )}


                        {(user?.role === "ADMIN" || user?.role === "LIBRARIAN") && (
                          <div className="d-flex justify-content-between">
                            <button
                              className="btn btn-warning btn-sm w-50 me-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/update-book/${book.id}`, { state: { book } });
                              }}
                            >
                              Update
                            </button>
                            <button
                              className="btn btn-danger btn-sm w-50 ms-1"
                              onClick={(e) => handleDelete(book.id, e)}
                            >
                              Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-muted mt-5">No books found</div>
              )}
            </div>
          </>
        ) : (
          <BorrowedTable currentUser={user} />
        )}
      </main>
    </div>
  );
};

export default Dashboard;

