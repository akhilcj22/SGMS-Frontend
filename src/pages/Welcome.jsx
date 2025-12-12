// ...existing code...
import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

function Welcome() {
  const { user } = useContext(AuthContext);

  const [contact, setContact] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState({
    state: null,
    message: "",
  }); // {state: success|error|null, message: string}

  const handleContactChange = (e) =>
    setContact({ ...contact, [e.target.name]: e.target.value });

  // Handle Contact Form Submit
  const submitContact = async (e) => {
    e.preventDefault();

    if (!contact.name || !contact.email || !contact.message) {
      setSubmitStatus({
        state: "error",
        message: "Please complete all fields before sending.",
      });
      return;
    }

    setLoading(true);
    setSubmitStatus({ state: null, message: "" });

    try {
      const response = await api.post("auth/contact/", contact);
      console.log("Contact submitted:", response.data);

      setSubmitStatus({
        state: "success",
        message: "Thanks! Your message has been sent.",
      });

      setContact({ name: "", email: "", message: "" });

      setTimeout(() => setSubmitStatus({ state: null, message: "" }), 4000);
    } catch (err) {
      console.error("Contact error:", err);
      setSubmitStatus({
        state: "error",
        message: "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  // Waste Categories Data
  const wasteCategories = [
    {
      name: "Bio Waste",
      description: "Organic kitchen scraps, yard waste, food leftovers. Fully compostable and ideal for bio-processing.",
      items: ["Food scraps", "Coffee grounds", "Leaves & grass", "Paper towels"],
      color: "#4CAF50",
      image:
        "https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=800&auto=format&fit=crop&q=80",
    },
    {
      name: "Non-Bio Waste",
      description: "Materials that can't decompose easily and need special handling to avoid pollution.",
      items: ["Plastic wrappers", "Rubber", "Styrofoam", "Mixed polymers"],
      color: "#F44336",
      image:
        "https://images.unsplash.com/photo-1631549916768-4119b2e5f926?w=800&auto=format&fit=crop&q=80",
    },
    {
      name: "Recyclable Waste",
      description: "Materials that can be reprocessed into new products, reducing landfill load and conserving resources.",
      items: ["Cardboard", "Paper", "Glass bottles", "Metal cans"],
      color: "#2196F3",
      image:
        "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=800&auto=format&fit=crop&q=80",
    },
  ];

  const guidelines = [
    "Sign up or log in to book a pickup and track your history.",
    "Choose the correct waste type to get accurate pricing and routing.",
    "Use clear photos for faster verification when uploading waste images.",
    "Confirm pickup date/time and address before submitting.",
    "For hazardous items (batteries, chemicals), contact support before booking.",
  ];

  return (
    <div className="page-shell welcome-bg">
      <div className="welcome-content">
        <div className="container stack">
          <div className="card hero-card">
            <h1 style={{ fontSize: "clamp(28px, 4vw, 44px)", margin: 0 }}>
              Smart Garbage Management System
            </h1>
            {user && (
              <p style={{ fontSize: "18px", color: "#374151", margin: "12px 0 0" }}>
                Welcome back, {user.name} 👋
              </p>
            )}
            <p style={{ maxWidth: 720, margin: "18px auto 0", color: "#4b5563" }}>
              Efficient waste collection for a cleaner, greener planet.
            </p>
            <div style={{ marginTop: 26, display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              {!user ? (
                <>
                  <Link className="btn btn-primary" to="/login">
                    Login
                  </Link>
                  <Link className="btn btn-accent" to="/register">
                    Register
                  </Link>
                </>
              ) : (
                <>
                  <Link className="btn btn-warning" to="/booking/create">
                    Book Waste Pickup
                  </Link>
                  <Link className="btn btn-primary" to="/dashboard">
                    My Dashboard
                  </Link>
                </>
              )}
            </div>
          </div>

          <section className="card">
            <div className="section-heading">
              <h2>How to use this site</h2>
              <p>Quick steps to book pickups and keep your waste sorted.</p>
            </div>
            <div className="stack">
              {guidelines.map((rule, idx) => (
                <div
                  key={idx}
                  className="card"
                  style={{
                    padding: "14px 16px",
                    borderLeft: "4px solid #667eea",
                    margin: 0,
                  }}
                >
                  {rule}
                </div>
              ))}
            </div>
          </section>

          <section className="card">
            <div className="section-heading">
              <h2>Waste Categories</h2>
              <p>Know where your waste belongs to ensure proper recycling.</p>
            </div>
            <div className="grid-auto">
              {wasteCategories.map((cat, i) => (
                <div
                  key={i}
                  className="card"
                  style={{
                    borderTop: `4px solid ${cat.color}`,
                    boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
                  }}
                >
                  {cat.image && (
                    <img
                      src={cat.image}
                      alt={cat.name}
                      style={{
                        width: "100%",
                        height: "160px",
                        objectFit: "cover",
                        borderRadius: "12px",
                        marginBottom: "12px",
                      }}
                    />
                  )}
                  <h3 style={{ color: cat.color, marginTop: 0 }}>{cat.name}</h3>
                  <p style={{ color: "#4b5563", marginBottom: 12 }}>{cat.description}</p>
                  <ul style={{ margin: 0, paddingLeft: 18, color: "#4b5563" }}>
                    {cat.items.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          <section className="card">
            <div className="section-heading">
              <h2>Why Waste Management Matters</h2>
            </div>
            <div className="grid-auto">
              <div className="card" style={{ background: "#E8F5E9", border: "none" }}>
                <h4 style={{ marginTop: 0 }}>🌱 Environmental Benefits</h4>
                <p style={{ margin: 0, color: "#1f2937" }}>
                  Reduces pollution and protects soil and water bodies.
                </p>
              </div>
              <div className="card" style={{ background: "#FFF3E0", border: "none" }}>
                <h4 style={{ marginTop: 0 }}>🧍 Health Protection</h4>
                <p style={{ margin: 0, color: "#1f2937" }}>Minimizes disease risk and toxic exposure.</p>
              </div>
              <div className="card" style={{ background: "#E3F2FD", border: "none" }}>
                <h4 style={{ marginTop: 0 }}>♻️ Smart Practices</h4>
                <ul style={{ margin: "8px 0 0 16px", color: "#1f2937" }}>
                  <li>Segregate wet & dry waste</li>
                  <li>Reduce plastic usage</li>
                  <li>Compost organic waste</li>
                  <li>Recycle materials</li>
                </ul>
              </div>
            </div>
          </section>

          <section id="contact" className="card contact-card">
            <div className="section-heading">
              <h2>Contact Us</h2>
              <p>Reach out for support, partnerships, or queries.</p>
            </div>

            {submitStatus.state && (
              <div
                className={`alert ${
                  submitStatus.state === "success" ? "alert-success" : "alert-error"
                }`}
              >
                {submitStatus.message}
              </div>
            )}

            <div className="contact-grid">
              <form onSubmit={submitContact} className="stack">
                <div>
                  <label htmlFor="name">Your Name</label>
                  <input
                    id="name"
                    name="name"
                    placeholder="Alex Smith"
                    value={contact.name}
                    onChange={handleContactChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label htmlFor="email">Email</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value={contact.email}
                    onChange={handleContactChange}
                    required
                    disabled={loading}
                  />
                </div>

                <div>
                  <label htmlFor="message">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Tell us how we can help..."
                    rows={5}
                    value={contact.message}
                    onChange={handleContactChange}
                    required
                    disabled={loading}
                  />
                </div>

                <button className="btn btn-primary" type="submit" disabled={loading}>
                  {loading ? "Sending..." : "Send Message"}
                </button>
              </form>

              <div className="card" style={{ background: "#f8fafc" }}>
                <h3 style={{ marginTop: 0 }}>Need quick help?</h3>
                <p style={{ color: "#4b5563" }}>
                  Our team typically responds within one business day. You can also reach us via:
                </p>
                <div className="stack">
                  <div className="pill status-accepted">support@sgms.com</div>
                  <div className="pill status-completed">+91 98765 43210</div>
                  <div className="pill status-in-progress">Service hours: 9am - 6pm IST</div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
