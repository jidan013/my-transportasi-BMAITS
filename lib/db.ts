const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export interface Vehicle {
  id: number;
  nama_kendaraan: string;
  jenis_kendaraan: string;
  warna_kendaraan: string;
  nomor_polisi: string;
  bahan_bakar: string; // ✅ Sesuai database
  kapasitas_penumpang: number;
  status_ketersediaan: "tersedia" | "dipinjam" | "maintenance"; // ✅ Sesuai enum Laravel
  created_at: string;
  updated_at: string;
}

export type VehicleStatus = "tersedia" | "dipinjam" | "maintenance";

interface VehicleAPIResponse {
  success: boolean;
  data: Vehicle[];
  total: number;
}

interface SingleVehicleResponse {
  success: boolean;
  message?: string;
  data: Vehicle;
}
class VehicleAPI {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  async getVehicles(): Promise<Vehicle[]> {
    const res = await fetch(`${this.baseUrl}/v1/vehicles`, { // ✅ Fix URL
      method: "GET",
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to fetch vehicles");
    }

    const json: VehicleAPIResponse = await res.json();
    return json.data; // ✅ Return array dari data field
  }

  async createVehicle(
    vehicle: Omit<Vehicle, "id" | "created_at" | "updated_at">,
    token?: string
  ): Promise<Vehicle> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${this.baseUrl}/v1/vehicles`, { // ✅ Fix URL
      method: "POST",
      headers,
      body: JSON.stringify(vehicle),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to create vehicle");
    }

    const json: SingleVehicleResponse = await res.json();
    return json.data;
  }

  async updateVehicle(
    id: number,
    vehicle: Partial<Vehicle>,
    token?: string
  ): Promise<Vehicle> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${this.baseUrl}/v1/vehicles/${id}`, { // ✅ Fix URL
      method: "PUT",
      headers,
      body: JSON.stringify(vehicle),
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to update vehicle");
    }

    const json: SingleVehicleResponse = await res.json();
    return json.data;
  }

  async deleteVehicle(id: number, token?: string): Promise<void> {
    const headers: HeadersInit = {
      Accept: "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${this.baseUrl}/v1/vehicles/${id}`, { 
      method: "DELETE",
      headers,
    });

    if (!res.ok) {
      const error = await res.json();
      throw new Error(error.message || "Failed to delete vehicle");
    }
  }
}

export const vehicleAPI = new VehicleAPI(API_BASE_URL)
