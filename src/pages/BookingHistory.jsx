import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../services/api";

function BookingHistory() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { bookingId } = useParams();

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetail();
    } else {
      fetchBookings();
    }
  }, [bookingId]);

  const fetchBookings = async () => {
    try {
      const res = await api.get("waste/booking/history/");
      setBookings(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setLoading(false);
    }
  };

  const fetchBookingDetail = async () => {
    try {
      const res = await api.get(`waste/booking/${bookingId}/`);
      setBookings([res.data]);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching booking:", err);
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "#4CAF50";
      case "in_progress":
        return "#FF9800";
      case "accepted":
        return "#2196F3";
      case "pending":
        return "#9E9E9E";
      default:
        return "#F44336";
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "#4CAF50";
      case "pending":
        return "#FF9800";
      case "failed":
        return "#F44336";
      default:
        return "#9E9E9E";
    }
  };

  if (loading) {
    return <div style={{ padding: "40px", textAlign: "center" }}>Loading...</div>;
  }

  if (bookings.length === 0) {
    return (
      <div className="page-shell">
        <div className="container card" style={{ textAlign: "center" }}>
          <h2>My Bookings</h2>
          <p style={{ color: "#6b7280" }}>No bookings found.</p>
          <Link className="btn btn-primary" to="/booking/create" style={{ marginTop: 12 }}>
            Create New Booking
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page-shell">
      <div className="container stack">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: 12,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <h2 style={{ margin: 0 }}>{bookingId ? "Booking Details" : "My Bookings"}</h2>
          {!bookingId && (
            <Link className="btn btn-primary" to="/booking/create">
              + New Booking
            </Link>
          )}
        </div>

        <div className="stack">
          {bookings.map((booking) => (
            <div key={booking.id} className="card stack">
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "start",
                  flexWrap: "wrap",
                  gap: 12,
                }}
              >
                <div>
                  <h3 style={{ margin: "0 0 6px" }}>Booking #{booking.id}</h3>
                  <p style={{ margin: 0, color: "#6b7280" }}>
                    Created: {new Date(booking.created_at).toLocaleString()}
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div
                    className="pill status-pill"
                    style={{ background: getStatusColor(booking.status) }}
                  >
                    {booking.status.replace("_", " ").toUpperCase()}
                  </div>
                  <div
                    className="pill status-pill"
                    style={{
                      marginTop: 8,
                      background: getPaymentStatusColor(booking.payment_status),
                    }}
                  >
                    Payment: {booking.payment_status.toUpperCase()}
                  </div>
                </div>
              </div>

              <div className="grid-auto">
                <div>
                  <strong>Waste Type:</strong>
                  <p style={{ margin: "4px 0", color: "#6b7280" }}>{booking.waste_type?.name}</p>
                </div>
                <div>
                  <strong>Quantity:</strong>
                  <p style={{ margin: "4px 0", color: "#6b7280" }}>{booking.quantity_kg} kg</p>
                </div>
                <div>
                  <strong>Pickup Date:</strong>
                  <p style={{ margin: "4px 0", color: "#6b7280" }}>{booking.pickup_date}</p>
                </div>
                <div>
                  <strong>Pickup Time:</strong>
                  <p style={{ margin: "4px 0", color: "#6b7280" }}>{booking.pickup_time}</p>
                </div>
                <div>
                  <strong>Collection Center:</strong>
                  <p style={{ margin: "4px 0", color: "#6b7280" }}>
                    {booking.selected_center?.name || "Not selected"}
                  </p>
                </div>
                <div>
                  <strong>Total Price:</strong>
                  <p style={{ margin: "4px 0", color: "#111827", fontSize: 18, fontWeight: 700 }}>
                    ₹{parseFloat(booking.total_price || 0).toFixed(2)}
                  </p>
                </div>
              </div>

              <div>
                <strong>Address:</strong>
                <p style={{ margin: "6px 0", color: "#6b7280" }}>{booking.address}</p>
              </div>

              {booking.waste_image && (
                <div>
                  <strong>Waste Image:</strong>
                  <div style={{ marginTop: 10 }}>
                    <img
                      src={booking.waste_image}
                      alt="Waste"
                      style={{
                        maxWidth: "100%",
                        height: "auto",
                        borderRadius: 12,
                        border: "1px solid #e5e7eb",
                      }}
                    />
                  </div>
                </div>
              )}

              <div className="booking-actions">
                {booking.payment_status !== "paid" && (
                  <Link className="btn btn-primary" to={`/booking/${booking.id}/payment`}>
                    Make Payment
                  </Link>
                )}
                <Link className="btn btn-outline" to={`/booking/${booking.id}`}>
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default BookingHistory;

