import React, { useEffect, useState } from "react";
import axios from "../api/axiosConfig";

const MyMembershipPage = () => {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.email) {
      fetchMemberships(user.email);
    } else {
      setError("User not logged in.");
      setLoading(false);
    }
  }, []);

  const fetchMemberships = async (email) => {
    try {
      const res = await axios.get(`/api/members/user/${email}`);
      setMemberships(Array.isArray(res.data) ? res.data : [res.data]);
    } catch (err) {
      console.error(err);
      setError("No memberships found.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #f5e6ca 0%, #cbb279 40%, #ae7e4eff 70%)",
      backgroundAttachment: "fixed",
      padding: "20px 0"
    }}>
      <div className="container">
        {loading ? (
          <div className="text-center mt-5 text-dark">Loading...</div>
        ) : error || memberships.length === 0 ? (
          <div className="text-center mt-5">
            <h4 className="text-dark">{error || "No active memberships."}</h4>
          </div>
        ) : (
          <>
            <h3 className="text-center mb-4 text-dark fw-bold mt-2">My Memberships</h3>
            <div className="row">
              {memberships.map((m) => (
                <div key={m.id} className="col-md-4 mb-4">
                  <div className="card shadow border-0">
                    <div
                      className={`card-header text-white ${
                        m.planType === "GOLD"
                          ? "bg-warning"
                          : m.planType === "PREMIUM"
                          ? "bg-primary"
                          : "bg-secondary"
                      }`}
                    >
                      <h5 className="mb-0 text-center">{m.planType} Plan</h5>
                    </div>
                    <div className="card-body">
                      <p><strong>Start Date:</strong> {m.joinDate}</p>
                      <p><strong>Expiry Date:</strong> {m.expiryDate}</p>
                      <p><strong>Duration:</strong> {m.durationMonths} months</p>
                      <p><strong>Books Borrowed:</strong> {m.booksBorrowedThisMonth}</p>
                      <p><strong>Monthly Limit:</strong> {m.monthlyLimit}</p>
                      <p><strong>Contact:</strong> {m.contactNumber}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MyMembershipPage;