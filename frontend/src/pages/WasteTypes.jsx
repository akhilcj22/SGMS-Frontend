import { useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";

function WasteTypes() {
  const [types, setTypes] = useState([]);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    api.get("waste/types/")
      .then(res => setTypes(res.data))
      .catch(err => console.log(err));
  }, []);

  const handleSelect = (typeId) => {
    if (user) {
      navigate(`/booking/create?waste_type=${typeId}`);
    } else {
      navigate("/login");
    }
  };

  const getCategoryIcon = (name) => {
    if (name.toLowerCase().includes("bio")) return "🌱";
    if (name.toLowerCase().includes("non")) return "🚫";
    if (name.toLowerCase().includes("recycl")) return "♻️";
    return "🗑️";
  };

  const getCategoryColor = (name) => {
    if (name.toLowerCase().includes("bio")) return "#4CAF50";
    if (name.toLowerCase().includes("non")) return "#F44336";
    if (name.toLowerCase().includes("recycl")) return "#2196F3";
    return "#9E9E9E";
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        padding: "40px 20px",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "50px" }}>
          <h1
            style={{
              fontSize: "36px",
              fontWeight: "700",
              color: "#2c3e50",
              marginBottom: "10px",
            }}
          >
            Waste Types & Pricing
          </h1>
          <p style={{ fontSize: "18px", color: "#7f8c8d", maxWidth: "600px", margin: "0 auto" }}>
            Choose a waste type to book a pickup service
          </p>
        </div>

        {types.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              backgroundColor: "white",
              borderRadius: "15px",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
            }}
          >
            <div style={{ fontSize: "48px", marginBottom: "20px" }}>⏳</div>
            <p style={{ fontSize: "18px", color: "#7f8c8d" }}>Loading waste types...</p>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: "30px",
            }}
          >
            {types.map((t) => {
              const categoryColor = getCategoryColor(t.name);
              return (
                <div
                  key={t.id}
                  style={{
                    backgroundColor: "white",
                    padding: "35px",
                    borderRadius: "20px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                    border: `3px solid ${categoryColor}`,
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-10px) scale(1.02)";
                    e.currentTarget.style.boxShadow = `0 15px 40px rgba(0,0,0,0.2)`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0) scale(1)";
                    e.currentTarget.style.boxShadow = "0 10px 30px rgba(0,0,0,0.1)";
                  }}
                >
                  <div
                    style={{
                      position: "absolute",
                      top: "-20px",
                      right: "-20px",
                      width: "100px",
                      height: "100px",
                      backgroundColor: categoryColor,
                      opacity: 0.1,
                      borderRadius: "50%",
                    }}
                  />
                  <div style={{ textAlign: "center", marginBottom: "25px" }}>
                    <div
                      style={{
                        fontSize: "60px",
                        marginBottom: "15px",
                        display: "inline-block",
                      }}
                    >
                      {getCategoryIcon(t.name)}
                    </div>
                    <h3
                      style={{
                        color: categoryColor,
                        marginBottom: "15px",
                        fontSize: "24px",
                        fontWeight: "700",
                      }}
                    >
                      {t.name}
                    </h3>
                  </div>
                  <p
                    style={{
                      color: "#666",
                      marginBottom: "25px",
                      lineHeight: "1.8",
                      fontSize: "15px",
                      textAlign: "center",
                    }}
                  >
                    {t.description || "No description available"}
                  </p>
                  <div
                    style={{
                      padding: "20px",
                      backgroundColor: `${categoryColor}15`,
                      borderRadius: "12px",
                      marginBottom: "25px",
                      textAlign: "center",
                      border: `2px solid ${categoryColor}40`,
                    }}
                  >
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#7f8c8d",
                        marginBottom: "5px",
                        fontWeight: "600",
                      }}
                    >
                      Price per Kilogram
                    </div>
                    <strong
                      style={{
                        fontSize: "28px",
                        color: categoryColor,
                        fontWeight: "700",
                      }}
                    >
                      ₹{t.price_per_kg}
                    </strong>
                  </div>
                  <button
                    onClick={() => handleSelect(t.id)}
                    style={{
                      width: "100%",
                      padding: "16px",
                      backgroundColor: user ? categoryColor : "#95a5a6",
                      color: "white",
                      border: "none",
                      borderRadius: "12px",
                      fontSize: "16px",
                      fontWeight: "700",
                      cursor: user ? "pointer" : "not-allowed",
                      transition: "all 0.3s",
                      boxShadow: user
                        ? `0 4px 15px ${categoryColor}50`
                        : "none",
                    }}
                    onMouseEnter={(e) => {
                      if (user) {
                        e.target.style.transform = "translateY(-2px)";
                        e.target.style.boxShadow = `0 6px 20px ${categoryColor}70`;
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (user) {
                        e.target.style.transform = "translateY(0)";
                        e.target.style.boxShadow = `0 4px 15px ${categoryColor}50`;
                      }
                    }}
                  >
                    {user ? "📅 Book Pickup" : "🔒 Login to Book"}
                  </button>
                </div>
              );
            })}
          </div>
        )}

        <div style={{ textAlign: "center", marginTop: "40px" }}>
          <Link
            to="/"
            style={{
              color: "#667eea",
              textDecoration: "none",
              fontSize: "16px",
              fontWeight: "600",
            }}
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default WasteTypes;
