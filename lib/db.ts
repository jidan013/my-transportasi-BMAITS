const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000"

export interface Vehicle {
  id: number
  nama_kendaraan: string
  jenis_kendaraan: string
  warna_kendaraan: string
  nomor_polisi: string
  bahan_bakar: string
  kapasitas_penumpang: number
  status_ketersediaan: "tersedia" | "dipinjam"
  created_at: string
  updated_at: string
}

export type VehicleStatus = "tersedia" | "dipinjam"

interface VehicleAPIResponse {
  success: boolean
  data: Vehicle[]
  total?: number
}

interface SingleVehicleResponse {
  success: boolean
  message?: string
  data: Vehicle
}

class VehicleAPI {
  private baseUrl: string

  constructor(baseUrl: string) {
    if (!baseUrl) {
      throw new Error("API_BASE_URL is not defined")
    }
    this.baseUrl = baseUrl
  }

  async getVehicles(): Promise<Vehicle[]> {
    const url = `${this.baseUrl}/v1/vehicles`
    console.log("FETCH:", url)

    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    })

    if (!res.ok) {
      throw new Error(`Failed to fetch vehicles (${res.status})`)
    }

    const json: VehicleAPIResponse = await res.json()
    return json.data
  }

  async createVehicle(
    vehicle: Omit<Vehicle, "id" | "created_at" | "updated_at">,
    token: string
  ): Promise<Vehicle> {
    const res = await fetch(`${this.baseUrl}/v1/vehicles`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(vehicle),
    })

    if (!res.ok) {
      throw new Error(`Failed to create vehicle (${res.status})`)
    }

    const json: SingleVehicleResponse = await res.json()
    return json.data
  }

  async updateVehicle(
    id: number,
    vehicle: Partial<Vehicle>,
    token: string
  ): Promise<Vehicle> {
    const res = await fetch(`${this.baseUrl}/v1/vehicles/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(vehicle),
    })

    if (!res.ok) {
      throw new Error(`Failed to update vehicle (${res.status})`)
    }

    const json: SingleVehicleResponse = await res.json()
    return json.data
  }

  async deleteVehicle(id: number, token: string): Promise<void> {
    const res = await fetch(`${this.baseUrl}/v1/vehicles/${id}`, {
      method: "DELETE",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    if (!res.ok) {
      throw new Error(`Failed to delete vehicle (${res.status})`)
    }
  }
}

export const vehicleAPI = new VehicleAPI(API_BASE_URL)
