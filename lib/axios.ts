import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});


// lib/axios.ts
api.interceptors.request.use((config) => {
  const token = document.cookie
    .split("; ")
    .find(row => row.startsWith("token="))
    ?.split("=")[1];
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;  // ✅ Bearer only
  }
  return config;
});

export default api;