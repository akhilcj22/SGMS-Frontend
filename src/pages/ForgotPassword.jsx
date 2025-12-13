import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: null, text: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setMessage({ type: "error", text: "Please enter your email address." });
      return;
    }

    setLoading(true);
    setMessage({ type: null, text: "" });

    try {
    
      const response = await api.post("auth/forgot_password/", { email });
      
      setMessage({
        type: "success",
        text: "Password reset instructions have been sent to your email address.",
      });
      setEmail("");
    } catch (err) {
      console.error("Forgot password error:", err);
      

      if (err.response?.status === 404) {
        setMessage({
          type: "info",
          text: "Password reset feature is coming soon. Please contact support for assistance.",
        });
      } else {
        setMessage({
          type: "error",
          text: err.response?.data?.detail || "Something went wrong. Please try again later.",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page-shell deep-gradient auth-shell">
      <div className="card auth-card">
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <div
            style={{
              width: "70px",
              height: "70px",
              backgroundColor: "#667eea",
              borderRadius: "50%",
              margin: "0 auto 20px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "30px",
            }}
          >
            🔑
          </div>
          <h1
            style={{
              margin: 0,
              fontSize: "28px",
              fontWeight: "700",
              color: "#2c3e50",
              marginBottom: "10px",
            }}
          >
            Forgot Password?
          </h1>
          <p style={{ color: "#7f8c8d", margin: 0, fontSize: "15px" }}>
            Enter your email address and we'll send you instructions to reset your password.
          </p>
        </div>

        {message.text && (
          <div
            style={{
              backgroundColor:
                message.type === "success"
                  ? "#e8f5e9"
                  : message.type === "error"
                  ? "#ffebee"
                  : "#e3f2fd",
              color:
                message.type === "success"
                  ? "#2e7d32"
                  : message.type === "error"
                  ? "#c62828"
                  : "#1565c0",
              padding: "12px 16px",
              borderRadius: "8px",
              marginBottom: "20px",
              fontSize: "14px",
              border: `1px solid ${
                message.type === "success"
                  ? "#c8e6c9"
                  : message.type === "error"
                  ? "#ffcdd2"
                  : "#90caf9"
              }`,
            }}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "30px" }}>
            <label
              style={{
                display: "block",
                marginBottom: "8px",
                color: "#2c3e50",
                fontSize: "14px",
                fontWeight: "600",
              }}
            >
              Email Address
            </label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              style={{
                width: "100%",
                padding: "14px 16px",
                border: "2px solid #e0e0e0",
                borderRadius: "10px",
                fontSize: "15px",
                transition: "all 0.3s",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#667eea";
                e.target.style.outline = "none";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e0e0e0";
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "16px",
              backgroundColor: loading ? "#95a5a6" : "#667eea",
              color: "white",
              border: "none",
              borderRadius: "10px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.3s",
              marginBottom: "20px",
              boxShadow: loading
                ? "none"
                : "0 4px 15px rgba(102, 126, 234, 0.4)",
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = "#5568d3";
                e.target.style.transform = "translateY(-2px)";
                e.target.style.boxShadow = "0 6px 20px rgba(102, 126, 234, 0.5)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = "#667eea";
                e.target.style.transform = "translateY(0)";
                e.target.style.boxShadow = "0 4px 15px rgba(102, 126, 234, 0.4)";
              }
            }}
          >
            {loading ? "Sending..." : "Send Reset Instructions"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "30px" }}>
          <p style={{ color: "#7f8c8d", fontSize: "14px", margin: 0 }}>
            Remember your password?{" "}
            <Link
              to="/login"
              style={{
                color: "#667eea",
                textDecoration: "none",
                fontWeight: "600",
              }}
            >
              Sign In
            </Link>
          </p>
        </div>

        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <Link
            to="/"
            style={{
              color: "#7f8c8d",
              textDecoration: "none",
              fontSize: "14px",
            }}
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;

