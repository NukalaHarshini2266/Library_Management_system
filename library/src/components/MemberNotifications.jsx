import React, { useEffect, useState } from "react";
import axios from "axios";

const MemberNotifications = () => {
  const [email, setEmail] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("all"); // all, borrowed, reservations

  // Get email from localStorage
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.email) {
      setEmail(user.email);
    } else {
      setError("Please log in to view notifications.");
      setLoading(false);
    }
  }, []);

  // Fetch all notifications
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!email) return;

      try {
        const [
          paidRes,
          dueSoonRes,
          overdueRes,
          reservationRes
        ] = await Promise.all([
          api.get(`http://localhost:8081/api/borrow/notifications/paid?email=${email}`),
          api.get(`http://localhost:8081/api/borrow/notifications/due-soon?email=${email}`),
          api.get(`http://localhost:8081/api/borrow/notifications/overdue?email=${email}`),
          api.get(`http://localhost:8081/api/reservation/updates?email=${email}`)
        ]);

        // Map each type to a unified notification format with proper categorization
        const borrowed = [
          ...(paidRes.data || []).map(n => ({
            id: `paid-${n.id || Date.now()}`,
            type: "PAID",
            category: "borrowed",
            bookName: n.book?.title || n.book?.id,
            date: n.date || n.paymentDate || n.borrowDateTime,
            message: `Payment confirmed for "${n.book?.title || n.book?.id}"`,
            priority: "LOW"
          })),
          ...(dueSoonRes.data || []).map(n => ({
            id: `due-soon-${n.id || Date.now()}`,
            type: "DUE_SOON",
            category: "borrowed",
            bookName: n.book?.title || n.book?.id,
            date: n.date || n.dueDateTime,
            message: `"${n.book?.title || n.book?.id}" is due soon`,
            priority: "MEDIUM"
          })),
          ...(overdueRes.data || []).map(n => ({
            id: `overdue-${n.id || Date.now()}`,
            type: "OVERDUE",
            category: "borrowed",
            bookName: n.book?.title || n.book?.id,
            date: n.date || n.dueDateTime,
            message: `"${n.book?.title || n.book?.id}" is overdue`,
            priority: "HIGH"
          }))
        ];

        const reservations = (reservationRes.data || []).map(r => ({
          id: `reservation-${r.id || Date.now()}`,
          type: r.status, // PENDING, NOTIFIED, COMPLETED, CANCELLED, EXPIRED
          category: "reservation",
          bookName: r.book?.title || "Unknown",
          date: r.reservationDate,
          message: getReservationMessage(r.status, r.book?.title || "Unknown"),
          priority: getReservationPriority(r.status)
        }));

        // Combine all notifications
        const combined = [...borrowed, ...reservations];

        // Sort by date descending (recent first)
        combined.sort((a, b) => new Date(b.date) - new Date(a.date));

        setNotifications(combined);
      } catch (err) {
        console.error("Error fetching notifications:", err);
        setError("Failed to fetch notifications. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, [email]);

  // Helper functions for reservations
  const getReservationMessage = (status, bookName) => {
    switch (status) {
      case "PENDING": return `Your reservation for "${bookName}" is pending approval`;
      case "NOTIFIED": return `"${bookName}" is ready for pickup`;
      case "COMPLETED": return `You've successfully picked up "${bookName}"`;
      case "CANCELLED": return `Your reservation for "${bookName}" was cancelled`;
      case "EXPIRED": return `Your reservation for "${bookName}" has expired`;
      default: return `Reservation update for "${bookName}"`;
    }
  };

  const getStatusBadgeVariant = (type) => {
    switch (type) {
      case "PAID":
      case "COMPLETED":
        return "success";
      case "DUE_SOON":
        return "warning";
      case "OVERDUE":
        return "danger";
      case "PENDING":
        return "info";
      case "NOTIFIED":
        return "primary";
      case "CANCELLED":
      case "EXPIRED":
        return "secondary";
      default:
        return "light";
    }
  };

  const getStatusIcon = (type) => {
    switch (type) {
      case "PAID": return "💰";
      case "DUE_SOON": return "⏰";
      case "OVERDUE": return "⚠️";
      case "PENDING": return "⏳";
      case "NOTIFIED": return "📬";
      case "COMPLETED": return "✅";
      case "CANCELLED": return "❌";
      case "EXPIRED": return "⏰";
      default: return "ℹ️";
    }
  };

  const getReservationPriority = (status) => {
    switch (status) {
      case "NOTIFIED": return "HIGH";
      case "CANCELLED": 
      case "EXPIRED": return "MEDIUM";
      default: return "LOW";
    }
  };

  // Filter notifications based on active tab
  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === "all") return true;
    return notification.category === activeTab;
  });

  // Group notifications by date
  const groupNotificationsByDate = (notifs) => {
    const groups = {};
    notifs.forEach(notification => {
      const date = new Date(notification.date).toDateString();
      if (!groups[date]) {
        groups[date] = [];
      }
      groups[date].push(notification);
    });
    return groups;
  };

  const notificationGroups = groupNotificationsByDate(filteredNotifications);

  const renderNotification = (notification) => (
    <div
      key={notification.id}
      className={`d-flex align-items-start p-3 border-bottom notification-item ${
        notification.priority === "HIGH" ? "high-priority" : ""
      }`}
      style={{
        borderLeft: `4px solid ${
          notification.priority === "HIGH" ? "#dc3545" : 
          notification.priority === "MEDIUM" ? "#ffc107" : "#28a745"
        }`,
        background: "rgba(255, 255, 255, 0.7)",
        transition: "all 0.3s ease",
        margin: "2px",
        borderRadius: "8px"
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "rgba(255, 255, 255, 0.9)";
        e.currentTarget.style.transform = "translateX(5px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "rgba(255, 255, 255, 0.7)";
        e.currentTarget.style.transform = "translateX(0)";
      }}
    >
      <div className="me-3 fs-5" style={{ minWidth: "30px" }}>
        {getStatusIcon(notification.type)}
      </div>
      <div className="flex-grow-1">
        <div className="d-flex justify-content-between align-items-start mb-1">
          <span className="fw-medium text-dark">{notification.message}</span>
          <small className="text-muted ms-2 text-nowrap">
            {new Date(notification.date).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </small>
        </div>
        <div className="d-flex justify-content-between align-items-center">
          <small className="text-muted">
            Book: {notification.bookName}
          </small>
          <span className={`badge bg-${getStatusBadgeVariant(notification.type)}`}>
            {notification.type.replace('_', ' ')}
          </span>
        </div>
      </div>
    </div>
  );

  if (loading) return (
    <div 
      className="min-vh-100 py-4"
      style={{
        background: "linear-gradient(135deg, #f5e6ca 0%, #cbb279 40%, #8c6239 100%)",
        minHeight: "100vh"
      }}
    >
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card glass-effect">
              <div className="card-body text-center py-5">
                <div className="spinner-border text-primary mb-3" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="text-muted mb-0">Loading your notifications...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  if (error) return (
    <div 
      className="min-vh-100 py-4"
      style={{
        background: "linear-gradient(135deg, #f5e6ca 0%, #cbb279 40%, #8c6239 100%)",
        minHeight: "100vh"
      }}
    >
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card glass-effect border-danger">
              <div className="card-body text-center py-4">
                <div className="text-danger mb-3" style={{ fontSize: "2rem" }}>⚠️</div>
                <h5 className="text-danger">Unable to Load Notifications</h5>
                <p className="text-muted">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div 
      className="min-vh-100 py-4"
      style={{
        background: "linear-gradient(135deg, #f5e6ca 0%, #cbb279 40%, #8c6239 100%)",
        minHeight: "100vh",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
      }}
    >
      <div className="container mt-4">
        <div className="row justify-content-center">
          <div className="col-12">
            <div className="card glass-effect shadow-sm border-0">
              {/* Header */}
              <div 
                className="card-header py-3 border-0"
                style={{
                  background: "linear-gradient(135deg, rgba(139, 69, 19, 0.8) 0%, rgba(160, 82, 45, 0.7) 100%)",
                  backdropFilter: "blur(10px)"
                }}
              >
                <div className="d-flex justify-content-between align-items-center">
                  <h4 className="mb-0 text-white">
                    <i className="bi bi-bell-fill me-2"></i>
                    Notifications
                  </h4>
                  <span 
                    className="badge fs-6 px-3 py-2"
                    style={{
                      background: "rgba(255, 255, 255, 0.2)",
                      backdropFilter: "blur(10px)"
                    }}
                  >
                    {notifications.length}
                  </span>
                </div>
              </div>

              {/* Tabs */}
              <div 
                className="card-header py-3 border-0"
                style={{
                  background: "rgba(245, 230, 202, 0.6)",
                  backdropFilter: "blur(10px)"
                }}
              >
                <ul className="nav nav-pills nav-fill">
                  <li className="nav-item">
                    <button
                      className={`nav-link rounded-pill mx-1 ${activeTab === "all" ? "active tab-active" : "tab-inactive"}`}
                      onClick={() => setActiveTab("all")}
                      style={{
                        border: "none",
                        transition: "all 0.3s ease"
                      }}
                    >
                      All Notifications
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link rounded-pill mx-1 ${activeTab === "borrowed" ? "active tab-active" : "tab-inactive"}`}
                      onClick={() => setActiveTab("borrowed")}
                      style={{
                        border: "none",
                        transition: "all 0.3s ease"
                      }}
                    >
                      Books
                    </button>
                  </li>
                  <li className="nav-item">
                    <button
                      className={`nav-link rounded-pill mx-1 ${activeTab === "reservation" ? "active tab-active" : "tab-inactive"}`}
                      onClick={() => setActiveTab("reservation")}
                      style={{
                        border: "none",
                        transition: "all 0.3s ease"
                      }}
                    >
                      Reservations
                    </button>
                  </li>
                </ul>
              </div>

              {/* Notifications Content */}
              <div 
                className="card-body p-0"
                style={{
                  background: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(10px)",
                  borderRadius: "0 0 12px 12px"
                }}
              >
                {filteredNotifications.length === 0 ? (
                  <div className="text-center py-5">
                    <div className="text-muted mb-3" style={{ fontSize: "3rem" }}>📭</div>
                    <h5 className="text-dark">No notifications</h5>
                    <p className="text-muted">You're all caught up! Check back later for updates.</p>
                  </div>
                ) : (
                  <div className="notifications-list p-2">
                    {Object.entries(notificationGroups).map(([date, notifs]) => (
                      <div key={date} className="mb-3">
                        <div 
                          className="px-3 py-2 rounded"
                          style={{
                            background: "rgba(203, 178, 121, 0.4)",
                            backdropFilter: "blur(5px)",
                            margin: "0 8px"
                          }}
                        >
                          <small className="text-uppercase fw-bold text-dark">
                            {date === new Date().toDateString() ? "Today" : 
                             date === new Date(Date.now() - 86400000).toDateString() ? "Yesterday" : 
                             new Date(date).toLocaleDateString('en-US', { 
                               weekday: 'long', 
                               year: 'numeric', 
                               month: 'long', 
                               day: 'numeric' 
                             })}
                          </small>
                        </div>
                        <div className="mt-2">
                          {notifs.map(renderNotification)}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div 
                className="card-footer py-3 border-0 text-center"
                style={{
                  background: "rgba(245, 230, 202, 0.6)",
                  backdropFilter: "blur(10px)"
                }}
              >
                <small className="text-dark">
                  {filteredNotifications.length} notification(s) displayed
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .glass-effect {
          background: rgba(255, 255, 255, 0.2);
          backdrop-filter: blur(15px);
          border: 1px solid rgba(255, 255, 255, 0.3);
          border-radius: 16px;
        }
        
        .tab-active {
          background: linear-gradient(135deg, #8c6239 0%, #cbb279 100%) !important;
          color: white !important;
          box-shadow: 0 4px 15px rgba(140, 98, 57, 0.3);
        }
        
        .tab-inactive {
          background: rgba(255, 255, 255, 0.8) !important;
          color: #8c6239 !important;
        }
        
        .tab-inactive:hover {
          background: rgba(140, 98, 57, 0.1) !important;
          transform: translateY(-2px);
        }
        
        .high-priority {
          background: rgba(220, 53, 69, 0.1) !important;
        }
      `}</style>
    </div>
  );
};

export default MemberNotifications;