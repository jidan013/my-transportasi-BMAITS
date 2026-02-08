export type UserRole = "admin" | "user";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}

export interface Admin {
  id: number;
  name: string;
  email: string;
  password: string;
  remember_token?: string;
  created_at?: string;
  updated_at?: string;
  role?:string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  access_token: string;
  user: Admin;
}