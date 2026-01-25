import { Vehicle } from "./vehicle";

export interface Booking {
  id: number;
  nama: string;
  nrp: number;
  unit_kerja: string;
  vehicle_id: number;
  tanggal_peminjaman: string;
  tanggal_kembali: string;
  detail_keperluan: string;
  status_peminjaman: "menunggu" | "disetujui" | "ditolak" | "dikembalikan";
  created_at: string;
  updated_at: string;
  vehicle?: Vehicle;
}

export interface BookingPayload {
  nama: string;
  nrp: number;
  unit_kerja: string;
  vehicle_id: number;
  tanggal_peminjaman: string; 
  tanggal_kembali: string; 
  detail_keperluan: string;
}