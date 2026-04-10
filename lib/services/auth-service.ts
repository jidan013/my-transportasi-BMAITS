import api from "@/lib/axios";
import { LoginPayload, LoginResponse, Admin } from "@/types/auth";

export const clearAuth = () => {
  if (typeof window !== "undefined") {
    document.cookie = "token=; Path=/; Max-Age=0; SameSite=Lax";
  }
};

export const saveAuth = (token: string) => {
  if (typeof window !== "undefined") {
    const age = process.env.NEXT_PUBLIC_COOKIE_AGE ?? 86400;
    document.cookie = `token=${token}; Path=/; SameSite=Lax; Max-Age=${age}`;
    console.log("🍪 Token saved");
  }
};

export const loginAdmin = async (payload: LoginPayload): Promise<LoginResponse> => {
  const res = await api.post<LoginResponse>("/v1/adminbma/login", payload);
  return res.data;
};

export const getAdminMe = async (): Promise<Admin> => {
  const res = await api.get<{ user: Admin }>("/v1/adminbma/me");
  return res.data.user;
};

export const logoutAdmin = async () => {
  try {
    const res = await api.delete("/v1/adminbma/logout");
    return res.data;
  } finally {
    clearAuth();
  }
};