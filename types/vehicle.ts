export type VehicleStatus = "available" | "borrowed" | "maintenance";

export interface Vehicle {
  id: number;
  nama: string;
  jenis: string;
  warna: string;
  plate: string;
  bbm: string;
  kapasitas: string;
  status: VehicleStatus;
  created_at: string;
}
