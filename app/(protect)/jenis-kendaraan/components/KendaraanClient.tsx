"use client"

import { useState, useEffect, useCallback, ChangeEvent, JSX } from "react"
import { Search, RefreshCw } from "lucide-react"
import { motion } from "framer-motion"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"

import { vehicleAPI, Vehicle, VehicleStatus } from "@/lib/db"

/* =======================
   TYPES
======================= */
type FilterStatus = VehicleStatus | "Semua"

interface PemakaianBulanan {
  bulan: string
  pemakaian: number
}

/* =======================
   STATIC DATA
======================= */
const pemakaianBulanan: PemakaianBulanan[] = [
  { bulan: "Jan", pemakaian: 28 },
  { bulan: "Feb", pemakaian: 35 },
  { bulan: "Mar", pemakaian: 42 },
  { bulan: "Apr", pemakaian: 31 },
  { bulan: "Mei", pemakaian: 44 },
  { bulan: "Jun", pemakaian: 39 },
  { bulan: "Jul", pemakaian: 48 },
  { bulan: "Agu", pemakaian: 40 },
  { bulan: "Sep", pemakaian: 45 },
  { bulan: "Okt", pemakaian: 50 },
  { bulan: "Nov", pemakaian: 37 },
  { bulan: "Des", pemakaian: 33 },
]

/* =======================
   PAGE
======================= */
export default function KendaraanPage(): JSX.Element {
  const [kendaraan, setKendaraan] = useState<Vehicle[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [search, setSearch] = useState<string>("")
  const [status, setStatus] = useState<FilterStatus>("Semua")

  const fetchVehicles = useCallback(async (): Promise<void> => {
    setLoading(true)
    try {
      const data = await vehicleAPI.getVehicles()
      setKendaraan(data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchVehicles()
  }, [fetchVehicles])

  const filtered = kendaraan.filter(
    (k) =>
      (status === "Semua" || k.status_ketersediaan === status) &&
      k.nama_kendaraan.toLowerCase().includes(search.toLowerCase())
  )

  const badgeClass = (s: VehicleStatus): string => {
    switch (s) {
      case "tersedia":
        return "bg-green-100 text-green-700"
      case "dipinjam":
        return "bg-blue-100 text-blue-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  if (loading) {
    return (
      <main className="w-screen min-h-screen flex items-center justify-center bg-gray-50">
        <RefreshCw className="w-10 h-10 animate-spin text-blue-600" />
      </main>
    )
  }

  return (
    <main className="w-screen min-h-screen bg-linear-to-b from-blue-50 via-white to-gray-50 px-8 py-10">
      {/* HEADER */}
      <motion.div
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-10"
      >
        <h1 className="text-3xl font-extrabold">
          🚗 Data Kendaraan Dinas ITS
        </h1>
      </motion.div>

      {/* CHART */}
      <section className="min-h-120 bg-white rounded-2xl shadow p-6 mb-10">
        <h2 className="font-semibold mb-4">📊 Pemakaian Bulanan</h2>
        <div className="w-full h-120">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={pemakaianBulanan}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="bulan" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="pemakaian"
                stroke="#2563eb"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* FILTER */}
      <div className="flex gap-4 mb-6 w-full">
        <div className="flex items-center gap-2 flex-1">
          <Search className="text-gray-500" />
          <input
            className="border px-3 py-2 rounded w-full"
            placeholder="Cari kendaraan..."
            value={search}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setSearch(e.target.value)
            }
          />
        </div>

        <select
          className="border px-3 py-2 rounded"
          value={status}
          onChange={(e: ChangeEvent<HTMLSelectElement>) =>
            setStatus(e.target.value as FilterStatus)
          }
        >
          <option value="Semua">Semua</option>
          <option value="available">Tersedia</option>
          <option value="borrowed">Dipinjam</option>
          <option value="maintenance">Perawatan</option>
        </select>
      </div>

      {/* TABLE */}
      <div className="w-full bg-white rounded-2xl shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="px-4 py-3 text-left">Nama</th>
              <th className="px-4">Jenis</th>
              <th className="px-4">Nopol</th>
              <th className="px-4">Kapasitas</th>
              <th className="px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((k) => (
              <tr key={k.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3 font-semibold">
                  {k.nama_kendaraan}
                </td>
                <td className="px-4">{k.jenis_kendaraan}</td>
                <td className="px-4 font-mono">{k.nomor_polisi}</td>
                <td className="px-4 text-center">
                  {k.kapasitas_penumpang}
                </td>
                <td className="px-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-bold ${badgeClass(
                      k.status_ketersediaan
                    )}`}
                  >
                    {k.status_ketersediaan}
                  </span>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="text-center py-10 text-gray-500">
                  Data tidak ditemukan
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  )
}
