export type VehicleStatus = "tersedia" | "dipinjam";

export interface Vehicle {
  id: number;
  nama_kendaraan: string;
  jenis_kendaraan: string;
  warna_kendaraan: string;
  no_plat: string;
  bahan_bakar: string;
  kapasitas_penumpang: number;
  status_ketersediaan: VehicleStatus;
  created_at: string;
  updated_at: string;
}
