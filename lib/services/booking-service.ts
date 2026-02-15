import api from "@/lib/axios";
import { Booking, BookingPayload } from "@/types/booking";
import { Vehicle } from "@/types/vehicle";

// ✅ Submit booking (rate limit 10/min)
export const submitBooking = async (payload: BookingPayload) => {
  const res = await api.post<Booking>("/v1/booking", payload);
  return res.data;
};

// 🔍 Check status by NRP
export const checkBookingByNRP = async (nrp: string) => {
  const res = await api.get<Booking | null>(`/v1/booking/check/${nrp}`);
  return res.data;
};

// 📋 Get all bookings
export const getAllBookings = async () => {
  const res = await api.get<Booking[]>("/v1/booking");
  return res.data;
};

// 📅 Approved bookings (calendar)
export const getApprovedBookings = async () => {
  const res = await api.get<Booking[]>("/v1/booking/approved");
  return res.data;
};

// 🚗 Booking by vehicle
export const getBookingByVehicle = async (vehicleId: number) => {
  const res = await api.get<Booking[]>(`/v1/booking/vehicle/${vehicleId}`);
  return res.data;
};

// 📆 Schedule by date range
export const getBookingSchedule = async (params: {
  start_date: string;
  end_date: string;
  vehicle_id?: number;
}) => {
  const res = await api.get<Booking[]>("/v1/booking/schedule", { params });
  return res.data;
};

// 🚘 Available vehicles by date
export const getAvailableVehicles = async (params: {
  tanggal_pinjam: string;
  tanggal_kembali: string;
}) => {
  const res = await api.get<Vehicle[]>("/v1/booking/available-vehicles", { params });
  return res.data;
};

// ✅ Approve
export const approveBooking = async (id: number) => {
  const res = await api.patch(`/v1/booking/${id}/approve`);
  return res.data;
};

// ❌ Reject
export const rejectBooking = async (id: number) => {
  const res = await api.patch(`/v1/booking/${id}/reject`);
  return res.data;
};
