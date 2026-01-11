import api from "@/lib/axios";
import { LoginPayload, LoginResponse, Admin } from "@/types/auth";

export const loginAdmin = async (payload: LoginPayload) => {
  const res = await api.post<LoginResponse>("/adminbma/login", payload);
  return res.data;
};

export const getAdminMe = async () => {
  const res = await api.get<Admin>("/adminbma/me");
  return res.data;
};

export const logoutAdmin = async () => {
  const res = await api.delete("/adminbma/logout");
  return res.data;
};
