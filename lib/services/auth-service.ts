import api from "@/lib/axios";
import { LoginPayload, LoginResponse, Admin } from "@/types/auth";

export const loginAdmin = async (
  payload: LoginPayload
): Promise<LoginResponse> => {
  const res = await api.post<LoginResponse>("/v1/adminbma/login", payload);
  return res.data;
};

export const getAdminMe = async (): Promise<Admin> => {
  const token = localStorage.getItem("admin_token");

  const res = await api.get<Admin>("/v1/adminbma/me", {
    headers: {
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