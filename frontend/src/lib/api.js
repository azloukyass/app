import axios from "axios";

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
console.log("REACT_APP_BACKEND_URL:", BACKEND_URL);
export const API = `${BACKEND_URL}/api`;

export const api = axios.create({
  baseURL: API,
  withCredentials: true,
});

// Attach token from localStorage as Bearer fallback (cookies are primary)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("bn_token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export function formatApiError(err) {
  const d = err?.response?.data?.detail;
  if (d == null) return err?.message || "Une erreur est survenue.";
  if (typeof d === "string") return d;
  if (Array.isArray(d))
    return d
      .map((e) => (e && typeof e.msg === "string" ? e.msg : JSON.stringify(e)))
      .join(" ");
  if (d && typeof d.msg === "string") return d.msg;
  return String(d);
}

export const formatPrice = (n) =>
  `${Number(n).toLocaleString("fr-FR", {
    minimumFractionDigits: 3,
    maximumFractionDigits: 3,
  })} TND`;
