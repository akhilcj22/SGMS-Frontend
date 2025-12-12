import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../services/api";

function BookingSuccess() {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    fetchBooking();
  }, [bookingId]);

  const fetchBooking = async () => {
    try {
      const res = await api.get(`waste/booking/${bookingId}/`);
      setBooking(res.data);
    } catch (err) {
      console.error("Error fetching booking:", err);
    }
  };

  return (
    <div className="page-shell deep-gradient auth-shell">
      <div
        className="card auth-card"
        style={{
          maxWidth: "620px",
          textAlign: "center",
          padding: "50px 36px",
        }}
      >
        <div
          style={{
            width: "120px",
            height: "120px",
            backgroundColor: "#4CAF50",
            borderRadius: "50%",
            margin: "0 auto 30px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: "60px",
            animation: "scaleIn 0.5s ease-out",
          }}
        >
          ✓
        </div>
        <h1
          style={{
            fontSize: "32px",
            fontWeight: "700",
            color: "#2c3e50",
            marginBottom: "15px",
          }}
        >
          Booking Successful! 🎉
        </h1>
        <p
          style={{
            fontSize: "18px",
            color: "#7f8c8d",
            marginBottom: "40px",
            lineHeight: "1.6",
          }}
        >
          Your waste pickup has been scheduled successfully. We'll collect your waste on the
          scheduled date.
        </p>

        {booking && (
          <div
            style={{
              backgroundColor: "#f8f9fa",
              padding: "30px",
              borderRadius: "15px",
              marginBottom: "30px",
              textAlign: "left",
              border: "2px solid #e9ecef",
            }}
          >
            <h3
              style={{
                color: "#2c3e50",
                marginBottom: "20px",
                fontSize: "20px",
                fontWeight: "600",
                borderBottom: "2px solid #e9ecef",
                paddingBottom: "15px",
              }}
            >
              Booking Details
            </h3>
            <div style={{ display: "grid", gap: "12px" }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#7f8c8d", fontWeight: "500" }}>Booking ID:</span>
                <span style={{ color: "#2c3e50", fontWeight: "600" }}>#{booking.id}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#7f8c8d", fontWeight: "500" }}>Waste Type:</span>
                <span style={{ color: "#2c3e50", fontWeight: "600" }}>
                  {booking.waste_type?.name}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#7f8c8d", fontWeight: "500" }}>Quantity:</span>
                <span style={{ color: "#2c3e50", fontWeight: "600" }}>
                  {booking.quantity_kg} kg
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#7f8c8d", fontWeight: "500" }}>Pickup Date:</span>
                <span style={{ color: "#2c3e50", fontWeight: "600" }}>
                  {booking.pickup_date}
                </span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#7f8c8d", fontWeight: "500" }}>Pickup Time:</span>
                <span style={{ color: "#2c3e50", fontWeight: "600" }}>
                  {booking.pickup_time}
                </span>
              </div>
              <div
                style={{
                  padding: "12px",
                  backgroundColor: "#e8f5e9",
                  borderRadius: "8px",
                  marginTop: "10px",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span style={{ color: "#2e7d32", fontWeight: "600" }}>Status:</span>
                  <span
                    style={{
                      color: "#2e7d32",
                      fontWeight: "700",
                      textTransform: "capitalize",
                    }}
                  >
                    {booking.status.replace("_", " ")}
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginTop: "8px",
                  }}
                >
                  <span style={{ color: "#2e7d32", fontWeight: "600" }}>Payment:</span>
                  <span
                    style={{
                      color: "#2e7d32",
                      fontWeight: "700",
                      textTransform: "capitalize",
                    }}
                  >
                    {booking.payment_status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        <div
          style={{
            display: "flex",
            gap: "15px",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          <Link
            to="/dashboard"
            style={{
              padding: "14px 35px",
              backgroundColor: "#667eea",
              color: "white",
              textDecoration: "none",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "600",
              transition: "all 0.3s",
              boxShadow: "0 4px 15px rgba(102, 126, 234, 0.4)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#5568d3";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#667eea";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            📊 Go to Dashboard
          </Link>
          <Link
            to="/booking/history"
            style={{
              padding: "14px 35px",
              backgroundColor: "#4CAF50",
              color: "white",
              textDecoration: "none",
              borderRadius: "12px",
              fontSize: "16px",
              fontWeight: "600",
              transition: "all 0.3s",
              boxShadow: "0 4px 15px rgba(76, 175, 80, 0.4)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#45a049";
              e.currentTarget.style.transform = "translateY(-2px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#4CAF50";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            📋 View All Bookings
          </Link>
        </div>
      </div>
    </div>
  );
}

export default BookingSuccess;

