export interface LoginPayload {
  email: string;
  password: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  role: "admin" | "user";
}

export interface LoginResponse {
  message: string;
  user: User;
  redirectTo?: string;
}

export type MeResponse = User;
