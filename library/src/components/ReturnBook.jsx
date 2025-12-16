import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

export default function ReturnBook() {
  const { borrowId } = useParams();
  const [record, setRecord] = useState(null);
  const [paymentDone, setPaymentDone] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("CARD");
  const [showPopup, setShowPopup] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch borrow record
  useEffect(() => {
    axios
      .get(`http://localhost:8081/api/borrow/${borrowId}`)
      .then((res) => {
        setRecord(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error loading record:", err);
        setLoading(false);
      });
  }, [borrowId]);

  const handlePenaltyPayment = async () => {
    try {
      const user = record.user;

      await axios.post("http://localhost:8081/api/transactions/add", {
        transactionType: "PENALTY",
        borrowId: record.borrowId,
        userId: user.id,
        name: user.name,
        email: user.email,
        amount: record.penalty,
        description: "Book return penalty",
        paymentMethod: paymentMethod.toUpperCase(),
        bookName: record.book?.title,
        penaltyAmount: record.penalty
      });

      await axios.post(
        `http://localhost:8081/api/borrow/return/complete?borrowId=${record.borrowId}`
      );

      setPaymentDone(true);
      setShowPopup(true);
    } catch (err) {
      console.error(err);
      alert("Payment or return failed!");
    }
  };

  if (loading) return (
    <div 
      className="min-vh-100 py-4 d-flex align-items-center justify-content-center"
      style={{
        background: "linear-gradient(135deg, #f5e6ca 0%, #cbb279 40%, #8c6239 100%)",
      }}
    >
      <div className="text-center">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-dark">Loading return details...</p>
      </div>
    </div>
  );

  if (!record) return (
    <div 
      className="min-vh-100 py-4 d-flex align-items-center justify-content-center"
      style={{
        background: "linear-gradient(135deg, #f5e6ca 0%, #cbb279 40%, #8c6239 100%)",
      }}
    >
      <div className="text-center">
        <h4 className="text-danger">Record not found</h4>
        <p className="text-muted">Unable to load borrow record details.</p>
      </div>
    </div>
  );

  return (
    <div 
      className="min-vh-100 py-4"
      style={{
        background: "linear-gradient(135deg, #f5e6ca 0%, #cbb279 40%, #8c6239 100%)",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-lg-10">
            {/* Header Card */}
            <div className="card glass-effect shadow-lg border-0 mb-4">
              <div 
                className="card-header border-0 py-4"
                style={{
                  background: "linear-gradient(135deg, rgba(139, 69, 19, 0.9) 0%, rgba(160, 82, 45, 0.8) 100%)",
                }}
              >
                <div className="text-center">
                  <h2 className="text-white mb-2">📚 Book Return Process</h2>
                  <p className="text-light mb-0">Borrow ID: <strong>{borrowId}</strong></p>
                </div>
              </div>
            </div>

            {/* Main Content Card */}
            <div className="card glass-effect shadow-lg border-0">
              <div className="card-body p-4">
                <div className="row">
                  {/* Left Column - Book & Member Info */}
                  <div className="col-md-6">
                    {/* Book Information */}
                    <div className="info-section mb-4">
                      <h5 
                        className="section-title mb-3 p-2 rounded"
                        style={{
                          background: "linear-gradient(135deg, rgba(245, 230, 202, 0.8) 0%, rgba(203, 178, 121, 0.6) 100%)",
                          color: "#8c6239"
                        }}
                      >
                        📖 Book Information
                      </h5>
                      <div className="ps-3">
                        <InfoRow label="Title" value={record.book?.title} />
                        <InfoRow label="Author" value={record.book?.author} />
                        <InfoRow label="Book ID" value={record.book?.id} />
                      </div>
                    </div>

                    {/* Member Information */}
                    <div className="info-section">
                      <h5 
                        className="section-title mb-3 p-2 rounded"
                        style={{
                          background: "linear-gradient(135deg, rgba(245, 230, 202, 0.8) 0%, rgba(203, 178, 121, 0.6) 100%)",
                          color: "#8c6239"
                        }}
                      >
                        👤 Member Information
                      </h5>
                      <div className="ps-3">
                        <InfoRow label="Name" value={record.user?.name} />
                        <InfoRow label="Email" value={record.user?.email} />
                        <InfoRow label="Member ID" value={record.memberId} />
                      </div>
                    </div>
                  </div>

                  {/* Right Column - Borrow & Payment Info */}
                  <div className="col-md-6">
                    {/* Borrow Information */}
                    <div className="info-section mb-4">
                      <h5 
                        className="section-title mb-3 p-2 rounded"
                        style={{
                          background: "linear-gradient(135deg, rgba(245, 230, 202, 0.8) 0%, rgba(203, 178, 121, 0.6) 100%)",
                          color: "#8c6239"
                        }}
                      >
                        📅 Borrow Information
                      </h5>
                      <div className="ps-3">
                        <InfoRow label="Status" value={record.status} badge={true} />
                        <InfoRow label="Borrow Date" value={record.borrowDateTime || "—"} />
                        <InfoRow label="Due Date" value={record.dueDateTime || "—"} />
                        <InfoRow label="Return Date" value={record.returnDateTime || "—"} />
                      </div>
                    </div>

                    {/* Damage Information */}
                    {record.damaged && (
                      <div className="info-section mb-4">
                        <h5 
                          className="section-title mb-3 p-2 rounded"
                          style={{
                            background: "linear-gradient(135deg, rgba(220, 53, 69, 0.1) 0%, rgba(220, 53, 69, 0.05) 100%)",
                            color: "#dc3545",
                            borderLeft: "4px solid #dc3545"
                          }}
                        >
                          ⚠️ Damage Information
                        </h5>
                        <div className="ps-3">
                          <InfoRow label="Damaged" value="Yes" badge={true} variant="danger" />
                          <InfoRow label="Damage Notes" value={record.damageNotes || "No details"} />
                          <InfoRow label="Damage Fee" value={`₹${record.damageFee || 0}`} />
                        </div>
                      </div>
                    )}

                    {/* Penalty Payment Section */}
                    {record.penalty > 0 && (
                      <div className="info-section">
                        <h5 
                          className="section-title mb-3 p-2 rounded"
                          style={{
                            background: "linear-gradient(135deg, rgba(255, 193, 7, 0.2) 0%, rgba(255, 193, 7, 0.1) 100%)",
                            color: "#856404",
                            borderLeft: "4px solid #ffc107"
                          }}
                        >
                          💰 Penalty Payment
                        </h5>
                        <div className="ps-3">
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <strong className="text-dark">Total Penalty:</strong>
                            <span className="fs-5 fw-bold text-danger">₹{record.penalty}</span>
                          </div>
                          
                          <div className="mb-3">
                            <label className="form-label fw-semibold">Payment Method:</label>
                            <select
                              className="form-select"
                              value={paymentMethod}
                              onChange={(e) => setPaymentMethod(e.target.value)}
                              disabled={paymentDone}
                              style={{
                                border: "1px solid #cbb279",
                                borderRadius: "8px"
                              }}
                            >
                              <option value="CARD">Card</option>
                              <option value="UPI">UPI</option>
                              <option value="NETBANKING">Net Banking</option>
                            </select>
                          </div>

                          <button
                            className="btn w-100 py-2 fw-semibold"
                            onClick={handlePenaltyPayment}
                            disabled={paymentDone}
                            style={{
                              background: paymentDone 
                                ? "#28a745"
                                : "linear-gradient(135deg, #8c6239 0%, #cbb279 100%)",
                              color: "white",
                              border: "none",
                              borderRadius: "10px",
                              transition: "all 0.3s ease"
                            }}
                            onMouseEnter={(e) => {
                              if (!paymentDone) {
                                e.target.style.transform = "translateY(-2px)";
                                e.target.style.boxShadow = "0 6px 20px rgba(140, 98, 57, 0.4)";
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (!paymentDone) {
                                e.target.style.transform = "translateY(0)";
                                e.target.style.boxShadow = "none";
                              }
                            }}
                          >
                            {paymentDone ? "✅ Payment Completed" : "Pay & Return Book"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Success Popup */}
      {showPopup && (
        <div style={{
          position: "fixed",
          top: 0, left: 0,
          width: "100%", height: "100%",
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 9999
        }}>
          <div 
            className="card glass-effect border-0 shadow-lg"
            style={{
              minWidth: "350px",
              maxWidth: "90%"
            }}
          >
            <div 
              className="card-header border-0 text-center py-4"
              style={{
                background: "linear-gradient(135deg, #28a745 0%, #20c997 100%)",
              }}
            >
              <h4 className="text-white mb-0">✅ Payment Successful!</h4>
            </div>
            <div className="card-body text-center py-4">
              <div className="mb-3" style={{ fontSize: "3rem" }}>🎉</div>
              <h5 className="text-success mb-3">Book Return Completed</h5>
              <p className="text-muted mb-3">
                ₹{record.penalty} paid and book returned successfully.
              </p>
              <button
                className="btn py-2 px-4"
                onClick={() => setShowPopup(false)}
                style={{
                  background: "linear-gradient(135deg, #8c6239 0%, #cbb279 100%)",
                  color: "white",
                  border: "none",
                  borderRadius: "8px"
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .glass-effect {
          background: rgba(255, 255, 255, 0.25);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 16px;
        }
        
        .info-section {
          background: rgba(255, 255, 255, 0.7);
          border-radius: 12px;
          padding: 15px;
          border: 1px solid rgba(203, 178, 121, 0.3);
        }
        
        .section-title {
          font-weight: 600;
          font-size: 1.1rem;
        }
      `}</style>
    </div>
  );
}

// Helper component for info rows
const InfoRow = ({ label, value, badge = false, variant = "primary" }) => (
  <div className="d-flex justify-content-between align-items-center py-2 border-bottom border-light">
    <span className="text-muted">{label}:</span>
    {badge ? (
      <span className={`badge bg-${variant} text-capitalize`}>
        {value}
      </span>
    ) : (
      <strong className="text-dark text-end" style={{ maxWidth: "60%" }}>
        {value || "N/A"}
      </strong>
    )}
  </div>
);