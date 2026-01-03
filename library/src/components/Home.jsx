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
                <a className="nav-link text-light fw-semibold" href="#features" style={{
                  transition: "all 0.3s ease",
                  borderRadius: "5px",
                  padding: "8px 16px",
                  fontSize: "1.1rem"
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(245, 230, 202, 0.2)";
                  e.target.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "transparent";
                  e.target.style.transform = "translateY(0)";
                }}
                >Features</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-light fw-semibold" href="#modules" style={{
                  transition: "all 0.3s ease",
                  borderRadius: "5px",
                  padding: "8px 16px",
                  fontSize: "1.1rem"
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(245, 230, 202, 0.2)";
                  e.target.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "transparent";
                  e.target.style.transform = "translateY(0)";
                }}
                >Modules</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-light fw-semibold" href="#plans" style={{
                  transition: "all 0.3s ease",
                  borderRadius: "5px",
                  padding: "8px 16px",
                  fontSize: "1.1rem"
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(245, 230, 202, 0.2)";
                  e.target.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "transparent";
                  e.target.style.transform = "translateY(0)";
                }}
                >Plans</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-light fw-semibold" href="#support" style={{
                  transition: "all 0.3s ease",
                  borderRadius: "5px",
                  padding: "8px 16px",
                  fontSize: "1.1rem"
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "rgba(245, 230, 202, 0.2)";
                  e.target.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "transparent";
                  e.target.style.transform = "translateY(0)";
                }}
                >Support</a>
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

      {/* Hero Section with consistent spacing */}
      <div
        className="d-flex flex-column justify-content-center align-items-center text-center"
        style={{
          padding: "110px 15px", // Consistent spacing on all devices
          position: "relative",
          zIndex: 2,
        }}
      >
        <div
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            padding: "80px 30px",
            borderRadius: "25px",
            boxShadow: `
              0 20px 40px rgba(0,0,0,0.25),
              0 0 0 1px rgba(139, 69, 19, 0.15),
              inset 0 1px 0 rgba(255,255,255,0.8)
            `,
            maxWidth: "1000px",
            width: "100%",
            border: "1px solid rgba(203, 178, 121, 0.3)",
            transition: "all 0.4s ease",
            position: "relative",
            overflow: "hidden",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-8px) scale(1.01)";
            e.currentTarget.style.boxShadow = `
              0 25px 50px rgba(0,0,0,0.3),
              0 0 0 1px rgba(139, 69, 19, 0.2),
              inset 0 1px 0 rgba(255,255,255,0.8)
            `;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0) scale(1)";
            e.currentTarget.style.boxShadow = `
              0 20px 40px rgba(0,0,0,0.25),
              0 0 0 1px rgba(139, 69, 19, 0.15),
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
              linear-gradient(45deg, transparent 0%, rgba(203, 178, 121, 0.04) 50%, transparent 100%),
              radial-gradient(circle at 20% 80%, rgba(245, 230, 202, 0.08) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(203, 178, 121, 0.06) 0%, transparent 50%)
            `,
            zIndex: -1
          }}></div>

          <h1 className="display-4 fw-bold text-dark mb-4" style={{
            textShadow: "3px 3px 6px rgba(0,0,0,0.15)",
            background: "linear-gradient(45deg, #3b2f2f, #8c6239, #cbb279)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            lineHeight: "1.3",
            fontSize: "clamp(2.5rem, 6vw, 3.8rem)",
            fontWeight: "800",
            letterSpacing: "-0.5px"
          }}>
            Library Management<br />Software
          </h1>
          <p className="lead text-secondary mb-4" style={{
            fontSize: "clamp(1.2rem, 3.2vw, 1.4rem)",
            textShadow: "1px 1px 2px rgba(0,0,0,0.05)",
            maxWidth: "800px",
            margin: "0 auto",
            lineHeight: "1.6"
          }}>
            Everything your library needs, in one place.<br/>
            Manage your books, users, and library efficiently with a modern, intuitive interface.
          </p>
          <div className="mt-4 d-flex flex-wrap justify-content-center gap-3">
            <Link 
              to="/register" 
              className="btn btn-lg btn-warning text-dark fw-semibold shadow-sm"
              style={{
                transition: "all 0.3s ease",
                padding: "clamp(14px, 3vw, 18px) clamp(30px, 5vw, 45px)",
                borderRadius: "12px",
                border: "none",
                background: "linear-gradient(45deg, #ffc107, #ffb300)",
                fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
                minWidth: "clamp(180px, 40vw, 220px)"
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-4px) scale(1.05)";
                e.target.style.boxShadow = "0 12px 25px rgba(255, 193, 7, 0.4)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0) scale(1)";
                e.target.style.boxShadow = "0 5px 15px rgba(0,0,0,0.2)";
              }}
            >
              Get Started Free
            </Link>
            <a 
              href="#features"
              className="btn btn-lg btn-outline-dark fw-semibold shadow-sm"
              style={{
                transition: "all 0.3s ease",
                padding: "clamp(14px, 3vw, 18px) clamp(30px, 5vw, 45px)",
                borderRadius: "12px",
                border: "2px solid #3b2f2f",
                fontSize: "clamp(1rem, 2.5vw, 1.2rem)",
                minWidth: "clamp(180px, 40vw, 220px)"
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = "translateY(-4px)";
                e.target.style.background = "#3b2f2f";
                e.target.style.color = "white";
                e.target.style.boxShadow = "0 8px 20px rgba(59, 47, 47, 0.3)";
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = "translateY(0)";
                e.target.style.background = "transparent";
                e.target.style.color = "#3b2f2f";
                e.target.style.boxShadow = "0 5px 15px rgba(0,0,0,0.1)";
              }}
            >
              Explore Features
            </a>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <section id="features" className="py-5" style={{ position: "relative", zIndex: 2 }}>
        <div className="container">
          <h2 className="text-center fw-bold mb-5" style={{
            color: "#3b2f2f",
            fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
            textShadow: "2px 2px 4px rgba(0,0,0,0.1)"
          }}>
            Key Features
          </h2>
          
          <div className="row g-4">
            {[
              { icon: "🔍", title: "Smart Cataloging", desc: "Create, tag and search titles instantly with author, category,publisher mapping." },
              { icon: "⚡", title: "Automated Circulation", desc: "Issue / return books in one click with auto due dates and fine calculation." },
              { icon: "🔔", title: "Alerts & Reminders", desc: "Notify students on due dates, reservations and premium membership renewals." },
              { icon: "👥", title: "Role-based Dashboards", desc: "Separate panels for Admin, Librarian and User with secure JWT authentication." }
            ].map((feature, index) => (
              <div className="col-md-6" key={index}>
                <div className="card border-0 h-100" style={{
                  background: "rgba(255, 255, 255, 0.92)",
                  borderRadius: "15px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                  transition: "all 0.3s ease",
                  overflow: "hidden"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-10px)";
                  e.currentTarget.style.boxShadow = "0 20px 40px rgba(139, 98, 57, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.08)";
                }}>
                  <div className="card-body text-center p-4">
                    <div className="mb-3" style={{ fontSize: "3rem", color: "#8c6239" }}>
                      {feature.icon}
                    </div>
                    <h4 className="fw-bold mb-3" style={{ color: "#3b2f2f" }}>
                      {feature.title}
                    </h4>
                    <p className="text-muted">
                      {feature.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modules Section */}
      <section id="modules" className="py-5" style={{ 
        background: "rgba(245, 230, 202, 0.1)",
        position: "relative",
        zIndex: 2
      }}>
        <div className="container">
          <h2 className="text-center fw-bold mb-3" style={{
            color: "#3b2f2f",
            fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
            textShadow: "2px 2px 4px rgba(0,0,0,0.1)"
          }}>
            Library Modules
          </h2>
          <p className="text-center lead mb-5" style={{ fontSize: "clamp(1.1rem, 2.5vw, 1.2rem)" }}>
            Everything your library needs, in one place.
          </p>
          
          <div className="row g-4 justify-content-center">
            {[
              { icon: "📖", title: "Borrow Management", desc: "One-click issuing & returns, due-date reminders and fine calculation without spreadsheets." },
              { icon: "📊", title: "Live Inventory", desc: "Real-time stock levels, low-stock alerts ,due date alerts for every title in your library." },
              { icon: "📈", title: "Member Insights", desc: "Track reading trends, popular genres and member activity to make better purchase decisions." }
            ].map((module, index) => (
              <div className="col-md-4" key={index}>
                <div className="card border-0 h-100" style={{
                  background: "rgba(255, 255, 255, 0.95)",
                  borderRadius: "15px",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
                  transition: "all 0.3s ease",
                  overflow: "hidden"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-10px)";
                  e.currentTarget.style.boxShadow = "0 20px 40px rgba(139, 98, 57, 0.15)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.08)";
                }}>
                  <div className="card-body text-center p-4">
                    <div className="mb-3" style={{ fontSize: "3rem", color: "#8c6239" }}>
                      {module.icon}
                    </div>
                    <h4 className="fw-bold mb-3" style={{ color: "#3b2f2f" }}>
                      {module.title}
                    </h4>
                    <p className="text-muted">
                      {module.desc}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section id="plans" className="py-5" style={{ 
        background: "rgba(59, 47, 47, 0.05)",
        position: "relative",
        zIndex: 2 
      }}>
        <div className="container">
          <h2 className="text-center fw-bold mb-5" style={{
            color: "#3b2f2f",
            fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
            textShadow: "2px 2px 4px rgba(0,0,0,0.1)"
          }}>
            Membership Plans
          </h2>
          
          <div className="row g-4 justify-content-center">
            {[
              { name: "Normal", books: "Normal users can borrow 1 book/month", price: "Free", popular: false },
              { name: "Standard", books: "Standard users can borrow3 books/month", price: "₹100/month", popular: true },
              { name: "Premium", books: "Premium users can borrow 5 books/month", price: "₹200/month", popular: false },
              { name: "Gold", books: "Gold users can borrow 10 books/month", price: "₹300/month", popular: false }
            ].map((plan, index) => (
              <div className="col-lg-3 col-md-6" key={index}>
                <div className="card h-100" style={{
                  background: "rgba(255, 255, 255, 0.95)",
                  borderRadius: "15px",
                  border: plan.popular ? "2px solid #ffc107" : "1px solid rgba(203, 178, 121, 0.2)",
                  transition: "all 0.3s ease",
                  overflow: "hidden",
                  position: "relative"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-10px)";
                  e.currentTarget.style.boxShadow = plan.popular 
                    ? "0 20px 40px rgba(255, 193, 7, 0.2)" 
                    : "0 15px 30px rgba(0,0,0,0.1)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                }}>
                  {plan.popular && (
                    <div style={{
                      position: "absolute",
                      top: "-12px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      background: "linear-gradient(135deg, #ffd166, #ffb347)",
                      color: "#2c2c2c",
                      padding: "4px 20px",
                      borderRadius: "20px",
                      fontSize: "0.9rem",
                      fontWeight: "bold",
                      boxShadow: "0 4px 12px rgba(255, 209, 102, 0.3)",
                    }}>
                      Most Popular
                    </div>
                  )}
                  <div className="card-body text-center p-4">
                    <h4 className="fw-bold mb-3" style={{ color: "#3b2f2f", marginTop: plan.popular ? "10px" : "0" }}>
                      {plan.name}
                    </h4>
                    <p className="text-muted mb-3">{plan.books}</p>
                    <div className="mb-4">
                      <h3 className="fw-bold" style={{ color: "#8c6239" }}>
                        {plan.price}
                      </h3>
                    </div>
                    <Link 
                      to="/register" 
                      className={`btn w-100 ${plan.popular ? 'btn-warning' : 'btn-outline-warning'}`}
                      style={{
                        transition: "all 0.3s ease",
                        borderWidth: "2px",
                        textDecoration: "none"
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = "translateY(-3px)";
                        e.target.style.boxShadow = "0 8px 20px rgba(255, 193, 7, 0.2)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow = "none";
                      }}
                    >
                      Get started
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Support Section - Updated with text instead of button and better mobile email display */}
      <section id="support" className="py-5" style={{ position: "relative", zIndex: 2 }}>
        <div className="container">
          <h2 className="text-center fw-bold mb-5" style={{
            color: "#3b2f2f",
            fontSize: "clamp(1.8rem, 4vw, 2.5rem)",
            textShadow: "2px 2px 4px rgba(0,0,0,0.1)"
          }}>
            Get In Touch
          </h2>
          
          <div className="card mx-auto" style={{
            background: "linear-gradient(135deg, #3b2f2f, #2d2323)",
            borderRadius: "20px",
            boxShadow: "0 20px 40px rgba(59, 47, 47, 0.3)",
            maxWidth: "800px",
            border: "none"
          }}>
            <div className="card-body text-center p-4 p-md-5">
              <div className="mb-4" style={{ fontSize: "clamp(2.5rem, 5vw, 3rem)", color: "#ffd166" }}>
                ✉️
              </div>
              <h3 className="fw-bold mb-4 text-white" style={{ fontSize: "clamp(1.5rem, 3vw, 1.8rem)" }}>
                Need Assistance?
              </h3>
              <p className="lead mb-4 text-white" style={{ 
                opacity: 0.9,
                fontSize: "clamp(1rem, 2.5vw, 1.2rem)"
              }}>
                Our dedicated support team is here to help you with onboarding, 
                data migration, and training sessions for your entire staff.
              </p>
              
              {/* Contact Support as text instead of button */}
              <div className="mb-4">
                <span className="fw-semibold text-white" style={{
                  fontSize: "1.2rem",
                  borderBottom: "2px solid #ffc107",
                  paddingBottom: "5px",
                  cursor: "pointer",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.target.style.color = "#ffd166";
                  e.target.style.borderBottomColor = "#ffd166";
                }}
                onMouseLeave={(e) => {
                  e.target.style.color = "#ffffff";
                  e.target.style.borderBottomColor = "#ffc107";
                }}
                onClick={() => window.location.href = "mailto:librarymanagement203@gmail.com"}>
                  Contact Support
                </span>
              </div>
              
              {/* Email with better mobile responsiveness */}
              <div className="d-flex align-items-center justify-content-center mb-4 p-3 rounded" style={{
                background: "rgba(255, 255, 255, 0.1)",
                maxWidth: "400px",
                margin: "0 auto",
                width: "100%",
                flexWrap: "wrap",
                textAlign: "center"
              }}>
                <span className="me-3" style={{ fontSize: "1.5rem", color: "#ffd166", flexShrink: 0 }}>📧</span>
                <span className="fs-5 fw-semibold text-white" style={{
                  wordBreak: "break-word",
                  overflowWrap: "break-word",
                  maxWidth: "100%"
                }}>
                  librarymanagement203@gmail.com
                </span>
              </div>
              
              <div className="mt-3 text-white-50" style={{ fontSize: "0.9rem" }}>
                We typically respond within 24 hours
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center text-light py-4" style={{ 
        backgroundColor: "#3b2f2f",
        borderTop: "3px solid #cbb279",
        boxShadow: "0 -4px 20px rgba(0,0,0,0.2)",
        position: "relative",
        zIndex: 10
      }}>
        <div className="container">
          <p className="mb-0" style={{
            textShadow: "1px 1px 2px rgba(0,0,0,0.3)",
            fontSize: "clamp(0.9rem, 2vw, 1rem)"
          }}>© 2025 MyLibrary | Designed for better learning</p>
        </div>
      </footer>

      {/* Floating animation */}
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            50% { transform: translateY(-12px) rotate(2deg); }
          }
          
          section {
            scroll-margin-top: 80px;
          }
          
          /* Improve text rendering for gradient text */
          h1 {
            -webkit-font-smoothing: antialiased;
            -moz-osx-font-smoothing: grayscale;
          }
        `}
      </style>
    </div>
  );
};

export default Home;