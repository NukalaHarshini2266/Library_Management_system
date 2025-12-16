import React, { useState } from "react";
import axios from "../api/axiosConfig";
import { useLocation, useNavigate } from "react-router-dom";

const VerifyOtp = () => {
  const [otp, setOtp] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/api/users/verify-otp", { email, otp });
      alert(res.data.message);
      navigate("/reset-password", { state: { email } });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow-lg p-4 rounded-4" style={{ width: "400px", backgroundColor: "#e3f2fd" }}>
        <h2 className="text-center mb-4 text-primary fw-bold">Verify OTP</h2>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Enter OTP</label>
            <input
              type="text"
              className="form-control form-control-lg"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              placeholder="Enter the OTP sent to your email"
            />
          </div>

          <button type="submit" className="btn btn-primary w-100 fw-semibold btn-lg">
            Verify OTP
          </button>
        </form>

        <p className="mt-3 text-center">
          Didn't receive OTP?{" "}
          <a href="/forgot-password" className="text-decoration-none text-danger fw-bold">
            Resend
          </a>
        </p>
      </div>
    </div>
  );
};

export default VerifyOtp;
