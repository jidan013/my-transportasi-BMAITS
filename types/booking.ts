import { Vehicle } from "./vehicle";

export type Booking = {
  id: number;
  nama: string;
  nrp: string;
  unit_kerja: string;
  vehicle_id: number;
  tanggal_pinjam: string;
  tanggal_kembali: string;
  keperluan: string;
  status_booking: "menunggu" | "disetujui" | "ditolak"; // bukan 'status'
  vehicle?: {
    id: number;
    nama_kendaraan: string;
    nomor_polisi: string; // sesuaikan dengan field di model Vehicle
  };
};

export interface BookingPayload {
  nama: string;
  nrp: number;
  unit_kerja: string;
  vehicle_id: number;
  tanggal_pinjam: string; 
  tanggal_kembali: string; 
  keperluan: string;
}

export interface BookingCalendar {
  id: number
  tanggal_pinjam: string
  tanggal_kembali: string
  vehicle: {
    nama_kendaraan: string
  }
  unit_kerja: string
}