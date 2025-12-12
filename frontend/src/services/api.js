// // ...existing code...
// import axios from "axios";

// // Clean base URL handling
// const baseURL =
//   (import.meta.env.REACT_APP_API_URL || "http://localhost:8000/api").replace(/\/+$/, "");

// // Create axios instance
// const api = axios.create({
//   baseURL: baseURL + "/", // ensures ending slash
// });

// // Attach token automatically on each request
// api.interceptors.request.use((config) => {
//   const token = localStorage.getItem("accessToken");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// // Allow manual update of token (used in AuthContext)
// export function setAuthToken(token) {
//   if (token) {
//     api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
//   } else {
//     delete api.defaults.headers.common["Authorization"];
//   }
// }

// export default api;
// // ...existing code...


// api.js
import axios from "axios";

// --------------------------------------------
// Base URL handling (CRA uses process.env.REACT_APP...)
// --------------------------------------------

// eslint-disable-next-line no-undef
const RAW_URL = process.env.REACT_APP_API_URL || "http://localhost:8000";
const CLEAN_URL = RAW_URL.replace(/\/+$/, ""); // remove trailing slash

// Create axios instance
const api = axios.create({
  baseURL: `${CLEAN_URL}/api/`, // automatically inserts /api/
});

// --------------------------------------------
// Attach JWT token automatically
// --------------------------------------------
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// --------------------------------------------
// Allow manual update of token
// --------------------------------------------
export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

export default api;
