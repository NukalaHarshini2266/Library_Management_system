import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

const BorrowedTable = () => {
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);
  const [loadingId, setLoadingId] = useState(null);
  const [renewLoadingId, setRenewLoadingId] = useState(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role || "USER";

  useEffect(() => {
    fetchRecords();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [records, filter, search]);

  const fetchRecords = async () => {
    try {
      setIsLoading(true);
      let res;
      if (role === "ADMIN" || role === "LIBRARIAN") {
        res = await api.get("/api/borrow/all");
      } else {
        res = await api.get(`/api/borrow/user/${user.id}`);
      }
      setRecords(res.data);
      
      // Animation delay for demo
      setTimeout(() => setIsLoading(false), 800);
    } catch (err) {
      console.error("Error fetching borrowed records:", err);
      setIsLoading(false);
    }
  };

  const applyFilter = () => {
    let result = [...records];

    if (search.trim() !== "") {
      const term = search.toLowerCase();
      result = result.filter((r) =>
        r.borrowId?.toString().includes(term) ||
        r.book?.title?.toLowerCase().includes(term) ||
        r.book?.id?.toString().toLowerCase().includes(term) ||
        r.status?.toLowerCase().includes(term) ||
        (role === "ADMIN" && r.user?.name?.toLowerCase?.().includes(term))
      );
    }

    if (filter !== "all") {
      switch (filter) {
        case "requested":
          result = result.filter((r) => r.status === "REQUESTED");
          break;
        case "borrowed":
          result = result.filter((r) => 
            r.status === "BORROWED" || r.status === "RENEWED"|| r.status==="INSPECTION_DONE"||r.status==="RENEW_REQUESTED"
          );
          break;
        case "rejected":
          result = result.filter((r) => r.status === "REJECTED");
          break;
        case "returned":
          result = result.filter((r) => r.status === "RETURNED"|| r.status==="RETURN_INSPECTED"||r.status==="RETURN_REQUESTED");
          break;
        default:
          break;
      }
    }

    setFilteredRecords(result);
  };

  // Animation for table rows
  const rowAnimation = {
    animation: "fadeInUp 0.6s ease-out",
    animationFillMode: "both"
  };

  // Animation for buttons
  const buttonAnimation = {
    transition: "all 0.3s ease",
    transform: "translateY(0)"
  };

  // Animation for search bar
  const searchAnimation = {
    animation: "slideInDown 0.5s ease-out"
  };

  // -------------------- USER RETURN REQUEST --------------------
  const handleSendReturnRequest = async (record) => {
    try {
      setLoadingId(record.borrowId);
      const res = await api.post(
        `/api/borrow/return/request?borrowId=${record.borrowId}`
      );

      const updated = res.data;
      setRecords((prev) =>
        prev.map((r) => (r.borrowId === updated.borrowId ? updated : r))
      );

      alert("Return request sent to admin!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to send return request");
    } finally {
      setLoadingId(null);
    }
  };

  // -------------------- USER COMPLETE RETURN --------------------
  const handleCompleteReturn = (record) => {
    navigate(`/return/${record.borrowId}`, { state: { record } });
  };

  // -------------------- USER RENEW REQUEST --------------------
  const handleRenewRequest = async (record) => {
    try {
      setRenewLoadingId(record.borrowId);
      const res = await api.put(`/api/borrow/renew/request/${record.borrowId}`);

      const updated = res.data;
      setRecords((prev) =>
        prev.map((r) => (r.borrowId === updated.borrowId ? updated : r))
      );

      alert("Renewal request sent!");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to request renewal");
    } finally {
      setRenewLoadingId(null);
    }
  };

  // -------------------- ADMIN INSPECT RETURN --------------------
  const handleInspectReturn = async (record) => {
    const damagedInput = prompt("Is the book damaged? (yes/no)");

    if (damagedInput === null) return;

    const isDamaged = damagedInput.trim().toLowerCase() === "yes";

    let notes = "";
    let fee = 0;

    if (isDamaged) {
      notes = prompt("Enter damage details:");
      if (notes === null) return;

      const feeInput = prompt("Enter damage fee:");
      if (feeInput === null) return;
      fee = Number(feeInput);
    }

    try {
      setLoadingId(record.borrowId);

      const res = await api.post(
        `/api/borrow/return/inspect?borrowId=${record.borrowId}`,
        {
          damaged: isDamaged,
          damageNotes: isDamaged ? notes : "",
          damageFee: isDamaged ? fee : 0,
        }
      );

      const updated = res.data;
      setRecords((prev) =>
        prev.map((r) => (r.borrowId === updated.borrowId ? updated : r))
      );

      alert("Return inspection completed!");
    } catch (err) {
      console.error(err);
      alert("Failed to inspect return");
    } finally {
      setLoadingId(null);
    }
  };

  // -------------------- ADMIN APPROVE/REJECT RENEW --------------------
  const handleApproveRenew = async (record) => {
    try {
      const res = await api.put(`/api/borrow/renew/approve/${record.borrowId}`);
      const updated = res.data;

      setRecords((prev) =>
        prev.map((r) => (r.borrowId === updated.borrowId ? updated : r))
      );

      alert("Renewal approved!");
    } catch (err) {
      console.error(err);
      alert("Failed to approve renewal");
    }
  };

  const handleRejectRenew = async (record) => {
    try {
      const res = await api.put(`/api/borrow/renew/reject/${record.borrowId}`);
      const updated = res.data;

      setRecords((prev) =>
        prev.map((r) => (r.borrowId === updated.borrowId ? updated : r))
      );

      alert("Renewal rejected!");
    } catch (err) {
      console.error(err);
      alert("Failed to reject renewal");
    }
  };

  // Filter buttons configuration
  const filterButtons = [
    { key: "all", label: "All", variant: "warning" },
    { key: "requested", label: " Requests", variant: "warning" },
    { key: "borrowed", label: "Borrowed", variant: "success" },
    { key: "rejected", label: "Rejected", variant: "danger" },
    { key: "returned", label: "Returned", variant: "info" }
  ];

  return (
    <div 
      style={{ 
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5e6ca 0%, #cbb279 40%, #da9652ff 90%)",
        backgroundAttachment: "fixed",
        margin: 0,
        padding: "20px 0",
        overflowX: "hidden"
      }}
    >
      {/* Custom CSS Animations */}
      <style>
        {`
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes slideInDown {
            from {
              opacity: 0;
              transform: translateY(-20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
          
          @keyframes bounceIn {
            0% { transform: scale(0.3); opacity: 0; }
            50% { transform: scale(1.05); }
            70% { transform: scale(0.9); }
            100% { transform: scale(1); opacity: 1; }
          }
          
          .animated-row {
            animation: fadeInUp 0.6s ease-out;
            animation-fill-mode: both;
          }
          
          .animated-button:hover {
            transform: translateY(-3px) !important;
            box-shadow: 0 8px 20px rgba(0,0,0,0.2) !important;
          }
          
          .pulse-animation {
            animation: pulse 2s infinite;
          }
          
          .loading-shimmer {
            background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
            background-size: 200% 100%;
            animation: loading 1.5s infinite;
          }
          
          @keyframes loading {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
        `}
      </style>

      <div className="container" style={{ width: "95%" }}>
        {/* Fixed Header Section */}
        <div className="position-sticky top-0 pb-3 pt-2" style={{ zIndex: 20, background: "transparent", ...searchAnimation }}>
          <h3 className="fw-bold text-dark mb-3 pulse-animation">
            {role === "USER" ? "📚 My Borrowed Books" : "📚 All Borrowed Books"}
          </h3>

          {/* SEARCH BAR AND FILTER BUTTONS */}
          <div className="d-flex align-items-center gap-3 mb-3">
            {/* Search Bar */}
            <input
              type="text"
              className="form-control animated-button"
              style={{ 
                maxWidth: "350px",
                background: "rgba(255, 255, 255, 0.95)",
                border: "2px solid #cbb279",
                fontWeight: "500",
                transition: "all 0.3s ease",
                transform: "translateY(0)"
              }}
              placeholder="🔍 Search by Title, Status, Borrow ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={(e) => {
                e.target.style.transform = "scale(1.02)";
                e.target.style.boxShadow = "0 5px 15px rgba(203, 178, 121, 0.3)";
              }}
              onBlur={(e) => {
                e.target.style.transform = "scale(1)";
                e.target.style.boxShadow = "none";
              }}
            />

            {/* Filter Buttons */}
            <div className="d-flex flex-wrap gap-2">
              {filterButtons.map((button, index) => (
                <button
                  key={button.key}
                  className={`btn btn-sm animated-button`}
                  style={{
                    borderWidth: "2px",
                    fontWeight: "600",
                    background: filter === button.key ? 
                      (button.variant === "warning" ? "#ffc107" : 
                       button.variant === "success" ? "#198754" :
                       button.variant === "danger" ? "#dc3545" :
                       button.variant === "info" ? "#0dcaf0" : "#0d6efd") : 
                      "rgba(255, 255, 255, 0.9)",
                    color: filter === button.key ? "#000" : "#000",
                    borderColor: filter === button.key ? 
                      (button.variant === "warning" ? "#ffc107" : 
                       button.variant === "success" ? "#198754" :
                       button.variant === "danger" ? "#dc3545" :
                       button.variant === "info" ? "#0dcaf0" : "#0d6efd") : 
                      "#8c6239",
                    transition: "all 0.3s ease",
                    transform: "translateY(0)",
                    animation: `bounceIn 0.6s ease-out ${index * 0.1}s both`
                  }}
                  onClick={() => setFilter(button.key)}
                >
                  {button.label}
                </button>
              ))}
            </div>
          </div>

          {/* Results Count */}
          <div className="text-dark fw-semibold small" style={searchAnimation}>
            Showing {filteredRecords.length} of {records.length} records
            {search && ` for "${search}"`}
            {filter !== "all" && ` • Filtered by: ${filterButtons.find(b => b.key === filter)?.label}`}
          </div>
        </div>

        {/* Loading Animation */}
        {isLoading && (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" style={{ width: "3rem", height: "3rem" }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-dark fw-semibold">Loading your borrowed books...</p>
          </div>
        )}

        {/* Table Section */}
        {!isLoading && (
          <div 
            className="table-responsive rounded-3 shadow-lg animated-row"
            style={{ 
              maxHeight: "80vh", 
              overflowY: "auto",
              background: "rgba(255, 255, 255, 0.95)",
              animation: "fadeInUp 0.8s ease-out"
            }}
          >
            <table className="table table-bordered table-striped shadow-sm" style={{ width: "100%" }}>
              <thead className="table-warning sticky-top" style={{ top: "0px", zIndex: 19 }}>
                <tr>
                  <th>Borrow ID</th>
                  {role === "ADMIN" && <th>Student Name</th>}
                  <th>Book ID</th>
                  <th>Book Title</th>
                  <th>Borrow Date</th>
                  <th>Due Date</th>
                  <th>Return date</th>
                  <th>Status</th>
                  {role === "USER" && (
                    <>
                      <th>Return</th>
                      <th>Renew</th>
                    </>
                  )}
                  {(role === "ADMIN" || role === "LIBRARIAN") && (
                    <>
                      <th>Return Action</th>
                      <th>Renew Action</th>
                    </>
                  )}
                  <th>Penalty</th>
                </tr>
              </thead>

              <tbody>
                {filteredRecords.length === 0 ? (
                  <tr>
                    <td 
                      colSpan={
                        role === "ADMIN" ? 11 : 
                        role === "LIBRARIAN" ? 10 : 
                        9
                      } 
                      className="text-center py-4"
                    >
                      <div className="text-muted">
                        <i className="bi bi-inbox fs-1 d-block mb-2">📭</i>
                        No records found
                        {(search || filter !== "all") && (
                          <div className="small mt-1">
                            Try adjusting your search or filter criteria
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredRecords.map((rec, index) => (
                    <tr 
                      key={rec.borrowId} 
                      className="animated-row"
                      style={{
                        ...rowAnimation,
                        animationDelay: `${index * 0.1}s`
                      }}
                    >
                      <td>{rec.borrowId}</td>
                      {role === "ADMIN" && <td>{rec.username || rec.user?.name}</td>}
                      <td>{rec.book?.id || "—"}</td>
                      <td>{rec.book?.title || "Unknown"}</td>
                      <td>
                        {rec.borrowDateTime ? new Date(rec.borrowDateTime).toLocaleString() : "-"}
                      </td>
                      <td>
                        {rec.dueDateTime ? new Date(rec.dueDateTime).toLocaleString() : "-"}
                      </td>
                      <td>
                        {rec.returnDateTime ? new Date(rec.returnDateTime).toLocaleString() : "-"}
                      </td>                      
                      <td>
                        <span
                          className={`badge ${
                            rec.status === "REQUESTED"
                              ? "bg-secondary"
                            : rec.status === "BORROWED"
                              ? "bg-success"
                            : rec.status === "RENEW_REQUESTED"
                              ? "bg-info"
                            : rec.status === "RENEWED"
                              ? "bg-primary"
                            : rec.status === "RETURN_REQUESTED"
                              ? "bg-warning"
                            : rec.status === "INSPECTION_DONE"
                              ? "bg-dark"
                            : rec.status === "RETURN_INSPECTED"
                              ? "bg-danger"
                            : rec.status === "RETURNED"
                              ? "bg-light text-dark"
                            : rec.status === "REJECTED"
                              ? "bg-danger"
                              : "bg-dark"
                          }`}
                          style={{
                            transition: "all 0.3s ease",
                            cursor: "pointer"
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.transform = "scale(1.1)";
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.transform = "scale(1)";
                          }}
                        >
                          {rec.status}
                        </span>
                      </td>

                      {/* Action buttons with animations */}
                      {role === "USER" && (
                        <>
                          <td>
                            {rec.status === "BORROWED" || rec.status === "RENEWED" ? (
                              <button
                                className="btn btn-sm animated-button"
                                style={{
                                  background: "linear-gradient(45deg, #cbb279, #cc8f52ff)",
                                  border: "none",
                                  color: "#ffffff",
                                  fontWeight: "600",
                                  transition: "all 0.3s ease"
                                }}
                                onClick={() => handleSendReturnRequest(rec)}
                                disabled={loadingId === rec.borrowId}
                              >
                                {loadingId === rec.borrowId
                                  ? "⏳ Processing..."
                                  : "Send Return Request"}
                              </button>
                            ) : rec.status === "RETURN_REQUESTED" ? (
                              <span 
                                className="badge bg-warning animated-button"
                                style={{ 
                                  background: "#cbb279", 
                                  color: "#000",
                                  cursor: "pointer"
                                }}
                              >
                                 Requested
                              </span>
                            ) : rec.status === "RETURN_INSPECTED" ? (
                              <button
                                className="btn btn-success btn-sm animated-button"
                                style={{ fontWeight: "600" }}
                                onClick={() => handleCompleteReturn(rec)}
                              >
                                 Complete Return
                              </button>
                            ) : (
                              "—"
                            )}
                          </td>
                          <td>
                            {rec.status === "BORROWED" || rec.status === "RENEWED" ? (
                              <button
                                className="btn btn-sm animated-button"
                                style={{
                                  background: "linear-gradient(45deg, #cbb279, #b3804eff)",
                                  border: "none",
                                  color: "#ffffff",
                                  fontWeight: "600"
                                }}
                                onClick={() => handleRenewRequest(rec)}
                                disabled={renewLoadingId === rec.borrowId}
                              >
                                {renewLoadingId === rec.borrowId
                                  ? "⏳ Processing..."
                                  : " Request Renewal"}
                              </button>
                            ) : rec.status === "RENEW_REQUESTED" ? (
                              <span className="badge bg-info animated-button">⏳ Pending</span>
                            ) : (
                              "—"
                            )}
                          </td>
                        </>
                      )}

                      {/* Admin actions */}
                      {(role === "ADMIN" || role === "LIBRARIAN") && (
                        <>
                          <td>
                            {rec.status === "RETURN_REQUESTED" ? (
                              <button
                                className="btn btn-primary btn-sm animated-button"
                                style={{ fontWeight: "600" }}
                                onClick={() => handleInspectReturn(rec)}
                                disabled={loadingId === rec.borrowId}
                              >
                                {loadingId === rec.borrowId
                                  ? "⏳ Processing..."
                                  : "🔍 Inspect Return"}
                              </button>
                            ) : rec.status === "INSPECTION_DONE" ? (
                              <span className="badge bg-info animated-button">✅ Inspection Done</span>
                            ) : (
                              "—"
                            )}
                          </td>
                          <td>
                            {rec.status === "RENEW_REQUESTED" ? (
                              <div className="d-flex gap-1">
                                <button
                                  className="btn btn-success btn-sm animated-button"
                                  style={{ fontWeight: "600" }}
                                  onClick={() => handleApproveRenew(rec)}
                                >
                                  ✅ Approve
                                </button>
                                <button
                                  className="btn btn-danger btn-sm animated-button"
                                  style={{ fontWeight: "600" }}
                                  onClick={() => handleRejectRenew(rec)}
                                >
                                  ❌ Reject
                                </button>
                              </div>
                            ) : (
                              "—"
                            )}
                          </td>
                        </>
                      )}

                      <td>
                        <span className={`fw-bold ${rec.penalty > 0 ? 'text-danger pulse-animation' : 'text-success'}`}>
                          {rec.penalty ? `₹${rec.penalty}` : "₹0"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default BorrowedTable;