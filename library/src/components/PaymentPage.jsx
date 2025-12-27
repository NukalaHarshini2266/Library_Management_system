
import React, { useState, useEffect } from "react";
import api from "../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import { FaCreditCard, FaCheckCircle, FaMobileAlt, FaUniversity } from "react-icons/fa";

const PaymentPage = () => {
  const navigate = useNavigate();
  const [fee, setFee] = useState(0);
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));
  const membership = JSON.parse(localStorage.getItem("membershipPurchase"));

  // Calculate fee based on plan and duration
  useEffect(() => {
    if (membership) {
      let planMultiplier = 0;
      switch (membership.plan.toUpperCase()) {
        case "STANDARD":
          planMultiplier = 100;
          break;
        case "PREMIUM":
          planMultiplier = 200;
          break;
        case "GOLD":
          planMultiplier = 300;
          break;
        default:
          planMultiplier = 50;
      }
      setFee(planMultiplier * membership.duration);
    }
  }, [membership]);

  const handleConfirmPayment = async () => {
    
    if (!user || !membership) {
      alert("Missing user or membership details.");
      return;
      
    }

    setLoading(true);

    try {
      const payload = {
        name: user.name,
        email: user.email,
        contactNumber: membership.contact,
        planType: membership.plan,
        durationMonths: membership.duration,
      };

      const res = await api.post("/api/members/add", payload);

      if (res.status === 200 || res.status === 201) {
          await api.post("/api/transactions/add", {
          transactionType: "MEMBERSHIP",
          name: user.name,
          email: user.email,
          paymentMethod: paymentMethod.toUpperCase(),
          amount: fee,
          planType: membership.plan,
          durationMonths: membership.duration,
        });

        alert(`Payment Successful! ₹${fee} paid for ${membership.plan} plan 🎉`);
        localStorage.removeItem("membershipPurchase");
        navigate("/dashboard");
      } else {
        alert("Unexpected response from server.");
      }
    } catch (err) {
      console.error(err);

      // Backend error handling
      const serverMessage =
        err.response?.data?.message || err.response?.data || err.message;

      if (serverMessage.toLowerCase().includes("active membership")) {
        alert(
          "You already have an active membership for this plan. Cannot purchase again until expiry."
        );
      } else {
        alert("Payment failed: " + serverMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center vh-100"
      style={{ backgroundColor: "#f4f7fa" }}
    >
      <div
        className="card shadow-lg p-4 text-center"
        style={{ width: "420px", borderRadius: "20px" }}
      >
        <div className="mb-3 text-primary">
          <FaCreditCard size={50} />
        </div>

        <h3 className="fw-bold text-dark mb-3">Membership Payment</h3>

        {membership ? (
          <div className="text-start bg-light p-3 rounded mb-3">
            <p>
              <strong>Plan:</strong> {membership.plan}
            </p>
            <p>
              <strong>Duration:</strong> {membership.duration} months
            </p>
            <p>
              <strong>Contact:</strong> {membership.contact}
            </p>
            <p>
              <strong>Email:</strong> {user?.email}
            </p>
            <p>
              <strong>Amount to Pay:</strong> ₹{fee}
            </p>
          </div>
        ) : (
          <p className="text-muted">No membership details found.</p>
        )}

        <div className="mb-3 text-start">
          <p className="mb-1">
            <strong>Select Payment Method:</strong>
          </p>
          <div className="d-flex justify-content-between">
            <button
              className={`btn ${
                paymentMethod === "upi" ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => setPaymentMethod("upi")}
            >
              <FaMobileAlt /> UPI
            </button>
            <button
              className={`btn ${
                paymentMethod === "card" ? "btn-primary" : "btn-outline-primary"
              }`}
              onClick={() => setPaymentMethod("card")}
            >
              <FaCreditCard /> Card
            </button>
            <button
              className={`btn ${
                paymentMethod === "netbanking"
                  ? "btn-primary"
                  : "btn-outline-primary"
              }`}
              onClick={() => setPaymentMethod("netbanking")}
            >
              <FaUniversity /> NetBanking
            </button>
          </div>
        </div>

        <button
          className="btn btn-success w-100 py-2 fw-bold"
          style={{ borderRadius: "10px", fontSize: "1.1rem" }}
          onClick={handleConfirmPayment}
          disabled={loading}
        >
          {loading ? "Processing..." : <><FaCheckCircle className="me-2" /> Confirm Payment</>}
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;
