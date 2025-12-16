import React, { useState, useEffect } from "react";
import axios from "axios";

const PendingReservations = () => {
  const [bookName, setBookName] = useState("");
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load ALL pending + notified on page load
  const loadAll = async () => {
    try {
      setLoading(true);
      const pending = await axios.get("http://localhost:8081/api/reservation/admin/pending");
      const notified = await axios.get("http://localhost:8081/api/reservation/admin/notified");

      // Combine both
      setReservations([...pending.data, ...notified.data]);
    } catch (err) {
      alert("Failed to load reservations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAll();
  }, []);

  // Search by book name
  const fetchByBookName = async () => {
    if (!bookName.trim()) {
      loadAll(); // If empty → load all again
      return;
    }

    try {
      setLoading(true);
      // Filter reservations by book name on client side
      const filteredReservations = reservations.filter(r => 
        r.book?.title?.toLowerCase().includes(bookName.toLowerCase())
      );
      setReservations(filteredReservations);
    } catch (err) {
      alert("Failed to filter reservations");
    } finally {
      setLoading(false);
    }
  };

  // Handle Enter key press in search input
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      fetchByBookName();
    }
  };

  return (
    <div 
      style={{
        minHeight: "100vh",
        background:  "linear-gradient(135deg, #f5e6ca 0%, #cbb279 40%, #b5793cff 90%)",
        padding: "20px 0"
      }}
    >
      <div className="container">
        <h2 className="text-dark fw-bold mb-4">📌 Pending & Notified Reservations</h2>

        {/* Search Section */}
        <div 
          className="d-flex mt-3 p-3 rounded-3"
          style={{
            background: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(203, 178, 121, 0.3)"
          }}
        >
          <input
            type="text"
            className="form-control"
            placeholder="Search by Book Name"
            value={bookName}
            onChange={(e) => setBookName(e.target.value)}
            onKeyPress={handleKeyPress}
            style={{
              border: "1px solid #cbb279",
              transition: "all 0.3s ease"
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#8c6239";
              e.target.style.boxShadow = "0 0 0 2px rgba(139, 69, 19, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#cbb279";
              e.target.style.boxShadow = "none";
            }}
          />
          <button 
            className="btn ms-2"
            onClick={fetchByBookName}
            style={{
              background: "linear-gradient(45deg, #cbb279, #8c6239)",
              border: "none",
              color: "#fff",
              fontWeight: "600",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 5px 15px rgba(139, 69, 19, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "none";
            }}
          >
            🔍 Search
          </button>
          <button 
            className="btn ms-2"
            onClick={loadAll}
            style={{
              background: "rgba(108, 117, 125, 0.9)",
              border: "none",
              color: "#fff",
              fontWeight: "600",
              transition: "all 0.3s ease"
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow = "0 5px 15px rgba(108, 117, 125, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "none";
            }}
          >
            🔄 Reset
          </button>
        </div>

        {/* Search Results Info */}
        {bookName && (
          <div className="mt-2 text-center">
            <small className="text-dark fw-semibold">
              Showing results for: "{bookName}" • {reservations.length} reservation(s) found
            </small>
          </div>
        )}

        {/* Table */}
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-dark">Loading reservations...</p>
          </div>
        ) : (
          <div 
            className="table-responsive rounded-3 shadow-lg mt-4"
            style={{
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)"
            }}
          >
            <table className="table table-hover mb-0">
              <thead className="table-warning">
                <tr>
                  <th style={{ padding: "15px" }}>ID</th>
                  <th style={{ padding: "15px" }}>User</th>
                  <th style={{ padding: "15px" }}>Book Title</th>
                  <th style={{ padding: "15px" }}>Status</th>
                  <th style={{ padding: "15px" }}>Reserved On</th>
                  <th style={{ padding: "15px" }}>Notes</th>
                </tr>
              </thead>
              <tbody>
                {reservations.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4 text-muted">
                      {bookName ? `No reservations found for "${bookName}"` : "No reservations found"}
                    </td>
                  </tr>
                ) : (
                  reservations.map((r, index) => (
                    <tr 
                      key={r.id}
                      style={{ 
                        transition: "all 0.3s ease",
                        animation: "fadeInUp 0.6s ease-out",
                        animationDelay: `${index * 0.1}s`,
                        animationFillMode: "both"
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "rgba(245, 230, 202, 0.3)";
                        e.currentTarget.style.transform = "translateX(5px)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "";
                        e.currentTarget.style.transform = "translateX(0)";
                      }}
                    >
                      <td style={{ padding: "12px" }}>{r.id}</td>
                      <td style={{ padding: "12px" }}>{r.user?.name}</td>
                      <td style={{ padding: "12px" }}>
                        <strong>{r.book?.title}</strong>
                        {bookName && r.book?.title?.toLowerCase().includes(bookName.toLowerCase()) && (
                          <span className="badge bg-info ms-2">Match</span>
                        )}
                      </td>
                      <td style={{ padding: "12px" }}>
                        <span 
                          className="badge"
                          style={{
                            background: r.status === "PENDING" 
                              ? "linear-gradient(45deg, #ffc107, #fd7e14)" 
                              : "linear-gradient(45deg, #20c997, #198754)",
                            color: "#fff",
                            padding: "6px 12px",
                            borderRadius: "10px",
                            fontSize: "0.8rem"
                          }}
                        >
                          {r.status}
                        </span>
                      </td>
                      <td style={{ padding: "12px" }}>{r.reservationDate}</td>
                      <td style={{ padding: "12px" }}>{r.notes || "—"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Custom Animation */}
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
};

export default PendingReservations;