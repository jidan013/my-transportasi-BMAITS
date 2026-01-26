export type VehicleStatus = "available" | "borrowed" | "maintenance";

export interface Vehicle {
  id: number;
  nama_kendaraan: string;
  jenis_kendaraan: string;
  warna_kendaraan: string;
  nomor_polisi: string;
  bahan_bakar: string;
  kapasitas_penumpang: number;
  status_ketersediaan: VehicleStatus;
  created_at: string;
  updated_at: string;
}
