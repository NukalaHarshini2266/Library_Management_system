import React, { useState } from "react";
import axios from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import { FaEnvelope, FaArrowLeft } from "react-icons/fa";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post("/api/users/forgot-password", { email });
      alert(res.data.message);
      navigate("/verify-otp", { state: { email } });
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Error sending OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100"
      style={{
        background: "linear-gradient(135deg, #f5e6ca 0%, #cbb279 40%, #8c6239 100%)",
        backgroundAttachment: "fixed",
      }}
    >
      <div
        className="card shadow-lg p-4 rounded-4"
        style={{
          width: "400px",
          backgroundColor: "#fdf6e3",
          border: "2px solid #cbb279",
          boxShadow: "0px 8px 25px rgba(0, 0, 0, 0.3)",
        }}
      >
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}
          className="btn btn-sm position-absolute"
          style={{
            top: "20px",
            left: "20px",
            background: "transparent",
            border: "2px solid #8c6239",
            color: "#8c6239",
            borderRadius: "8px",
            padding: "8px 12px",
            transition: "all 0.3s ease"
          }}
          onMouseEnter={(e) => {
            e.target.style.background = "#8c6239";
            e.target.style.color = "#ffffff";
          }}
          onMouseLeave={(e) => {
            e.target.style.background = "transparent";
            e.target.style.color = "#8c6239";
          }}
        >
          <FaArrowLeft size={14} />
        </button>

        <div className="text-center mb-4">
          <div className="mb-3">
            <div style={{
              width: "60px",
              height: "60px",
              background: "linear-gradient(45deg, #cbb279, #8c6239)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
              boxShadow: "0 4px 15px rgba(139, 69, 19, 0.3)"
            }}>
              <FaEnvelope size={24} color="#ffffff" />
            </div>
          </div>
          <h2 className="text-center mb-4 fw-bold text-warning">Forgot Password</h2>
          <p style={{ color: "#5a4a42", fontSize: "0.95rem" , marginBottom: "0.1rem" }}>
            Enter your email address and we'll send you an OTP to reset your password
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <div className="input-group input-group-lg">
              <span 
                className="input-group-text"
                style={{
                  background: "#f5e6ca",
                  border: "1px solid #cbb279",
                  borderRight: "none",
                  color: "#8c6239"
                }}
              >
                <FaEnvelope />
              </span>
              <input
                type="email"
                className="form-control"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your registered email"
                style={{
                  border: "1px solid #cbb279",
                  borderLeft: "none"
                }}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn btn-warning w-100 fw-semibold btn-lg"
            disabled={isLoading}
            style={{
              transition: "all 0.3s ease",
              background: isLoading ? "#cbb279" : "linear-gradient(45deg, #cbb279, #8c6239)",
              border: "none",
              color: "#ffffff"
            }}
            onMouseEnter={(e) => {
              if (!isLoading) {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 8px 20px rgba(139, 69, 19, 0.3)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isLoading) {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }
            }}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Sending OTP...
              </>
            ) : (
              "Send OTP"
            )}
          </button>
        </form>

        <p className="mt-3 text-center" style={{ color: "#5a4a42" }}>
          Remember your password?{" "}
          <a 
            href="/login" 
            className="text-decoration-none fw-bold" 
            style={{ color: "#8c6239" }}
            onMouseEnter={(e) => {
              e.target.style.textShadow = "0 0 5px rgba(139, 69, 19, 0.3)";
            }}
            onMouseLeave={(e) => {
              e.target.style.textShadow = "none";
            }}
          >
            Login
          </a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;