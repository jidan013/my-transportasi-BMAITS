

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
  role?: string; 
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user: Admin;
  access_token: string;
  token_type: "Bearer";
}

export interface MeResponse {
  user: Admin;
}

export interface AuthState {
  user: Admin | null;
  token: string | null;
  isAuthenticated: boolean;
}