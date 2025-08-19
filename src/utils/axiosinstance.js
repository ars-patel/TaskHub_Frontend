import axios from "axios";
import { BASE_URL } from "./apiPaths";

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 10000, // 10 seconds
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Attach token if available
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Unauthorized: redirect to login but avoid reload if not needed
      if (error.response.status === 401) {
        console.warn("Unauthorized: Please log in.");
      }
      // Server error
      else if (error.response.status === 500) {
        console.error("Server error, please try again later.");
      }
    } else if (error.code === "ECONNABORTED") {
      console.error("Request timeout, please try again.");
    } else {
      console.error("Network or unknown error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;