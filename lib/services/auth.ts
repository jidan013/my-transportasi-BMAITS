import Api from "@/lib/axios";
import type {
  LoginPayload,
  LoginResponse,
  User,
} from "@/types/auth";

/* =====================
   LOGIN ADMIN
===================== */
export async function adminLogin(
  data: LoginPayload
): Promise<LoginResponse> {
  await Api.get("/sanctum/csrf-cookie");
  const res = await Api.post("/api/v1/adminbma/login", data);
  return res.data;
}

/* =====================
   GET LOGGED USER
===================== */
export async function getMe(): Promise<User> {
  const res = await Api.get<User>("/user");
  return res.data;
}

/* =====================
   LOGOUT
===================== */
export async function logout() {
  await Api.post("/api/v1/adminbma/logout");
}
