import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";

const BorrowRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loadingStates, setLoadingStates] = useState({});

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await api.get("/api/borrow/requests");
      setRequests(res.data || []);
    } catch (err) {
      console.error("Error fetching borrow requests:", err);
      setRequests([]);
    }
  };

  const handleAccept = async (borrowId) => {
    setLoadingStates(prev => ({ ...prev, [borrowId]: 'accepting' }));
    try {
      await api.post("/api/borrow/approve", null, { params: { borrowId } });
      alert("✅ Request accepted!");
      fetchRequests();
    } catch (err) {
      console.error("Accept error:", err);
      alert("❌ Failed to accept request");
    } finally {
      setLoadingStates(prev => ({ ...prev, [borrowId]: null }));
    }
  };

  const handleReject = async (borrowId) => {
    setLoadingStates(prev => ({ ...prev, [borrowId]: 'rejecting' }));
    try {
      await api.post("/api/borrow/reject", null, { params: { borrowId } });
      alert("🚫 Request rejected!");
      fetchRequests();
    } catch (err) {
      console.error("Reject error:", err);
      alert("❌ Failed to reject request");
    } finally {
      setLoadingStates(prev => ({ ...prev, [borrowId]: null }));
    }
  };

  return (
    <div 
      style={{
        minHeight: "100vh",
        background: "#f5e6ca", // Only the first light color from homepage
        padding: "20px 0"
      }}
    >
      <div className="container">
        <h4 className="text-center mb-4 fw-bold text-dark">📚 Pending Borrow Requests</h4>

        {requests.length === 0 && (
          <div 
            className="text-center py-5 rounded-3"
            style={{
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(10px)",
              border: "1px solid rgba(203, 178, 121, 0.3)"
            }}
          >
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>📭</div>
            <h6 className="mb-1 text-dark">No pending requests</h6>
            <p className="mb-0 text-muted small">All borrow requests have been processed</p>
          </div>
        )}

        <div className="row g-3">
          {requests.map((req, index) => {
            const currentLoading = loadingStates[req.borrowId];

            return (
              <div key={req.borrowId} className="col-12">
                <div 
                  className="card shadow-sm"
                  style={{ 
                    borderRadius: '15px',
                    transition: 'all 0.3s ease',
                    transform: 'translateY(0)',
                    background: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(10px)",
                    border: "1px solid rgba(203, 178, 121, 0.3)",
                    borderLeft: `4px solid ${
                      index % 3 === 0 ? "#d7db6ee7" : 
                      index % 3 === 1 ? "#cbb279" : 
                      "#8c6239"
                    }`
                  }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                >
                  
                  {/* Header with Borrow ID */}
                  <div className="card-header bg-transparent border-0 pb-0 pt-3 px-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <span 
                        className="badge fw-semibold"
                        style={{
                          background: "linear-gradient(45deg, #cbb279, #8c6239)",
                          color: "#fff",
                          padding: "6px 12px",
                          borderRadius: "8px"
                        }}
                      >
                        <i className="fas fa-hashtag me-1"></i>
                        Borrow ID: {req.borrowId}
                      </span>
                      <span 
                        className="badge small"
                        style={{
                          background: "rgba(255, 193, 7, 0.2)",
                          color: "#856404",
                          padding: "6px 12px",
                          borderRadius: "8px"
                        }}
                      >
                        <i className="fas fa-hourglass-half me-1"></i>
                        Pending
                      </span>
                    </div>
                  </div>

                  <div className="card-body p-3 pt-2">
                    <div className="row align-items-center">
                      {/* Book Information */}
                      <div className="col-lg-5 col-md-6 mb-2 mb-md-0">
                        <div className="d-flex align-items-start">
                          <div 
                            className="p-2 rounded me-2"
                            style={{
                              background: "rgba(102, 126, 234, 0.1)",
                              color: "#667eea"
                            }}
                          >
                            <i className="fas fa-book small"></i>
                          </div>
                          <div>
                            <h6 className="mb-1 fw-bold small text-dark">Book Information</h6>
                            <div className="d-flex flex-wrap gap-2 align-items-center">
                              <div>
                                <small className="text-muted d-block">Book ID</small>
                                <span className="fw-semibold small text-dark">{req.book?.id || "—"}</span>
                              </div>
                            </div>
                            <div className="mt-1">
                              <small className="text-muted d-block">Book Title</small>
                              <span className="fw-bold text-dark small">{req.book?.title || "Unknown"}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* User Information */}
                      <div className="col-lg-3 col-md-4 mb-2 mb-md-0">
                        <div className="d-flex align-items-start">
                          <div 
                            className="p-2 rounded me-2"
                            style={{
                              background: "rgba(203, 178, 121, 0.1)",
                              color: "#8c6239"
                            }}
                          >
                            <i className="fas fa-user small"></i>
                          </div>
                          <div>
                            <h6 className="mb-1 fw-bold small text-dark">User Details</h6>
                            <div>
                              <small className="text-muted d-block">Username</small>
                              <span className="fw-semibold small text-dark">{req.username}</span>
                            </div>
                            <div className="mt-1">
                              <small className="text-muted d-block">Email</small>
                              <span className="text-break small text-dark">{req.user?.email || "—"}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="col-lg-4 col-md-2">
                        <div className="d-flex flex-column gap-2">
                          <button
                            className="btn btn-sm py-2 fw-semibold d-flex align-items-center justify-content-center gap-2"
                            onClick={() => handleAccept(req.borrowId)}
                            disabled={currentLoading}
                            style={{ 
                              borderRadius: '10px',
                              background: currentLoading === 'accepting' ? 
                                "rgba(40, 167, 69, 0.7)" : 
                                "linear-gradient(45deg, #28a745, #20c997)",
                              border: "none",
                              color: "#fff",
                              transition: "all 0.3s ease"
                            }}
                            onMouseEnter={(e) => {
                              if (!currentLoading) {
                                e.target.style.transform = "scale(1.05)";
                                e.target.style.boxShadow = "0 5px 15px rgba(40, 167, 69, 0.3)";
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!currentLoading) {
                                e.target.style.transform = "scale(1)";
                                e.target.style.boxShadow = "none";
                              }
                            }}
                          >
                            {currentLoading === 'accepting' ? (
                              <>
                                <div className="spinner-border spinner-border-sm" role="status"></div>
                                Accepting...
                              </>
                            ) : (
                              <>
                                <i className="fas fa-check small"></i>
                                Accept
                              </>
                            )}
                          </button>
                          
                          <button
                            className="btn btn-sm py-2 fw-semibold d-flex align-items-center justify-content-center gap-2"
                            onClick={() => handleReject(req.borrowId)}
                            disabled={currentLoading}
                            style={{ 
                              borderRadius: '10px',
                              background: currentLoading === 'rejecting' ? 
                                "rgba(220, 53, 69, 0.7)" : 
                                "linear-gradient(45deg, #dc3545, #e83e8c)",
                              border: "none",
                              color: "#fff",
                              transition: "all 0.3s ease"
                            }}
                            onMouseEnter={(e) => {
                              if (!currentLoading) {
                                e.target.style.transform = "scale(1.05)";
                                e.target.style.boxShadow = "0 5px 15px rgba(220, 53, 69, 0.3)";
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!currentLoading) {
                                e.target.style.transform = "scale(1)";
                                e.target.style.boxShadow = "none";
                              }
                            }}
                          >
                            {currentLoading === 'rejecting' ? (
                              <>
                                <div className="spinner-border spinner-border-sm" role="status"></div>
                                Rejecting...
                              </>
                            ) : (
                              <>
                                <i className="fas fa-times small"></i>
                                Reject
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Footer */}
                  <div className="card-footer bg-transparent border-0 pt-0 px-3 pb-3">
                    <small className="text-muted small">
                      <i className="fas fa-clock me-1"></i>
                      Awaiting approval
                    </small>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default BorrowRequests;