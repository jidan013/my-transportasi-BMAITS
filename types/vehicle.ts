export type VehicleStatus = "available" | "borrowed" | "maintenance";

export interface Vehicle {
  id: number;
  nama_kendaraan: string;
  jenis_kendaraan: string;
  warna_kendaraan: string;
  nomor_polisi: string;
  bbm: string;
  kapasitas_penumpang: number;
  status_ketersediaan: VehicleStatus;
  created_at: string;
  update_at: string;
}
