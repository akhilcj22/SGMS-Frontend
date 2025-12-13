
import axios from "axios";

const RAW_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

const CLEAN_URL = RAW_URL.replace(/\/+$/, "");


const FINAL_BASE_URL = `${CLEAN_URL}/api/`;


console.log(" Loaded API URL:", RAW_URL);
console.log(" Clean API URL:", CLEAN_URL);
console.log(" Final Axios Base URL:", FINAL_BASE_URL);


const api = axios.create({
  baseURL: FINAL_BASE_URL,
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});


export function setAuthToken(token) {
  if (token) {
    api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common["Authorization"];
  }
}

export default api;
