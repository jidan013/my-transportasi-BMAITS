import api from "@/lib/axios";
import { LoginPayload, LoginResponse, Admin } from "@/types/auth";

export const loginAdmin = async (
  payload: LoginPayload
): Promise<LoginResponse> => {
  const res = await api.post<LoginResponse>("/v1/adminbma/login", payload);
  return res.data;
};

// Tambahkan helper ini di atas auth-service.ts
const getCookie = (name: string) => {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift();
  return null;
};

export const getAdminMe = async (): Promise<Admin> => {
  const token = localStorage.getItem("admin_token");

  const res = await api.get<Admin>("/v1/adminbma/me", {
    headers: {
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};

export const logoutAdmin = async () => {
  const token = localStorage.getItem("admin_token");

  const res = await api.delete("/v1/adminbma/logout", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};