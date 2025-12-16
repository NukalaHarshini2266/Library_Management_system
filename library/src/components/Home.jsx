import React from "react";
import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5e6ca 0%, #cbb279 40%, #8c6239 100%)",
        backgroundAttachment: "fixed",
        color: "#2c2c2c",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Animated Background Elements */}
      <div style={{
        position: "absolute",
        top: "10%",
        left: "5%",
        width: "120px",
        height: "120px",
        background: "radial-gradient(circle, rgba(139, 69, 19, 0.1) 0%, transparent 70%)",
        borderRadius: "50%",
        animation: "float 6s ease-in-out infinite",
      }}></div>
      <div style={{
        position: "absolute",
        bottom: "15%",
        right: "8%",
        width: "80px",
        height: "80px",
        background: "radial-gradient(circle, rgba(203, 178, 121, 0.15) 0%, transparent 70%)",
        borderRadius: "50%",
        animation: "float 8s ease-in-out infinite",
      }}></div>
      <div style={{
        position: "absolute",
        top: "35%",
        right: "15%",
        width: "100px",
        height: "100px",
        background: "radial-gradient(circle, rgba(245, 230, 202, 0.1) 0%, transparent 70%)",
        borderRadius: "50%",
        animation: "float 7s ease-in-out infinite",
      }}></div>

      {/* Navbar */}
      <nav className="navbar navbar-expand-lg navbar-dark" style={{ 
        backgroundColor: "#3b2f2f",
        boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
        position: "relative",
        zIndex: 10,
        padding: "0.4rem 0"
      }}>
        <div className="container">
          <Link className="navbar-brand fw-bold text-warning fs-3" to="/" style={{
            textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
            transition: "all 0.3s ease"
          }}>
            📚 MyLibrary
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active text-light fw-semibold" to="/" style={{
                  transition: "all 0.3s ease",
                  borderRadius: "5px",
                  padding: "8px 16px",
                  fontSize: "1.3rem"
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(245, 230, 202, 0.2)";
                  e.target.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "transparent";
                  e.target.style.transform = "translateY(0)";
                }}
                >Home</Link>
              </li>
              <li className="nav-item">
                <Link className="nav-link text-light fw-semibold" to="/about" style={{
                  transition: "all 0.3s ease",
                  borderRadius: "5px",
                  padding: "8px 16px",
                  fontSize: "1.3rem"
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(245, 230, 202, 0.2)";
                  e.target.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "transparent";
                  e.target.style.transform = "translateY(0)";
                }}
                >About</Link>
              </li>
            </ul>
            <div className="d-flex">
              <Link to="/login" className="btn btn-outline-warning me-2 fw-semibold" style={{
                transition: "all 0.3s ease",
                borderWidth: "2px"
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 5px 15px rgba(255, 193, 7, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }}
              >Login</Link>
              <Link to="/register" className="btn btn-warning fw-semibold text-dark" style={{
                transition: "all 0.3s ease"
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 8px 20px rgba(255, 193, 7, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "none";
              }}
              >Register</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div
        className="d-flex flex-column justify-content-center align-items-center text-center"
        style={{
          height: "85vh",
          padding: "0 20px",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.92)",
            backdropFilter: "blur(10px)",
            padding: "50px 40px",
            borderRadius: "25px",
            boxShadow: `
              0 25px 50px rgba(0,0,0,0.25),
              0 0 0 1px rgba(139, 69, 19, 0.1),
              inset 0 1px 0 rgba(255,255,255,0.8)
            `,
            maxWidth: "800px",
            border: "1px solid rgba(203, 178, 121, 0.3)",
            transition: "all 0.4s ease",
            position: "relative",
            overflow: "hidden"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-8px) scale(1.02)";
            e.currentTarget.style.boxShadow = `
              0 35px 60px rgba(0,0,0,0.3),
              0 0 0 1px rgba(139, 69, 19, 0.2),
              inset 0 1px 0 rgba(255,255,255,0.8)
            `;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0) scale(1)";
            e.currentTarget.style.boxShadow = `
              0 25px 50px rgba(0,0,0,0.25),
              0 0 0 1px rgba(139, 69, 19, 0.1),
              inset 0 1px 0 rgba(255,255,255,0.8)
            `;
          }}
        >
          {/* Subtle background pattern */}
          <div style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              linear-gradient(45deg, transparent 0%, rgba(203, 178, 121, 0.03) 50%, transparent 100%),
              radial-gradient(circle at 20% 80%, rgba(245, 230, 202, 0.05) 0%, transparent 50%)
            `,
            zIndex: -1
          }}></div>

          <h1 className="display-4 fw-bold text-dark mb-3" style={{
            textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
            background: "linear-gradient(45deg, #3b2f2f, #8c6239)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}>
            Library Management System
          </h1>
          <p className="lead text-secondary" style={{
            fontSize: "1.3rem",
            textShadow: "1px 1px 2px rgba(0,0,0,0.05)",
          }}>
            Manage your books, users, and library efficiently with a modern, intuitive interface.
          </p>
          <div className="mt-4">
            <Link 
              to="/register" 
              className="btn btn-lg btn-warning text-dark fw-semibold me-3 shadow-sm"
              style={{
                transition: "all 0.3s ease",
                padding: "15px 35px",
                borderRadius: "12px",
                border: "none",
                background: "linear-gradient(45deg, #ffc107, #ffb300)"
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-3px) scale(1.05)";
                e.target.style.boxShadow = "0 12px 25px rgba(255, 193, 7, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0) scale(1)";
                e.target.style.boxShadow = "0 4px 8px rgba(0,0,0,0.2)";
              }}
            >
              Get Started
            </Link>
            <Link 
              to="/login" 
              className="btn btn-lg btn-outline-dark fw-semibold shadow-sm"
              style={{
                transition: "all 0.3s ease",
                padding: "15px 35px",
                borderRadius: "12px",
                border: "2px solid #3b2f2f"
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-3px)";
                e.target.style.background = "#3b2f2f";
                e.target.style.color = "white";
                e.target.style.boxShadow = "0 8px 20px rgba(59, 47, 47, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.background = "transparent";
                e.target.style.color = "#3b2f2f";
                e.target.style.boxShadow = "0 4px 8px rgba(0,0,0,0.1)";
              }}
            >
              Login
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-center text-light py-2" style={{ 
        backgroundColor: "#3b2f2f",
        borderTop: "3px solid #cbb279",
        boxShadow: "0 -4px 20px rgba(0,0,0,0.2)",
        position: "relative",
        zIndex: 10
      }}>
        <p className="mb-0" style={{
          textShadow: "1px 1px 2px rgba(0,0,0,0.3)"
        }}>© 2025 MyLibrary | Designed for better learning</p>
      </footer>

      {/* Floating animation */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-12px) rotate(2deg); }
          }
        `}
      </style>
    </div>
  );
};

export default Home;