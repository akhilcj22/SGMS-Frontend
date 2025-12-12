// axios instance
import axios from "axios";

// --------------------------------------------
// Load API URL from environment (Vite + Vercel)
// --------------------------------------------
const RAW_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

// Remove trailing slash if exists
const CLEAN_URL = RAW_URL.replace(/\/+$/, "");

// Final API base: ensures a single /api/ at end
const FINAL_BASE_URL = `${CLEAN_URL}/api/`;

// Debug (you can remove these after testing)
console.log("👉 Loaded API URL:", RAW_URL);
console.log("👉 Clean API URL:", CLEAN_URL);
console.log("👉 Final Axios Base URL:", FINAL_BASE_URL);

// --------------------------------------------
// Create axios instance
// --------------------------------------------
const api = axios.create({
  baseURL: FINAL_BASE_URL,
});

// --------------------------------------------
// Attach JWT token for each request
// --------------------------------------------
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --------------------------------------------
// Allow manual token update (optional)
// --------------------------------------------
export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

export default api;
