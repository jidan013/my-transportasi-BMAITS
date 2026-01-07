import Api from "@/lib/axios";

export interface BookingPayload {
  nrp: string;
  nama: string;
  keperluan: string;
  tanggal: string;
}

export async function createBooking(data: BookingPayload) {
  const res = await Api.post("/api/booking", data);
  return res.data;
}

export async function getAllBookings() {
  const res = await Api.get("/api/booking");
  return res.data;
}

export async function checkBookingByNrp(nrp: string) {
  const res = await Api.get(`/api/booking/check/${nrp}`);
  return res.data;
}
