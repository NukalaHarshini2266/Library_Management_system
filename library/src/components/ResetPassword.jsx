
import React, { useState } from "react";
import api from "../api/axiosConfig";
import { useLocation, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // toggle state
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/users/reset-password", { email, newPassword });
      alert(res.data.message);
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to reset password");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow-lg p-4 rounded-4" style={{ width: "400px", backgroundColor: "#fce4ec" }}>
        <h2 className="text-center mb-4 text-danger fw-bold">Reset Password</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">New Password</label>
            <div className="input-group input-group-lg">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="Enter your new password"
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword((s) => !s)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-danger w-100 fw-semibold btn-lg">
            Reset Password
          </button>
        </form>

        <p className="mt-3 text-center">
          Remembered your password?{" "}
          <a href="/login" className="text-decoration-none text-primary fw-bold">
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;
