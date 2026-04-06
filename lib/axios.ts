import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  // withCredentials: true, // Matikan jika murni menggunakan Bearer Token manual
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

// Tambahkan Interceptor untuk menyisipkan token dari Cookie ke Header
api.interceptors.request.use((config) => {
  if (typeof document !== "undefined") {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("token="))
      ?.split("=")[1];

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;