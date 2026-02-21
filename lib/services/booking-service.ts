import api from "@/lib/axios";
import type { Booking, BookingPayload } from "@/types/booking";
import type { Vehicle } from "@/types/vehicle";

/* ===============================
   API RESPONSE WRAPPER (Laravel)
================================ */
interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
  total?: number;
}

/* ===============================
   PUBLIC
================================ */

//  Submit booking
export const submitBooking = async (payload: BookingPayload) => {
  const res = await api.post<ApiResponse<Booking>>("/v1/booking", payload);
  return res.data.data;
};

//  Check booking by NRP
export const checkBookingByNRP = async (nrp: string) => {
  const res = await api.get<ApiResponse<Booking[]>>(
    `/v1/booking/check/${nrp}`
  );
  return res.data.data;
};

//  Get available vehicles
export const getAvailableVehicles = async (params: {
  tanggal_pinjam: string;
  tanggal_kembali: string;
}) => {
  const res = await api.get<ApiResponse<Vehicle[]>>(
    "/v1/booking/available-vehicles",
    { params }
  );
  return res.data.data;
};

//  Approved bookings (calendar public)
export const getApprovedBookings = async () => {
  const res = await api.get<ApiResponse<Booking[]>>(
    "/v1/booking/approved"
  );
  return res.data.data;
};

//  Booking schedule by date range
export const getBookingSchedule = async (params: {
  start_date: string;
  end_date: string;
  vehicle_id?: number;
}) => {
  const res = await api.get<ApiResponse<Booking[]>>(
    "/v1/booking/schedule",
    { params }
  );
  return res.data.data;
};

//  Booking by vehicle
export const getBookingByVehicle = async (vehicleId: number) => {
  const res = await api.get<ApiResponse<Booking[]>>(
    `/v1/booking/vehicle/${vehicleId}`
  );
  return res.data.data;
};

/* ===============================
   ADMIN (AUTH REQUIRED)
================================ */

//  Get all bookings
export const getAllBookings = async () => {
  const res = await api.get<ApiResponse<Booking[]>>("/v1/booking");
  return res.data.data;
};

//  Pending bookings
export const getPendingBookings = async () => {
  const res = await api.get<ApiResponse<Booking[]>>(
    "/v1/booking/pending"
  );
  return res.data.data;
};

//  Approve booking + generate PDF
export const approveBooking = async (id: number) => {
  const res = await api.patch<
    ApiResponse<Booking> & { download_url?: string }
  >(`/v1/booking/${id}/approve`);

  return {
    booking: res.data.data,
    downloadUrl: res.data.download_url ?? null,
  };
};

//  Reject booking
export const rejectBooking = async (id: number) => {
  const res = await api.patch<ApiResponse<Booking>>(
    `/v1/booking/${id}/reject`
  );
  return res.data.data;
};

//  Detail booking
export const getBookingDetail = async (id: number) => {
  const res = await api.get<ApiResponse<Booking>>(
    `/v1/booking/${id}`
  );
  return res.data.data;
};