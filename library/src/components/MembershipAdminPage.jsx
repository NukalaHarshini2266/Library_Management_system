import React, { useEffect, useState } from "react";
import axios from "../api/axiosConfig";

const MembershipAdminPage = () => {
  const [memberships, setMemberships] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchMemberships();
  }, []);

  const fetchMemberships = async () => {
    try {
      const res = await axios.get("/api/members/all");
      setMemberships(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("fetchMemberships error:", err);
      setMemberships([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this member?")) return;
    try {
      await axios.delete(`/api/members/delete/${id}`);
      alert("Member deleted successfully!");
      fetchMemberships();
    } catch (err) {
      console.error(err);
      alert("Failed to delete member.");
    }
  };

  const handleUpdate = async (id) => {
    const newPlan = prompt("Enter new plan (STANDARD / PREMIUM / GOLD):");
    const duration = prompt("Enter duration (in months 3/6/9):");
    if (!newPlan || !duration) return;

    try {
      await axios.put(`/api/members/update/${id}`, {
        planType: newPlan,
        durationMonths: parseInt(duration),
      });
      alert("Membership updated successfully!");
      fetchMemberships();
    } catch (err) {
      console.error(err);
      alert("Failed to update membership!");
    }
  };

  const renderTable = (planType) => {
    const filtered = memberships.filter(
      (m) => m.planType && m.planType.toUpperCase() === planType
    );

    const planColors = {
      "STANDARD": { bg: "rgba(108, 117, 125, 0.1)", border: "1px solid #6c757d", header: "#6c757d" },
      "PREMIUM": { bg: "rgba(13, 110, 253, 0.1)", border: "1px solid #0d6efd", header: "#0d6efd" },
      "GOLD": { bg: "rgba(255, 193, 7, 0.1)", border: "1px solid #ffc107", header: "#ffc107" }
    };

    const planColor = planColors[planType] || planColors["STANDARD"];

    return (
      <div className="mb-5">
        <h5 
          className="text-center mt-4 p-2 rounded"
          style={{
            background: planColor.bg,
            color: planColor.header,
            border: planColor.border,
            fontWeight: "600"
          }}
        >
          {planType} Members
        </h5>
        <div 
          className="table-responsive rounded shadow-sm"
          style={{
            background: "rgba(255, 255, 255, 0.95)",
            border: planColor.border
          }}
        >
          <table className="table table-hover mb-0">
            <thead style={{ background: planColor.bg }}>
              <tr>
                <th style={{ padding: "12px", color: planColor.header }}>ID</th>
                <th style={{ padding: "12px", color: planColor.header }}>Email</th>
                <th style={{ padding: "12px", color: planColor.header }}>Contact</th>
                <th style={{ padding: "12px", color: planColor.header }}>Join Date</th>
                <th style={{ padding: "12px", color: planColor.header }}>Expiry Date</th>
                <th style={{ padding: "12px", color: planColor.header }}>Duration</th>
                <th style={{ padding: "12px", color: planColor.header }}>Monthly Limit</th>
                <th style={{ padding: "12px", color: planColor.header }}>Borrowed This Month</th>
                <th style={{ padding: "12px", color: planColor.header }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length > 0 ? (
                filtered.map((m) => (
                  <tr 
                    key={m.id}
                    style={{ transition: "all 0.3s ease" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = "rgba(245, 230, 202, 0.3)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "";
                    }}
                  >
                    <td style={{ padding: "10px" }}>{m.id}</td>
                    <td style={{ padding: "10px" }}>{m.email}</td>
                    <td style={{ padding: "10px" }}>{m.contactNumber}</td>
                    <td style={{ padding: "10px" }}>{m.joinDate}</td>
                    <td style={{ padding: "10px" }}>{m.expiryDate}</td>
                    <td style={{ padding: "10px" }}>{m.durationMonths}</td>
                    <td style={{ padding: "10px" }}>{m.monthlyLimit}</td>
                    <td style={{ padding: "10px" }}>{m.booksBorrowedThisMonth}</td>
                    <td style={{ padding: "10px" }}>
                      <button
                        className="btn btn-sm me-2"
                        onClick={() => handleUpdate(m.id)}
                        style={{
                          background: "linear-gradient(45deg, #cbb279, #8c6239)",
                          border: "none",
                          color: "#fff",
                          fontWeight: "600",
                          transition: "all 0.3s ease"
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = "translateY(-2px)";
                          e.target.style.boxShadow = "0 4px 8px rgba(139, 69, 19, 0.3)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = "translateY(0)";
                          e.target.style.boxShadow = "none";
                        }}
                      >
                        Update
                      </button>
                      <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(m.id)}
                        style={{
                          fontWeight: "600",
                          transition: "all 0.3s ease"
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.transform = "translateY(-2px)";
                          e.target.style.boxShadow = "0 4px 8px rgba(220, 53, 69, 0.3)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.transform = "translateY(0)";
                          e.target.style.boxShadow = "none";
                        }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center text-muted py-4">
                    No members found for this plan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  };

  return (
    <div 
      style={{
        minHeight: "100vh",
        background: "#f5e6ca", // Only first light color
        padding: "20px 0"
      }}
    >
      <div className="container">
        <h3 className="text-center mb-4 fw-bold text-dark">
          👑 Membership Management (Admin)
        </h3>

        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-dark">Loading memberships...</p>
          </div>
        ) : (
          <>
            {renderTable("STANDARD")}
            {renderTable("PREMIUM")}
            {renderTable("GOLD")}
          </>
        )}
      </div>
    </div>
  );
};

export default MembershipAdminPage;