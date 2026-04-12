import axios from "axios";
import { getToken, logout } from "./auth";

const baseURL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

const api = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err?.response?.status === 403 && err.response.data?.code === "ACCOUNT_DEACTIVATED") {
      logout();
      sessionStorage.setItem(
        "auth_notice",
        err.response.data?.message || "Your account is deactivated. Please contact support.",
      );
      if (!window.location.pathname.startsWith("/sign-in")) {
        window.location.href = "/sign-in";
      }
    }
    return Promise.reject(err);
  },
);

export default api;
