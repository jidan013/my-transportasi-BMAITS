import axios from "axios";

const Api = axios.create({
  baseURL: "http://localhost:8000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

Api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

Api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Jika 401 Unauthorized, redirect ke login (untuk admin routes)
    if (error.response?.status === 401) {
      const isAdminRoute = window.location.pathname.startsWith("/adminbma");
      
      if (isAdminRoute) {
        localStorage.removeItem("admin_token");
        localStorage.removeItem("admin_user");
        window.location.href = "/adminbma/login";
      }
    }
    
    return Promise.reject(error);
  }
);


// Api.interceptors.request.use(
//   (config) => {
//     const token = localStorage.getItem("admin_token");
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// Handle 401 Unauthorized
// Api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // Token expired atau invalid, redirect ke login
//       localStorage.removeItem("admin_token");
//       localStorage.removeItem("admin_user");
//       window.location.href = "/adminbma/login";
//     }
//     return Promise.reject(error);
//   }
// );

Api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("admin_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

Api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Jangan auto redirect, biarkan component handle
    return Promise.reject(error);
  }
);

export default Api;