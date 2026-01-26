import { Vehicle } from "./vehicle";

export interface Booking {
  id: number;
  nama: string;
  nrp: number;
  unit_kerja: string;
  vehicle_id: number;
  tanggal_peminjam: string;
  tanggal_kembali: string;
  keperluan: string;
  status_pengajuan: "menunggu" | "disetujui" | "ditolak" | "dikembalikan";
  created_at: string;
  updated_at: string;
  vehicle?: Vehicle;
}

export interface BookingPayload {
  nama: string;
  nrp: string;
  unit_kerja: string;
  vehicle_id: number;
  tanggal_peminjaman: string; 
  tanggal_kembali: string; 
  detail_keperluan: string;
}