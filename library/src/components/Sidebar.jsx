import React from "react";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ show, onClose, user, onShowBooks, onShowBorrowed, onShowBorrowRequests }) => {
  const navigate = useNavigate();
  const role = (user && user.role) || localStorage.getItem("role") || "USER";

  const userName = (user && user.name) || "Unknown User";
  const userEmail = (user && user.email) || localStorage.getItem("email") || "";

  return (
    <div
      className={`position-fixed top-0 start-0 h-100 bg-light shadow ${show ? "d-block" : "d-none"}`}
      style={{ width: "250px", zIndex: 1050 }}
      onClick={onClose}
    >
      <div className="p-3" onClick={(e) => e.stopPropagation()} style={{ height: "100%", overflowY: "auto" }}>
        <div className="text-center mb-3">
          <h5 className="text-primary mb-1">{role} Panel</h5>
          <p className="mb-0 fw-semibold">{userName}</p>
          <small className="text-muted">{userEmail}</small>
        </div>
        <hr />
        <ul className="list-unstyled">

          <li className="mb-2">
            <button className="btn btn-outline-primary w-100" onClick={() => { onShowBooks(); onClose(); }}>
              Show Books
            </button>
          </li>

          <li className="mb-2">
              <button
                className="btn btn-outline-primary w-100"
                onClick={() => {
                  navigate("/borrowed-books");
                  onClose();
                }}
              >
                Borrowed Books
              </button>
          </li>


          {(role === "ADMIN" || role === "LIBRARIAN") && (
            <>
              <li className="mb-2">
                <button className="btn btn-outline-secondary w-100" onClick={() => { navigate("/registered-users"); onClose(); }}>
                  User Management
                </button>
              </li>
              <li className="mb-2">
              <button className="btn btn-outline-warning w-100" onClick={() => { navigate("/add-book"); onClose(); }}>
                Add Book
              </button>
            </li>

              <li className="mb-2">
                <button className="btn btn-outline-success w-100" onClick={() =>{
                          navigate("/borrow-requests"); // Navigate to Borrow Requests page
                          onClose();                   // Close sidebar
                        }}>
                  📚 Borrow Requests
                </button>
              </li>
              <li className="mb-2">
                <button className="btn btn-outline-success w-100" onClick={() =>{
                          navigate("/admin/notifications"); // Navigate to Borrow Requests page
                          onClose();                   // Close sidebar
                        }}>
                          Admin Notifications
                </button>
              </li>

              
              <li className="mb-2">
                <button className="btn btn-outline-primary w-100" onClick={() => { navigate("/membership-admin"); onClose(); }}>
                  🧾 Manage Memberships
                </button>
              </li>
              {/* ⭐ Pending Reservations Button */}
              <li className="mb-2">
                <button
                  className="btn btn-outline-warning w-100"
                  onClick={() => {
                    navigate("/pending-reservations");
                    onClose();
                  }}
                >
                  ⏳ Pending Reservations
                </button>
              </li>
            </>
          )}
                    {/* Common buttons visible to all roles */}
          <li className="mb-2">
            <button
              className="btn btn-outline-primary w-100"
              onClick={() => {
                navigate("/membership-transactions");
                onClose();
              }}
            >
              Membership Transactions
            </button>
          </li>

          <li className="mb-2">
            <button
              className="btn btn-outline-primary w-100"
              onClick={() => {
                navigate("/penalty-transactions");
                onClose();
              }}
            >
              Penalty Transactions
            </button>
          </li>


          {role === "USER" && (
            <>
              <li className="mb-2">
                <button className="btn btn-outline-primary w-100" onClick={() => navigate("/membership")}>
                  💎 Upgrade Membership
                </button>
              </li>

              <li className="mb-2">
                <button className="btn btn-outline-primary w-100" onClick={() => navigate("/mymembership")}>
                  My Membership
                </button>
              </li>
              <li className="mb-2">
                <button className="btn btn-outline-primary w-100" onClick={() => navigate("/member/notifications")}>
                  My Notifications
                </button>
              </li>
              

              <li className="mb-2">
                <button className="btn btn-warning w-100" onClick={() => navigate("/forgotpassword")}>
                  Forgot Password
                </button>
              </li>
            </>
          )}

          <li className="mt-4">
            <button className="btn btn-danger w-100" onClick={() => { localStorage.clear(); navigate("/login"); }}>
              Logout
            </button>
          </li>

        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
