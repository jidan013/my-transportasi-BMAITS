export type BookingStatus = "pending" | "approved" | "rejected";

export interface BookingPayload {
  nrp: string;
  nama: string;
  keperluan: string;
  tanggal_peminjaman: string;
  tanggal_kembali: string;
  vehicle_id: number;
}

export interface Booking {
  id: number;
  nrp: string;
  nama: string;
  keperluan: string;
  tanggal_peminjaman: string;
  tanggal_kembali: string;
  vehicle_id: number;
  status: BookingStatus;
  created_at: string;
  catatan?: string;
}
