export type UserRole = "admin" | "user";

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string | null;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user?: User;
  redirectTo?: string;
}

export interface LogoutResponse {
  message: string;
}

export interface BookingPayload {
  nrp: string;
  nama: string;
  keperluan: string;
  tanggal: string;
}

export interface BookingResponse {
  id: number;
  nrp: string;
  nama: string;
  keperluan: string;
  tanggal: string;
  created_at: string;
  updated_at: string;
}

export type MeResponse = User;

export type BookingListResponse = BookingResponse[];

export type BookingCheckResponse = BookingResponse | null;

export interface ApiErrorResponse {
  message: string;
  errors?: Record<string, string[]>;
}
