import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = document.cookie
      .split("; ")
      .find(row => row.startsWith("token="))
      ?.split("=")[1];

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (typeof window !== "undefined") {
      const status = error.response?.status;
      const url = error.config?.url ?? "";
      const isLoginRequest = url.includes("/adminbma/login");

      if (status === 401 && !isLoginRequest) {
  document.cookie = "token=; Path=/; Max-Age=0; SameSite=Lax";
  window.location.href = "/adminbma/login";
}
    }
    return Promise.reject(error);
  }
);

export default api;