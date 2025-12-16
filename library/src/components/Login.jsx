import React, { useState } from "react";
import axios from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

// 👁️ Eye icon component
const EyeIcon = ({ open }) => (
  open ? (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.94 10.94 0 0 1 12 20c-7 0-11-8-11-8a20.8 20.8 0 0 1 5.06-6.06" />
      <path d="M1 1l22 22" />
      <path d="M9.88 9.88a3 3 0 0 0 4.24 4.24" />
    </svg>
  )
);

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // ✅ SECURE LOGIN HANDLER (NO SECRET KEY)
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = { email, password };

      const res = await axios.post("/api/users/login", payload);
      const data = res.data;

      // ✅ Store full login data safely
      const userData = {
        id: data.id || null,
        name: data.name || "Unknown",
        email: email,
        role: data.role || "USER",
        token: data.token || "",
      };

      localStorage.setItem("user", JSON.stringify(userData));

      alert(`✅ Login successful! Role: ${userData.role}`);
      navigate("/dashboard");

    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "❌ Login failed!");
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
        <h2 className="text-center mb-4 fw-bold text-warning">Login</h2>

        <form onSubmit={handleSubmit}>

          {/* ✅ EMAIL */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              className="form-control form-control-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>

          {/* ✅ PASSWORD */}
          <div className="mb-3">
            <label className="form-label fw-semibold">Password</label>
            <div className="input-group input-group-lg">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={() => setShowPassword((s) => !s)}
              >
                <EyeIcon open={showPassword} />
              </button>
            </div>
          </div>

          {/* ✅ LOGIN BUTTON */}
          <button
            type="submit"
            className="btn btn-warning w-100 fw-semibold btn-lg"
          >
            Login
          </button>
        </form>

        {/* ✅ USER LINKS */}
        <p className="mt-3 text-center">
          <a href="/forgot-password" className="text-decoration-none text-danger fw-bold me-3">
            Forgot Password?
          </a>
          <br />
          Don't have an account?{" "}
          <a href="/register" className="text-decoration-none fw-bold" style={{ color: "#8c6239" }}>
            Register
          </a>
        </p>

      </div>
    </div>
  );
};

export default Login;
