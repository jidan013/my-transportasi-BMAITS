const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

export interface Vehicle {
  id: number
  nama_kendaraan: string
  jenis_kendaraan: string
  warna_kendaraan: string
  nomor_polisi: string
  bbm: string
  kapasitas_penumpang: number
  status_ketersediaan: "available" | "borrowed" | "maintenance"
  created_at: string
  updated_at: string
}

export type VehicleStatus = "available" | "borrowed" | "maintenance"

class VehicleAPI {
  private baseUrl: string

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  async getVehicles(): Promise<Vehicle[]> {
    const res = await fetch(`${this.baseUrl}/vehicles`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
      },
      cache: "no-store", // ✅ client fetch
    })

    if (!res.ok) {
      throw new Error("Failed to fetch vehicles")
    }

    return res.json()
  }

  async createVehicle(
    vehicle: Omit<Vehicle, "id" | "created_at" | "updated_at">
  ): Promise<Vehicle> {
    const res = await fetch(`${this.baseUrl}/vehicles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(vehicle),
    })

    if (!res.ok) {
      throw new Error("Failed to create vehicle")
    }

    return res.json()
  }

  async updateVehicle(
    id: number,
    vehicle: Partial<Vehicle>
  ): Promise<Vehicle> {
    const res = await fetch(`${this.baseUrl}/vehicles/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
      body: JSON.stringify(vehicle),
    })

    if (!res.ok) {
      throw new Error("Failed to update vehicle")
    }

    return res.json()
  }

  async deleteVehicle(id: number): Promise<void> {
    const res = await fetch(`${this.baseUrl}/vehicles/${id}`, {
      method: "DELETE",
      headers: {
        "Accept": "application/json",
      },
    })

    if (!res.ok) {
      throw new Error("Failed to delete vehicle")
    }
  }
}

export const vehicleAPI = new VehicleAPI(API_BASE_URL)
