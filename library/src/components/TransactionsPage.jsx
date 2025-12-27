import React, { useEffect, useState } from "react";
import api from "../api/axiosConfig";

const TransactionsPage = ({ transactionType }) => {
  const [transactions, setTransactions] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role || "USER";

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      let res;
      if (role === "ADMIN" || role === "LIBRARIAN") {
        res = await api.get("/api/transactions/all");
      } else {
        res = await api.get(`/api/transactions/user/${user.email}`);
      }

      const all = res.data || [];
      const filteredData = all.filter(
        (t) => t.transactionType === transactionType
      );
      setTransactions(all);
      setFiltered(filteredData);
    } catch (err) {
      console.error(err);
      setError("Failed to load transactions.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) =>
    dateStr ? new Date(dateStr).toLocaleString() : "—";

  return (
    <div 
      style={{ 
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5e6ca 0%, #cbb279 40%, #8c6239 100%)",
        backgroundAttachment: "fixed",
        padding: "20px 0"
      }}
    >
      <div className="container">
        <h3 className="fw-bold text-dark mb-4 mt-3">
          {transactionType === "MEMBERSHIP"
            ? "Membership Transactions"
            : "Penalty Transactions"}
        </h3>

        {loading ? (
          <div className="text-center mt-5 text-dark">Loading...</div>
        ) : error ? (
          <div className="alert alert-danger text-center">{error}</div>
        ) : filtered.length === 0 ? (
          <div 
            className="alert text-center"
            style={{
              background: "rgba(255, 255, 255, 0.9)",
              border: "1px solid #cbb279",
              color: "#8c6239"
            }}
          >
            No {transactionType.toLowerCase()} transactions found.
          </div>
        ) : (
          <div 
            className="table-responsive rounded-3 shadow-lg"
            style={{
              background: "rgba(255, 255, 255, 0.95)"
            }}
          >
            <table className="table table-bordered table-striped mb-0">
              <thead className="table-warning">
                <tr>
                  <th>Transaction ID</th>
                  {(role === "ADMIN" || role === "LIBRARIAN") && <th>User</th>}
                  <th>Email</th>
                  <th>Payment Method</th>

                  {/* Show Amount column only for Membership */}
                  {transactionType === "MEMBERSHIP" && <th>Amount (₹)</th>}

                  {transactionType === "MEMBERSHIP" && (
                    <>
                      <th>Plan Type</th>
                      <th>Duration (Months)</th>
                    </>
                  )}

                  {transactionType === "PENALTY" && (
                    <>
                      <th>Book Name</th>
                      <th>Penalty Amount (₹)</th>
                    </>
                  )}
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((t) => (
                  <tr key={t.id}>
                    <td>{t.transactionId}</td>
                    {(role === "ADMIN" || role === "LIBRARIAN") && (
                      <td>{t.name || "—"}</td>
                    )}
                    <td>{t.email || "—"}</td>
                    <td>{t.paymentMethod || "—"}</td>

                    {/* Only show generic amount for membership */}
                    {transactionType === "MEMBERSHIP" && <td>{t.amount || 0}</td>}

                    {transactionType === "MEMBERSHIP" && (
                      <>
                        <td>{t.planType || "—"}</td>
                        <td>{t.durationMonths || 0}</td>
                      </>
                    )}

                    {transactionType === "PENALTY" && (
                      <>
                        <td>{t.bookName || "—"}</td>
                        <td>{t.penaltyAmount || 0}</td>
                      </>
                    )}

                    <td>{formatDate(t.transactionDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default TransactionsPage;