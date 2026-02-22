import api from "@/lib/axios";
import type { Booking, BookingPayload } from "@/types/booking";
import type { Vehicle } from "@/types/vehicle";
import axios from "axios";

interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  total?: number;
  download_url?: string;
}

/* ===============================
   PUBLIC (NO AUTH)
================================ */

// Submit booking
export const submitBooking = async (
  payload: BookingPayload
): Promise<Booking> => {
  const res = await api.post<ApiResponse<Booking>>("/v1/booking", payload);

  if (!res.data.success) {
    throw new Error(res.data.message || "Gagal mengajukan peminjaman");
  }

  return res.data.data;
};

// Check booking by NRP
export const checkBookingByNRP = async (
  nrp: string
): Promise<Booking[]> => {
  try {
    const res = await api.get<ApiResponse<Booking[]>>(
      `/v1/booking/check/${nrp}`
    );

    return res.data.data ?? [];
  } catch (err: unknown) {
  if (axios.isAxiosError(err)) {
    if (err.response?.status === 404) {
      return [];
    }

    throw new Error(
      err.response?.data?.message || "Terjadi kesalahan pada server"
    );
  }

  throw new Error("Unexpected error");
}
};

// Get available vehicles
export const getAvailableVehicles = async (params: {
  tanggal_pinjam: string;
  tanggal_kembali: string;
}): Promise<Vehicle[]> => {
  const res = await api.get<ApiResponse<Vehicle[]>>(
    "/v1/booking/available-vehicles",
    { params }
  );

  if (!res.data.success) {
    throw new Error(res.data.message || "Gagal memuat kendaraan");
  }

  return res.data.data;
};

// Approved bookings (calendar)
export const getApprovedBookings = async (): Promise<Booking[]> => {
  const res = await api.get<ApiResponse<Booking[]>>(
    "/v1/booking/approved"
  );

  return res.data.data;
};

// Booking schedule by date range
export const getBookingSchedule = async (params: {
  start_date: string;
  end_date: string;
  vehicle_id?: number;
}): Promise<Booking[]> => {
  const res = await api.get<ApiResponse<Booking[]>>(
    "/v1/booking/schedule",
    { params }
  );

  return res.data.data;
};

// Booking by vehicle
export const getBookingByVehicle = async (
  vehicleId: number
): Promise<Booking[]> => {
  const res = await api.get<ApiResponse<Booking[]>>(
    `/v1/booking/vehicle/${vehicleId}`
  );

  return res.data.data;
};

/* ===============================
   ADMIN (AUTH REQUIRED)
================================ */

// Get all bookings
export const getAllBookings = async (): Promise<Booking[]> => {
  const res = await api.get<ApiResponse<Booking[]>>("/v1/booking");
  return res.data.data;
};

// Get pending bookings
export const getPendingBookings = async (): Promise<Booking[]> => {
  const res = await api.get<ApiResponse<Booking[]>>(
    "/v1/booking/pending"
  );

  return res.data.data;
};

// Approve booking + generate PDF
export const approveBooking = async (
  id: number
): Promise<{
  booking: Booking;
  downloadUrl: string | null;
}> => {
  const res = await api.patch<ApiResponse<Booking>>(
    `/v1/booking/${id}/approve`
  );

  if (!res.data.success) {
    throw new Error(res.data.message || "Gagal menyetujui peminjaman");
  }

  return {
    booking: res.data.data,
    downloadUrl: res.data.download_url ?? null,
  };
};

// Reject booking
export const rejectBooking = async (id: number): Promise<Booking> => {
  const res = await api.patch<ApiResponse<Booking>>(
    `/v1/booking/${id}/reject`
  );

  if (!res.data.success) {
    throw new Error(res.data.message || "Gagal menolak peminjaman");
  }

  return res.data.data;
};

// Booking detail
export const getBookingDetail = async (
  id: number
): Promise<Booking> => {
  const res = await api.get<ApiResponse<Booking>>(
    `/v1/booking/${id}`
  );

  if (!res.data.success) {
    throw new Error(res.data.message || "Data tidak ditemukan");
  }

  return res.data.data;
};