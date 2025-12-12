import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import api from "../services/api";

function Profile() {
  const { user, logout, updateUser } = useContext(AuthContext);
  const navigate = useNavigate();

  const [preview, setPreview] = useState(user?.profile_image || null);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
  });

  const [pwd, setPwd] = useState({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [message, setMessage] = useState("");

  // ---------------- FILE HANDLING ----------------
  const handleFile = (e) => {
    const f = e.target.files[0];
    if (!f) return;

    if (!["image/png", "image/jpeg"].includes(f.type)) {
      alert("Only JPG/PNG allowed");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      alert("Max 5MB allowed");
      return;
    }

    setPreview(URL.createObjectURL(f));
    // auto-upload on selection
    uploadSelectedFile(f);
  };

  const uploadSelectedFile = async (selectedFile) => {
    if (!selectedFile) return;
    setMessage("");

    const fd = new FormData();
    fd.append("profile_image", selectedFile);

    try {
      const res = await api.patch("auth/me/update/", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      updateUser(res.data);
      setPreview(res.data.profile_image || preview);
      setMessage("Profile picture updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      console.error(err);
      setMessage("Upload failed. Please try again.");
      setTimeout(() => setMessage(""), 3000);
    }
  };

  // --------------- PROFILE UPDATE ----------------
  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await api.patch("auth/me/update/", formData);
      updateUser(res.data);
      setMessage("Profile updated successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch (err) {
      setMessage("Error updating profile");
      console.error(err);
    }
  };

  // --------------- CHANGE PASSWORD ----------------
  const changePassword = async (e) => {
    e.preventDefault();

    if (
      !pwd.current_password ||
      !pwd.new_password ||
      !pwd.confirm_password
    )
      return alert("All fields are required");

    if (pwd.new_password !== pwd.confirm_password)
      return alert("Passwords do not match!");

    try {
      await api.post("auth/change_password/", {
        current_password: pwd.current_password,
        new_password: pwd.new_password,
      });

      alert("Password changed successfully!");
      setPwd({ current_password: "", new_password: "", confirm_password: "" });
    } catch {
      alert("Password change failed.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (!user)
    return <div style={{ padding: 40, textAlign: "center" }}>Loading...</div>;

  return (
    <div className="page-shell deep-gradient">
      <div className="container profile-layout">
        <div className="card profile-card">
          <div style={{ textAlign: "right", marginBottom: 8 }}>
            <Link to="/" className="btn btn-outline">
              Home
            </Link>
          </div>

          <div className="profile-header">
            <div className="avatar-wrapper">
              <img
                src={preview || "/default-avatar.png"}
                className="profile-avatar"
                alt="profile"
              />
              <label className="upload-btn">
                Change
                <input type="file" accept="image/*" onChange={handleFile} hidden />
              </label>
            </div>

            <h1 style={{ margin: "18px 0 8px" }}>My Profile</h1>
            <p style={{ color: "#4b5563", margin: 0 }}>
              Manage your personal information and security settings
            </p>
          </div>

          {message && <div className="alert alert-success">{message}</div>}

          <div className="grid-wide">
            <form onSubmit={handleUpdate} className="stack">
              <h3 className="section-title">Personal Information</h3>

              <div className="form-control">
                <label>Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-control">
                <label>Phone</label>
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>

              <div className="form-control">
                <label>Address</label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  rows={3}
                ></textarea>
              </div>

              <button className="btn btn-primary">Save Changes</button>
            </form>

            <form onSubmit={changePassword} className="stack">
              <h3 className="section-title">Change Password</h3>

              <input
                type="password"
                placeholder="Current Password"
                value={pwd.current_password}
                onChange={(e) =>
                  setPwd({ ...pwd, current_password: e.target.value })
                }
              />

              <input
                type="password"
                placeholder="New Password"
                value={pwd.new_password}
                onChange={(e) =>
                  setPwd({ ...pwd, new_password: e.target.value })
                }
              />

              <input
                type="password"
                placeholder="Confirm New Password"
                value={pwd.confirm_password}
                onChange={(e) =>
                  setPwd({ ...pwd, confirm_password: e.target.value })
                }
              />

              <button className="btn btn-accent">Update Password</button>
            </form>
          </div>

          <button onClick={handleLogout} className="btn btn-outline" style={{ width: "100%", color: "#e74c3c" }}>
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
