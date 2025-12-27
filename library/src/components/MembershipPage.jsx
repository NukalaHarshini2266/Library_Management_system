import React, { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";

const MembershipPage = () => {
  const [user, setUser] = useState(null);
  const [contact, setContact] = useState("");
  const [plan, setPlan] = useState("");
  const [duration, setDuration] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
      // Simulate loading animation
      setTimeout(() => setIsLoading(false), 1000);
    }
  }, []);

  const handleProceed = () => {
    if (!plan || !duration) {
      alert("Please select both plan and duration!");
      return;
    }
    localStorage.setItem(
      "membershipPurchase",
      JSON.stringify({ contact, plan, duration })
    );
    navigate("/payment");
  };

  if (isLoading) {
    return (
      <div 
        className="min-vh-100 d-flex align-items-center justify-content-center"
        style={{
          background: "linear-gradient(135deg, #f5e6ca 0%, #cbb279 40%, #8c6239 100%)",
          backgroundAttachment: "fixed"
        }}
      >
        <div className="text-center">
          <div className="spinner-border text-warning" style={{ width: "3rem", height: "3rem" }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-dark fw-semibold">Loading Membership Plans...</p>
        </div>
      </div>
    );
  }

  if (!user) return <div className="text-center mt-5">Loading...</div>;

  return (
    <div 
      className="min-vh-100 d-flex align-items-center justify-content-center"
      style={{
        background: "linear-gradient(135deg, #f5e6ca 0%, #cbb279 40%, #8c6239 100%)",
        backgroundAttachment: "fixed",
        padding: "20px"
      }}
    >
      {/* Animated Background Elements */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-15px) rotate(3deg); }
          }
          @keyframes fadeInUp {
            from {
              opacity: 0;
              transform: translateY(30px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
          }
          @keyframes slideInRight {
            from {
              opacity: 0;
              transform: translateX(30px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
          .animated-card {
            animation: fadeInUp 0.8s ease-out;
          }
          .animated-input {
            animation: slideInRight 0.6s ease-out;
            animation-fill-mode: both;
          }
          .floating-element {
            animation: float 6s ease-in-out infinite;
          }
          .pulse-button:hover {
            animation: pulse 0.6s ease-in-out;
          }
        `}
      </style>

      {/* Floating Background Elements */}
      <div 
        className="position-absolute"
        style={{
          top: "15%",
          left: "10%",
          width: "80px",
          height: "80px",
          background: "radial-gradient(circle, rgba(139, 69, 19, 0.1) 0%, transparent 70%)",
          borderRadius: "50%",
          animation: "float 8s ease-in-out infinite",
        }}
      ></div>
      <div 
        className="position-absolute"
        style={{
          bottom: "20%",
          right: "12%",
          width: "60px",
          height: "60px",
          background: "radial-gradient(circle, rgba(203, 178, 121, 0.15) 0%, transparent 70%)",
          borderRadius: "50%",
          animation: "float 6s ease-in-out infinite",
          animationDelay: "2s"
        }}
      ></div>
      <div 
        className="position-absolute"
        style={{
          top: "40%",
          right: "20%",
          width: "100px",
          height: "100px",
          background: "radial-gradient(circle, rgba(245, 230, 202, 0.1) 0%, transparent 70%)",
          borderRadius: "50%",
          animation: "float 7s ease-in-out infinite",
          animationDelay: "1s"
        }}
      ></div>

      <div 
        className="card p-4 border-0 shadow-lg animated-card"
        style={{ 
          maxWidth: "450px", 
          width: "100%",
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(203, 178, 121, 0.3)",
          borderRadius: "20px",
          transform: "translateY(0)",
          transition: "all 0.3s ease"
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-10px)";
          e.currentTarget.style.boxShadow = "0 25px 50px rgba(0,0,0,0.15)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)";
          e.currentTarget.style.boxShadow = "0 15px 30px rgba(0,0,0,0.1)";
        }}
      >
        {/* Header with Animation */}
        <div className="text-center mb-4" style={{ animation: "fadeInUp 0.8s ease-out" }}>
          <div 
            className="mb-3"
            style={{
              width: "70px",
              height: "70px",
              background: "linear-gradient(45deg, #cbb279, #8c6239)",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              margin: "0 auto",
              boxShadow: "0 8px 20px rgba(139, 69, 19, 0.3)",
              animation: "pulse 2s infinite"
            }}
          >
            <span style={{ fontSize: "1.8rem", color: "white" }}>👑</span>
          </div>
          <h4 className="fw-bold text-dark mb-1">Membership Purchase</h4>
          <p className="text-muted small mb-0">Choose your membership plan and unlock exclusive benefits</p>
        </div>

        {/* Form Fields with Staggered Animations */}
        <div className="mb-3 animated-input" style={{ animationDelay: "0.1s" }}>
          <label className="form-label text-dark small fw-medium">👤 Name</label>
          <input 
            type="text" 
            className="form-control" 
            value={user.name} 
            disabled 
            style={{
              transition: "all 0.3s ease",
              border: "1px solid #cbb279"
            }}
          />
        </div>

        <div className="mb-3 animated-input" style={{ animationDelay: "0.2s" }}>
          <label className="form-label text-dark small fw-medium">📧 Email</label>
          <input 
            type="email" 
            className="form-control" 
            value={user.email} 
            disabled 
            style={{
              transition: "all 0.3s ease",
              border: "1px solid #cbb279"
            }}
          />
        </div>

        <div className="mb-3 animated-input" style={{ animationDelay: "0.3s" }}>
          <label className="form-label text-dark small fw-medium">📞 Contact Number</label>
          <input
            type="text"
            className="form-control"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            placeholder="Enter your contact number"
            required
            style={{
              transition: "all 0.3s ease",
              border: "1px solid #cbb279"
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#8c6239";
              e.target.style.boxShadow = "0 0 0 2px rgba(139, 69, 19, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#cbb279";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>

        <div className="mb-3 animated-input" style={{ animationDelay: "0.4s" }}>
          <label className="form-label text-dark small fw-medium">📋 Select Plan</label>
          <select
            className="form-select"
            value={plan}
            onChange={(e) => setPlan(e.target.value)}
            style={{
              transition: "all 0.3s ease",
              border: "1px solid #cbb279"
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#8c6239";
              e.target.style.boxShadow = "0 0 0 2px rgba(139, 69, 19, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#cbb279";
              e.target.style.boxShadow = "none";
            }}
          >
            <option value="">Choose your plan...</option>
            <option value="STANDARD">📚 Standard (Borrow 3 Books/Month)</option>
            <option value="PREMIUM">⭐ Premium (Borrow 5 Books/Month)</option>
            <option value="GOLD">👑 Gold (Borrow 10 Books/Month)</option>
          </select>
        </div>

        <div className="mb-4 animated-input" style={{ animationDelay: "0.5s" }}>
          <label className="form-label text-dark small fw-medium">⏰ Duration</label>
          <select
            className="form-select"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            style={{
              transition: "all 0.3s ease",
              border: "1px solid #cbb279"
            }}
            onFocus={(e) => {
              e.target.style.borderColor = "#8c6239";
              e.target.style.boxShadow = "0 0 0 2px rgba(139, 69, 19, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "#cbb279";
              e.target.style.boxShadow = "none";
            }}
          >
            <option value="">Select duration...</option>
            <option value="3">3 Months</option>
            <option value="6">6 Months</option>
            <option value="9">9 Months</option>
          </select>
        </div>

        {/* Animated Button */}
        <button 
          className="btn w-100  pulse-button"
          onClick={handleProceed}
          style={{
            background: "linear-gradient(45deg, #cbb279, #8c6239)",
            border: "none",
            color: "#ffffff",
            fontWeight: "600",
            padding: "12px",
            borderRadius: "12px",
            fontSize: "1.1rem",
            transition: "all 0.3s ease",
            animation: "fadeInUp 0.8s ease-out 0.6s both"
          }}
          onMouseEnter={(e) => {
            e.target.style.transform = "translateY(-2px)";
            e.target.style.boxShadow = "0 8px 20px rgba(139, 69, 19, 0.4)";
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = "translateY(0)";
            e.target.style.boxShadow = "none";
          }}
        >
          💳 Proceed to Payment
        </button>

        
      </div>
    </div>
  );
};

export default MembershipPage;