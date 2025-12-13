import { useState, useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext";

function Login() {
  const { login, user, token } = useContext(AuthContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (user || token) {
      navigate("/", { replace: true });
    }
  }, [user, token, navigate]);

  const change = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
  
      await login({ email: form.email, password: form.password });
      navigate("/", { replace: true }); 
    } catch (err) {
      setError("Invalid email or password. Please try again.");
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
            🗑️
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
            Welcome Back
          </h1>
          <p style={{ color: "#7f8c8d", margin: 0, fontSize: "15px" }}>
            Sign in to your account to continue
          </p>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: "#ffebee",
              color: "#c62828",
              padding: "12px 16px",
              borderRadius: "8px",
              marginBottom: "20px",
              fontSize: "14px",
              border: "1px solid #ffcdd2",
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={submit}>
          <div style={{ marginBottom: "20px" }}>
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
              value={form.email}
              onChange={change}
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

          <div style={{ marginBottom: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <label
                style={{
                  display: "block",
                  color: "#2c3e50",
                  fontSize: "14px",
                  fontWeight: "600",
                  margin: 0,
                }}
              >
                Password
              </label>
              <Link
                to="/forgot-password"
                style={{
                  color: "#667eea",
                  textDecoration: "none",
                  fontSize: "13px",
                  fontWeight: "500",
                }}
              >
                Forgot Password?
              </Link>
            </div>
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={change}
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
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "30px" }}>
          <p style={{ color: "#7f8c8d", fontSize: "14px", margin: 0 }}>
            Don't have an account?{" "}
            <Link
              to="/register"
              style={{
                color: "#667eea",
                textDecoration: "none",
                fontWeight: "600",
              }}
            >
              Sign Up
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

export default Login;