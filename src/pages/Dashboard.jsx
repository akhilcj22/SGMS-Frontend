import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    completed: 0,
    totalSpent: 0,
  });

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await api.get("waste/booking/history/");
      setBookings(res.data);
      

      const total = res.data.length;
      const pending = res.data.filter((b) => b.status === "pending" || b.status === "accepted" || b.status === "in_progress").length;
      const completed = res.data.filter((b) => b.status === "completed").length;
      const totalSpent = res.data
        .filter((b) => b.payment_status === "paid")
        .reduce((sum, b) => sum + parseFloat(b.total_price || 0), 0);

      setStats({ total, pending, completed, totalSpent });
      setLoading(false);
    } catch (err) {
      console.error("Error fetching bookings:", err);
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

  if (loading) {
    return <div style={{ padding: "40px", textAlign: "center" }}>Loading...</div>;
  }

  return (
    <div className="page-shell gradient-bg">
      <div className="container">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "32px",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <div>
            <h1 style={{ margin: "0 0 6px" }}>My Dashboard</h1>
            <p style={{ color: "#6b7280", margin: 0 }}>
              Overview of your bookings and activities
            </p>
          </div>
          <div className="header-actions">
            <Link className="btn btn-outline" to="/">
              Home
            </Link>
            <Link className="btn btn-outline" to="/profile">
              Profile
            </Link>
            <Link className="btn btn-primary" to="/booking/create">
              ➕ New Booking
            </Link>
          </div>
        </div>

        <div className="stats-grid" style={{ marginBottom: 32 }}>
          <div className="card" style={{ borderTop: "4px solid #667eea", textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>📋</div>
            <h3 style={{ margin: 0, color: "#111827" }}>{stats.total}</h3>
            <p style={{ margin: "8px 0 0", color: "#6b7280" }}>Total Bookings</p>
          </div>
          <div className="card" style={{ borderTop: "4px solid #ff9800", textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>⏳</div>
            <h3 style={{ margin: 0, color: "#111827" }}>{stats.pending}</h3>
            <p style={{ margin: "8px 0 0", color: "#6b7280" }}>Active Bookings</p>
          </div>
          <div className="card" style={{ borderTop: "4px solid #4caf50", textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
            <h3 style={{ margin: 0, color: "#111827" }}>{stats.completed}</h3>
            <p style={{ margin: "8px 0 0", color: "#6b7280" }}>Completed</p>
          </div>
          <div className="card" style={{ borderTop: "4px solid #9c27b0", textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>💰</div>
            <h3 style={{ margin: 0, color: "#111827" }}>₹{stats.totalSpent.toFixed(2)}</h3>
            <p style={{ margin: "8px 0 0", color: "#6b7280" }}>Total Spent</p>
          </div>
        </div>

        <div className="card">
          <h2 style={{ marginTop: 0, marginBottom: 20 }}>Recent Bookings</h2>
          {bookings.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px 12px" }}>
              <div style={{ fontSize: 52, marginBottom: 12 }}>📭</div>
              <p style={{ color: "#6b7280", marginBottom: 20 }}>
                No bookings yet. Create your first booking!
              </p>
              <Link className="btn btn-primary" to="/booking/create">
                ➕ Book Waste Pickup
              </Link>
            </div>
          ) : (
            <div className="stack">
              {bookings.slice(0, 5).map((booking) => (
                <Link
                  key={booking.id}
                  to={`/booking/${booking.id}`}
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <div className="booking-card">
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
                      <div>
                        <h4 style={{ margin: "0 0 8px" }}>
                          Booking #{booking.id} - {booking.waste_type?.name}
                        </h4>
                        <p style={{ margin: "4px 0", color: "#6b7280" }}>
                          📦 {booking.quantity_kg} kg • 📅 {booking.pickup_date} at {booking.pickup_time}
                        </p>
                        <p style={{ margin: "4px 0", color: "#6b7280" }}>
                          📍 {booking.selected_center?.name || "No center selected"}
                        </p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <div
                          className="pill status-pill"
                          style={{ background: getStatusColor(booking.status) }}
                        >
                          {booking.status.replace("_", " ").toUpperCase()}
                        </div>
                        <div style={{ marginTop: 8, fontWeight: 700, fontSize: 18 }}>
                          ₹{parseFloat(booking.total_price || 0).toFixed(2)}
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {bookings.length > 5 && (
            <div style={{ textAlign: "center", marginTop: 20 }}>
              <Link className="btn btn-outline" to="/booking/history">
                📋 View All Bookings
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;

