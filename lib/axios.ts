import axios from "axios";

const Api = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

Api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const isAdminApi =
        config.url?.startsWith("/v1/admin") ||
        window.location.pathname.startsWith("/adminbma");

      if (isAdminApi) {
        const token = localStorage.getItem("admin_token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

Api.interceptors.response.use(
  (response) => response,
  (error) => Promise.reject(error)
);

export default Api;