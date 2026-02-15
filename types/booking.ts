import { Vehicle } from "./vehicle";

export interface Booking {
  id: number;
  nama: string;
  nrp: number;
  unit_kerja: string;
  vehicle_id: number;
  tanggal_pinjam: string;
  tanggal_kembali: string;
  keperluan: string;
  status_booking: "menunggu" | "disetujui" | "ditolak" | "dikembalikan";
  created_at: string;
  updated_at: string;
  vehicle?: Vehicle;
}

export interface BookingPayload {
  nama: string;
  nrp: number;
  unit_kerja: string;
  vehicle_id: number;
  tanggal_pinjam: string; 
  tanggal_kembali: string; 
  keperluan: string;
}