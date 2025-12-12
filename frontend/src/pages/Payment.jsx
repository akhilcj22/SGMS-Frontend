import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";

function Payment() {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const res = await api.get(`waste/booking/${bookingId}/`);
      setBooking(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching booking:", err);
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!booking) return;

    // Check if Razorpay is loaded
    if (!window.Razorpay) {
      alert("Payment gateway is not loaded. Please refresh the page and try again.");
      return;
    }

    setProcessing(true);
    try {
      // Create payment order
      const paymentRes = await api.post("waste/payment/create/", {
        booking_id: booking.id,
        amount: booking.total_price,
      });

      const { razorpay_order_id, amount } = paymentRes.data;
      const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID;

      if (!razorpayKeyId) {
        alert("Razorpay key is not configured. Please contact administrator.");
        setProcessing(false);
        return;
      }

      // Initialize Razorpay
      const options = {
        key: razorpayKeyId,
        amount: amount * 100, // Amount in paise
        currency: "INR",
        name: "Garbage Management System",
        description: `Payment for Booking #${booking.id}`,
        order_id: razorpay_order_id,
        handler: async function (response) {
          // Verify payment
          try {
            await api.post("waste/payment/verify/", {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });
            navigate(`/booking/${booking.id}/success`);
          } catch (err) {
            console.error("Payment verification failed:", err);
            alert("Payment verification failed. Please contact support.");
            setProcessing(false);
          }
        },
        prefill: {
          name: booking.user?.name || "",
          email: booking.user?.email || "",
        },
        theme: {
          color: "#667eea",
        },
        modal: {
          ondismiss: function() {
            setProcessing(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.on("payment.failed", function (response) {
        alert(`Payment failed: ${response.error.description || "Please try again."}`);
        setProcessing(false);
      });
      razorpay.open();
    } catch (err) {
      console.error("Error initiating payment:", err);
      alert("Error initiating payment. Please try again.");
      setProcessing(false);
    }
  };

  if (loading) {
    return <div style={{ padding: "40px", textAlign: "center" }}>Loading...</div>;
  }

  if (!booking) {
    return <div style={{ padding: "40px", textAlign: "center" }}>Booking not found</div>;
  }

  return (
    <div className="page-shell deep-gradient auth-shell">
      <div className="card auth-card" style={{ maxWidth: 620 }}>
        <div style={{ textAlign: "center", marginBottom: "30px" }}>
          <div
            style={{
              width: "80px",
              height: "80px",
              backgroundColor: "#667eea",
              borderRadius: "50%",
              margin: "0 auto 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "40px",
            }}
          >
            💳
          </div>
          <h1
            style={{
              fontSize: "28px",
              fontWeight: "700",
              color: "#2c3e50",
              marginBottom: "10px",
            }}
          >
            Complete Payment
          </h1>
          <p style={{ color: "#7f8c8d", fontSize: "15px", margin: 0 }}>
            Review your booking and proceed to payment
          </p>
        </div>

        <div
          style={{
            backgroundColor: "#f8f9fa",
            padding: "30px",
            borderRadius: "15px",
            marginBottom: "30px",
            border: "2px solid #e9ecef",
          }}
        >
          <h3
            style={{
              color: "#2c3e50",
              marginBottom: "25px",
              fontSize: "20px",
              fontWeight: "600",
              borderBottom: "2px solid #e9ecef",
              paddingBottom: "15px",
            }}
          >
            Booking Summary
          </h3>
          <div
            style={{
              display: "grid",
              gap: "15px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px 0",
                borderBottom: "1px solid #e9ecef",
              }}
            >
              <span style={{ color: "#7f8c8d", fontWeight: "500" }}>Booking ID:</span>
              <span style={{ color: "#2c3e50", fontWeight: "600" }}>#{booking.id}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px 0",
                borderBottom: "1px solid #e9ecef",
              }}
            >
              <span style={{ color: "#7f8c8d", fontWeight: "500" }}>Waste Type:</span>
              <span style={{ color: "#2c3e50", fontWeight: "600" }}>
                {booking.waste_type?.name}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px 0",
                borderBottom: "1px solid #e9ecef",
              }}
            >
              <span style={{ color: "#7f8c8d", fontWeight: "500" }}>Quantity:</span>
              <span style={{ color: "#2c3e50", fontWeight: "600" }}>
                {booking.quantity_kg} kg
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px 0",
                borderBottom: "1px solid #e9ecef",
              }}
            >
              <span style={{ color: "#7f8c8d", fontWeight: "500" }}>Pickup Date:</span>
              <span style={{ color: "#2c3e50", fontWeight: "600" }}>
                {booking.pickup_date}
              </span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px 0",
                borderBottom: "1px solid #e9ecef",
              }}
            >
              <span style={{ color: "#7f8c8d", fontWeight: "500" }}>Pickup Time:</span>
              <span style={{ color: "#2c3e50", fontWeight: "600" }}>
                {booking.pickup_time}
              </span>
            </div>
            <div
              style={{
                padding: "12px 0",
                borderBottom: "1px solid #e9ecef",
              }}
            >
              <span style={{ color: "#7f8c8d", fontWeight: "500", display: "block", marginBottom: "5px" }}>
                Address:
              </span>
              <span style={{ color: "#2c3e50", fontWeight: "500" }}>{booking.address}</span>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "12px 0",
              }}
            >
              <span style={{ color: "#7f8c8d", fontWeight: "500" }}>Collection Center:</span>
              <span style={{ color: "#2c3e50", fontWeight: "600" }}>
                {booking.selected_center?.name || "Not selected"}
              </span>
            </div>
          </div>
          <div
            style={{
              marginTop: "25px",
              padding: "20px",
              backgroundColor: "#667eea",
              borderRadius: "12px",
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: "14px",
                color: "rgba(255,255,255,0.9)",
                marginBottom: "8px",
                fontWeight: "500",
              }}
            >
              Total Amount
            </div>
            <h2
              style={{
                margin: 0,
                fontSize: "32px",
                color: "white",
                fontWeight: "700",
              }}
            >
              ₹{parseFloat(booking.total_price).toFixed(2)}
            </h2>
          </div>
        </div>

        {booking.payment_status === "paid" ? (
          <div
            style={{
              padding: "20px",
              backgroundColor: "#e8f5e9",
              borderRadius: "12px",
              textAlign: "center",
              border: "2px solid #4CAF50",
            }}
          >
            <div style={{ fontSize: "40px", marginBottom: "10px" }}>✓</div>
            <p style={{ margin: 0, color: "#2e7d32", fontWeight: "600", fontSize: "16px" }}>
              Payment already completed
            </p>
          </div>
        ) : (
          <button
            onClick={handlePayment}
            disabled={processing}
            style={{
              width: "100%",
              padding: "18px",
              backgroundColor: processing ? "#95a5a6" : "#667eea",
              color: "white",
              border: "none",
              borderRadius: "12px",
              fontSize: "18px",
              fontWeight: "700",
              cursor: processing ? "not-allowed" : "pointer",
              transition: "all 0.3s",
              boxShadow: processing
                ? "none"
                : "0 4px 15px rgba(102, 126, 234, 0.4)",
            }}
            onMouseEnter={(e) => {
              if (!processing) {
                e.target.style.backgroundColor = "#5568d3";
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.5)";
              }
            }}
            onMouseLeave={(e) => {
              if (!processing) {
                e.target.style.backgroundColor = "#667eea";
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.4)";
              }
            }}
          >
            {processing ? "⏳ Processing..." : "💳 Pay with Razorpay"}
          </button>
        )}
      </div>
    </div>
  );
}

export default Payment;

