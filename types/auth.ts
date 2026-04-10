export type UserRole = "admin" | "user";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
}


export interface Admin {
  id: number;
  email: string;
  name?: string;  
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

// Auth service response types
export interface MeResponse {
  user: Admin;
}

// Frontend state types
export interface AuthState {
  user: Admin | null;
  token: string | null;
  isAuthenticated: boolean;
}