export type UserRole = "admin" | "user";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string | null;
}

export interface Admin {
  id: number;
  name: string;
  email: string;
  role: "admin";
  avatar?: string | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  admin: Admin;
  user: User;
}
