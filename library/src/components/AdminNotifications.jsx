import React, { useEffect, useState } from "react";
import api from "axios";
import { useNavigate } from "react-router-dom";

const AdminNotifications = () => {
  const [email, setEmail] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.email) setEmail(user.email);
    else setLoading(false);
  }, []);

  useEffect(() => { email && fetchNotifications(); }, [email]);

  const fetchNotifications = async () => {
    try {
      const [damagedRes, lowStockRes] = await Promise.all([
        api.get("http://localhost:8081/api/books/damaged"),
        api.get("http://localhost:8081/api/books/low-stock")
      ]);

      const damaged = damagedRes.data.map(book => ({
        id: `damaged-${book.id}`,
        type: "DAMAGED_BOOK",
        category: "damaged",
        bookName: book.title || "Unknown Book",
        date: book.updatedAt || new Date().toISOString(),
        message: `Damaged book: "${book.title}"`,
        damageNotes: book.damageNotes,
        damageFee: book.damageFee,
        damagedCopies: book.damagedCopies || 0,
        availableCopies: book.availableCopies || 0,
        bookId: book.id,
        priority: "HIGH"
      }));

      const lowStock = lowStockRes.data.map(book => ({
        id: `lowstock-${book.id}`,
        type: "LOW_STOCK",
        category: "stock",
        bookName: book.title || "Unknown Book",
        date: book.updatedAt || new Date().toISOString(),
        message: `Low stock: "${book.title}"`,
        availableCopies: book.availableCopies || 0,
        bookId: book.id,
        priority: "LOW"
      }));

      const combined = [...damaged, ...lowStock].sort((a, b) => 
        (a.priority === "HIGH" && b.priority !== "HIGH") ? -1 : new Date(b.date) - new Date(a.date)
      );

      setNotifications(combined);
    } catch (err) {
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRepair = async (bookId, bookName, damagedCopies) => {
    const repairCount = prompt(
      `🔧 Repair Book\n\nBook: ${bookName}\nDamaged Copies: ${damagedCopies}\n\nEnter number of copies to repair:`,
      "1"
    );

    if (!repairCount) return;
    const count = parseInt(repairCount);
    
    if (count <= 0 || count > damagedCopies) {
      alert(`Invalid! Enter 1 to ${damagedCopies}.`);
      return;
    }

    if (!confirm(`Repair ${count} copy/copies of "${bookName}"?`)) return;

    try {
      await api.post("http://localhost:8081/api/books/repair", null, {
        params: { bookId, repairedCount: count }
      });
      alert(`✅ ${count} copies repaired!`);
      fetchNotifications();
    } catch (error) {
      alert("❌ Repair failed: " + (error.response?.data || error.message));
    }
  };

  const handleRestock = (bookId, bookName) => {
    bookId ? navigate(`/update-book/${bookId}`) : alert(`Cannot restock "${bookName}"`);
  };

  const filteredNotifications = notifications.filter(n => 
    activeTab === "all" || n.category === activeTab
  );

  const groupNotifications = (notifs) => {
    const groups = {};
    notifs.forEach(n => {
      const date = new Date(n.date).toDateString();
      groups[date] = [...(groups[date] || []), n];
    });
    return groups;
  };

  const formatDateHeader = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    if (date.toDateString() === today.toDateString()) return "Today";
    const yesterday = new Date(today); yesterday.setDate(yesterday.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) return "Yesterday";
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  const stats = {
    total: notifications.length,
    lowStock: notifications.filter(n => n.type === "LOW_STOCK").length,
    damaged: notifications.filter(n => n.type === "DAMAGED_BOOK").length
  };

  if (loading) return (
    <div className="min-vh-100 py-4" style={{ background: "linear-gradient(135deg, #f5e6ca 0%, #cbb279 40%, #8c6239 100%)" }}>
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-12">
            <div className="card glass-effect-light">
              <div className="card-body text-center py-5">
                <div className="spinner-border text-primary mb-3"></div>
                <p className="text-muted">Loading admin notifications...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-vh-100 py-4" style={{ 
      background: "linear-gradient(135deg, #f5e6ca 0%, #cbb279 40%, #8c6239 100%)",
      fontFamily: "'Segoe UI', sans-serif" 
    }}>
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-12 col-lg-12">
            {/* Notifications Card */}
            <div className="card glass-effect-light shadow-sm border-0">
              
              {/* Header */}
              <div className="card-header py-3 border-0" style={{ 
                background: "linear-gradient(135deg, rgba(245, 230, 202, 0.9) 0%, rgba(203, 178, 121, 0.8) 100%)",
                backdropFilter: "blur(10px)"
              }}>
                <div className="d-flex justify-content-between align-items-center">
                  <h4 className="mb-0 text-dark"><i className="bi bi-bell-fill me-2"></i>Admin Notifications</h4>
                  <span className="badge fs-6 px-3 py-2" style={{ background: "rgba(255, 255, 255, 0.6)", color: "#8c6239" }}>
                    {stats.total}
                  </span>
                </div>
              </div>

              {/* Tabs */}
              <div className="card-header py-3 border-0" style={{ background: "rgba(255, 255, 255, 0.7)" }}>
                <ul className="nav nav-pills nav-fill gap-2">
                  {["all", "damaged", "stock"].map(tab => (
                    <li key={tab} className="nav-item">
                      <button className={`nav-link rounded-pill ${activeTab === tab ? "active tab-active-light" : "tab-inactive-light"}`}
                              onClick={() => setActiveTab(tab)} style={{ border: "none", transition: "all 0.3s ease" }}>
                        {tab === "all" ? "All Alerts" : tab === "damaged" ? "Damaged Books" : "Low Stock"}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Notifications Content */}
              <div className="card-body p-0" style={{ background: "rgba(255, 255, 255, 0.3)", backdropFilter: "blur(10px)" }}>
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-5">
                    <div className="text-muted mb-3" style={{ fontSize: "3rem" }}>🎉</div>
                    <h5 className="text-dark">No alerts</h5>
                    <p className="text-muted">Everything is running smoothly!</p>
                  </div>
                ) : (
                  <div className="notifications-list p-2">
                    {Object.entries(groupNotifications(filteredNotifications)).map(([date, notifs]) => (
                      <div key={date} className="mb-3">
                        <div className="px-3 py-2 rounded" style={{ background: "rgba(203, 178, 121, 0.4)", margin: "0 8px" }}>
                          <small className="text-uppercase fw-bold text-dark">{formatDateHeader(date)}</small>
                        </div>
                        <div className="mt-2">
                          {notifs.map(notification => (
                            <div key={notification.id} className={`d-flex align-items-start p-3 border-bottom notification-item ${notification.priority === "HIGH" ? "high-priority" : ""}`}
                                 style={{ 
                                   borderLeft: `4px solid ${notification.priority === "HIGH" ? "#e74c3c" : "#f39c12"}`,
                                   background: "rgba(255, 255, 255, 0.9)",
                                   borderRadius: "8px",
                                   margin: "2px",
                                   transition: "all 0.3s ease",
                                   cursor: "pointer"
                                 }}
                                 onMouseEnter={e => { e.currentTarget.style.transform = "translateX(5px)"; e.currentTarget.style.background = "rgba(255, 255, 255, 1)"; }}
                                 onMouseLeave={e => { e.currentTarget.style.transform = "translateX(0)"; e.currentTarget.style.background = "rgba(255, 255, 255, 0.9)"; }}>
                              <div className="me-3 fs-5">{notification.type === "DAMAGED_BOOK" ? "⚠️" : "📦"}</div>
                              <div className="flex-grow-1">
                                <div className="d-flex justify-content-between align-items-start mb-2">
                                  <span className="fw-medium text-dark">{notification.message}</span>
                                  <span className={`badge bg-${notification.type === "DAMAGED_BOOK" ? "danger" : "warning"} ms-2`}>
                                    {notification.type === "DAMAGED_BOOK" ? "DAMAGED BOOK" : "LOW STOCK"}
                                  </span>
                                </div>
                                <div className="d-flex justify-content-between align-items-center">
                                  <small className="text-muted">
                                    Book: {notification.bookName}
                                    {notification.type === "DAMAGED_BOOK" && (
                                      <span className="ms-2">
                                        • Damaged: {notification.damagedCopies} • Available: {notification.availableCopies}
                                        {notification.damageNotes && ` • Notes: ${notification.damageNotes}`}
                                        {notification.damageFee && ` • Fee: ₹${notification.damageFee}`}
                                      </span>
                                    )}
                                    {notification.type === "LOW_STOCK" && (
                                      <span className="ms-2">• Available: {notification.availableCopies} copies</span>
                                    )}
                                  </small>
                                  {notification.type === "LOW_STOCK" && (
                                    <button className="btn btn-primary btn-sm ms-2 restock-btn"
                                            onClick={(e) => { e.stopPropagation(); handleRestock(notification.bookId, notification.bookName); }}
                                            style={{ background: "linear-gradient(135deg, #a8e6cf 0%, #7bc8a4 100%)", border: "none", borderRadius: "20px", padding: "5px 15px" }}>
                                      Restock
                                    </button>
                                  )}
                                  {notification.type === "DAMAGED_BOOK" && (
                                    <button className="btn btn-warning btn-sm ms-2 repair-btn"
                                            onClick={(e) => { e.stopPropagation(); handleRepair(notification.bookId, notification.bookName, notification.damagedCopies); }}
                                            style={{ background: "linear-gradient(135deg, #ffd166 0%, #ffb347 100%)", border: "none", borderRadius: "20px", padding: "5px 15px" }}>
                                      Repair
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="card-footer py-3 border-0 text-center" style={{ background: "rgba(255, 255, 255, 0.7)" }}>
                <small className="text-dark">
                  {filteredNotifications.length} alert(s) displayed • Low Stock: {stats.lowStock} • Damaged Books: {stats.damaged}
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .glass-effect-light {
          background: rgba(255, 255, 255, 0.4);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.5);
          border-radius: 16px;
        }
        .tab-active-light {
          background: linear-gradient(135deg, #cbb279 0%, #ddba96 100%) !important;
          color: white !important;
          box-shadow: 0 4px 15px rgba(203, 178, 121, 0.3);
        }
        .tab-inactive-light {
          background: rgba(255, 255, 255, 0.8) !important;
          color: #8c6239 !important;
        }
        .tab-inactive-light:hover {
          background: rgba(203, 178, 121, 0.2) !important;
          transform: translateY(-2px);
        }
        .notification-item:hover .notification-icon { transform: scale(1.2); }
        .high-priority { background: rgba(231, 76, 60, 0.08) !important; }
      `}</style>
    </div>
  );
};

export default AdminNotifications;