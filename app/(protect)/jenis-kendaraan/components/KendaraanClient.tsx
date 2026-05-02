"use client"

import { useState, useEffect, useCallback, JSX } from "react"
import { RefreshCw, Search, MoreVertical, Plus, Users, Package, Zap, Car, Bus, Truck } from "lucide-react"
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

// ==========================================
// TODO: Sesuaikan path import di bawah ini 
// dengan struktur folder project kamu
// ==========================================
import type { Vehicle } from "@/types/vehicle"
import type { Booking } from "@/types/booking"
import { getVehicles } from "@/lib/services/vehicle"
import { getAllBookings } from "@/lib/services/booking-service"

/* ─── Types ──────────────────────────────────────────────── */

type VehicleStatus = "tersedia" | "dipinjam" | string
type FilterStatus = VehicleStatus | "Semua"

interface PemakaianBulanan { 
  bulan: string; 
  pemakaian: number 
}

/* ─── Helpers ────────────────────────────────────────────── */

function statusLabel(s: VehicleStatus): string {
  const status = s?.toLowerCase()
  return status === "tersedia" ? "Tersedia" : status === "dipinjam" ? "Dipinjam" : ""
}

function statusBadge(s: VehicleStatus) {
  const status = s?.toLowerCase()

  if (status === "tersedia") {
    return {
      bg: "bg-emerald-50 text-emerald-700 border border-emerald-200",
      dot: "bg-emerald-500",
      label: "TERSEDIA",
    }
  }

  if (status === "dipinjam") {
    return {
      bg: "bg-blue-50 text-blue-700 border border-blue-200",
      dot: "bg-blue-500",
      label: "DIPINJAM",
    }
  }

  // ✅ fallback biar tidak undefined
  return {
    bg: "bg-gray-100 text-gray-600 border border-gray-200",
    dot: "bg-gray-400",
    label: "UNKNOWN",
  }
}

function VehicleIcon({ jenis, size = 18 }: { jenis?: string; size?: number }) {
  if (!jenis) return <Car size={size} />
  const j = jenis.toLowerCase()
  if (j.includes("bus") || j.includes("minibus") || j.includes("microbus")) return <Bus size={size} />
  if (j.includes("truk") || j.includes("pickup"))                           return <Truck size={size} />
  if (j.includes("elektrik") || j.includes("ev") || j.includes("elektro"))  return <Zap size={size} />
  return <Car size={size} />
}

function hubLabel(jenis?: string): string {
  if (!jenis) return "Sarpras Facility Hub"
  const j = jenis.toLowerCase()
  if (j.includes("sedan") || j.includes("executive")) return "Rektorat Main Hub"
  if (j.includes("elektrik") || j.includes("ev") || j.includes("elektro")) return "Smart Campus Charging Zone"
  if (j.includes("bus") || j.includes("minibus") || j.includes("microbus")) return "Logistics Central Garage"
  return "Sarpras Facility Hub"
}

/* ─── Sub-components ─────────────────────────────────────── */

function FeaturedCard({ vehicle }: { vehicle: Vehicle }) {
  const badge = statusBadge(vehicle.status_ketersediaan)
  return (
    <div className="flex-1 min-w-0 rounded-2xl border border-gray-200 overflow-hidden bg-white shadow-sm">
      <div className="relative h-52 bg-gradient-to-br from-gray-100 to-gray-200 flex items-end p-4">
        <div className="absolute inset-0 flex items-center justify-center opacity-20">
          <VehicleIcon jenis={vehicle.jenis_kendaraan} size={96} />
        </div>
        <span className="relative z-10 text-xs font-bold tracking-widest text-white bg-[#013C9E]/80 backdrop-blur px-3 py-1.5 rounded-lg uppercase flex items-center gap-1.5">
          <Car size={12} /> Armada Utama
        </span>
      </div>

      <div className="p-6">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-xl font-bold text-gray-900 leading-tight">{vehicle.nama_kendaraan}</h3>
          <span className={`shrink-0 text-[10px] font-black tracking-wider px-2.5 py-1 rounded-md ${badge.bg}`}>
            {vehicle.kapasitas_penumpang || 0} KURSI
          </span>
        </div>
        <p className="text-sm text-gray-500 mb-5 leading-relaxed">
          Kendaraan dinas untuk keperluan operasional dan perjalanan resmi institusi.
        </p>

        <div className="grid grid-cols-2 gap-4 mb-5">
          <div>
            <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">Kapasitas</p>
            <p className="text-2xl font-black text-gray-900">
              {vehicle.kapasitas_penumpang || 0}
              <span className="text-sm font-normal text-gray-500 ml-1">Orang</span>
            </p>
          </div>
          <div>
            <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1">Nomor Polisi</p>
            <p className="text-base font-black font-mono text-[#013C9E]">{vehicle.nomor_polisi || "-"}</p>
          </div>
        </div>

        <div>
          <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-2">Jenis Kendaraan</p>
          <div className="flex flex-wrap gap-2">
            <span className="text-xs px-3 py-1.5 rounded-lg bg-gray-100 text-gray-700 font-semibold border border-gray-200">
              {vehicle.jenis_kendaraan || "Umum"}
            </span>
            <span className={`text-xs px-3 py-1.5 rounded-lg font-semibold ${badge.bg}`}>
              {statusLabel(vehicle.status_ketersediaan)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function SustainabilityCard({ vehicle }: { vehicle: Vehicle }) {
  return (
    <div className="w-[260px] shrink-0 rounded-2xl bg-[#013C9E] text-white p-6 flex flex-col shadow-lg overflow-hidden relative">
      <div className="absolute right-4 top-4 opacity-10 select-none pointer-events-none">
        <Zap size={120} strokeWidth={1} />
      </div>

      <div className="w-11 h-11 rounded-xl bg-white/10 flex items-center justify-center mb-4 relative z-10">
        <VehicleIcon jenis={vehicle.jenis_kendaraan} size={20} />
      </div>

      <h3 className="text-xl font-black leading-tight mb-2 relative z-10">{vehicle.nama_kendaraan}</h3>
      <p className="text-sm text-blue-200 leading-relaxed mb-6 relative z-10">
        Kendaraan dinas operasional kampus untuk kebutuhan harian institusi.
      </p>

      <div className="space-y-3 mb-6 relative z-10">
        <div className="flex justify-between items-center border-t border-white/10 pt-3">
          <span className="text-sm text-blue-200">Kapasitas</span>
          <span className="text-lg font-black">{vehicle.kapasitas_penumpang || 0} Orang</span>
        </div>
        <div className="flex justify-between items-center border-t border-white/10 pt-3">
          <span className="text-sm text-blue-200">Nomor Polisi</span>
          <span className="text-base font-black font-mono">{vehicle.nomor_polisi || "-"}</span>
        </div>
        <div className="flex justify-between items-center border-t border-white/10 pt-3">
          <span className="text-sm text-blue-200">Jenis</span>
          <span className="text-sm font-bold">{vehicle.jenis_kendaraan || "-"}</span>
        </div>
      </div>

      <div className="mt-auto relative z-10">
        <span className="text-[10px] font-black tracking-widest text-[#FFBD07] uppercase">
          ITS Institutional Fleet
        </span>
        <span className="ml-3 text-[10px] bg-white/10 px-2 py-0.5 rounded font-bold">
          Active
        </span>
      </div>
    </div>
  )
}

function CategoryCard({
  icon,
  label,
  metaLabel,
  metaValue,
  description,
  vehicles,
}: {
  icon: React.ReactNode
  label: string
  metaLabel: string
  metaValue: string
  description: string
  vehicles: Vehicle[]
}) {
  return (
    <div className="flex-1 min-w-0 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between mb-1">
        <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500">
          {icon}
        </div>
        <div className="text-right">
          <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">{metaLabel}</p>
          <p className="text-2xl font-black text-gray-900">{metaValue}</p>
        </div>
      </div>

      <h3 className="text-lg font-black text-gray-900 mt-3 mb-1">{label}</h3>
      <p className="text-sm text-gray-500 leading-relaxed mb-5">{description}</p>

      <div className="space-y-3 border-t border-gray-100 pt-4">
        {vehicles.slice(0, 3).map((v) => (
          <div key={v.id} className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-gray-600">
              <VehicleIcon jenis={v.jenis_kendaraan} size={15} />
              <span className="text-sm font-medium">{v.nama_kendaraan}</span>
            </div>
            <span className="text-sm font-black text-[#013C9E]">
              {v.kapasitas_penumpang || 0} Orang
            </span>
          </div>
        ))}
        {vehicles.length === 0 && (
          <p className="text-sm text-gray-400 italic">Tidak ada data</p>
        )}
      </div>
    </div>
  )
}

/* ─── Main Page ──────────────────────────────────────────── */

export default function KendaraanPage(): JSX.Element {
  const [kendaraan, setKendaraan]           = useState<Vehicle[]>([])
  const [pemakaian, setPemakaian]           = useState<PemakaianBulanan[]>([])
  const [loading, setLoading]               = useState(true)
  const [search, setSearch]                 = useState("")
  const [filterStatus, setFilterStatus]     = useState<FilterStatus>("Semua")

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      // 1. Fetch Data Kendaraan
      const vehiclesData = await getVehicles()
      setKendaraan(vehiclesData || [])

      // 2. Fetch Data Booking untuk Chart (Agregasi Bulanan)
      const bookingsData = await getAllBookings()
      
      if (bookingsData && bookingsData.length > 0) {
        const BULAN = ["Jan","Feb","Mar","Apr","Mei","Jun","Jul","Agu","Sep","Okt","Nov","Des"]
        const counts: Record<number, number> = {}

        for (const booking of bookingsData) {
          // Mendefinisikan struktur sementara untuk menghindari 'any'
          const b = booking as typeof booking & {
            tanggal_pinjam?: string | number | Date;
            start_date?: string | number | Date;
            created_at?: string | number | Date;
          };

          // Mengambil tanggal dengan aman
          const rawDate = b.tanggal_pinjam || b.start_date || b.created_at || Date.now();
            
          const d = new Date(rawDate);
          const m = d.getMonth(); // 0-11
          counts[m] = (counts[m] ?? 0) + 1;
        }

        const built: PemakaianBulanan[] = BULAN.map((bulan, i) => ({
          bulan,
          pemakaian: counts[i] ?? 0,
        }))
        setPemakaian(built)
      } else {
        setPemakaian([])
      }
    } catch (e) {
      console.error("Gagal memuat data dari API:", e)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { 
    fetchAll() 
  }, [fetchAll])

  /* ── Derived Variables ── */
  const tersedia      = kendaraan.filter(k => k.status_ketersediaan?.toLowerCase() === "tersedia")
  const dipinjam      = kendaraan.filter(k => k.status_ketersediaan?.toLowerCase() === "dipinjam")

  const featured0     = kendaraan[0] ?? null
  const featured1     = kendaraan[1] ?? null

  const massPassenger = kendaraan.filter(k =>
    (k.jenis_kendaraan || "").toLowerCase().includes("bus") ||
    (k.jenis_kendaraan || "").toLowerCase().includes("minibus") ||
    (k.jenis_kendaraan || "").toLowerCase().includes("microbus") ||
    (k.kapasitas_penumpang && k.kapasitas_penumpang >= 8)
  )
  const utility = kendaraan.filter(k => !massPassenger.includes(k))

  const tableRows = kendaraan.filter(k =>
    (filterStatus === "Semua" || k.status_ketersediaan === filterStatus) &&
    (
      (k.nama_kendaraan || "").toLowerCase().includes(search.toLowerCase()) ||
      (k.jenis_kendaraan || "").toLowerCase().includes(search.toLowerCase()) ||
      (k.nomor_polisi || "").toLowerCase().includes(search.toLowerCase())
    )
  )

  /* ── Loading State ── */
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
          <RefreshCw className="w-10 h-10 text-[#013C9E]" />
        </motion.div>
      </div>
    )
  }

  /* ── Page Layout ── */
  return (
    <div className="px-8 py-8 space-y-8 max-w-[1100px]">

      {/* Breadcrumb + Header */}
      <div>
        <p className="text-sm text-gray-400 mb-1">
          <span className="hover:text-gray-600 cursor-pointer">Assets</span>
          <span className="mx-1.5">/</span>
          <span className="text-[#013C9E] font-medium">Data Kendaraan</span>
        </p>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900">Data Kendaraan Dinas</h1>
            <p className="text-sm text-gray-500 mt-1 max-w-xl leading-relaxed">
              Kelola dan pantau seluruh aset kendaraan institusi ITS — dari kendaraan operasional
              harian hingga armada kapasitas besar.
            </p>
          </div>
          <button className="shrink-0 flex items-center gap-2 px-4 py-2.5 bg-[#013C9E] text-white text-sm font-bold rounded-xl hover:bg-[#012f80] transition-colors shadow-sm">
            <Plus size={16} />
            Tambah Kendaraan
          </button>
        </div>
      </div>

      {/* Featured Cards */}
      {featured0 && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex gap-5"
        >
          <FeaturedCard vehicle={featured0} />
          {featured1 && <SustainabilityCard vehicle={featured1} />}
        </motion.div>
      )}

      {/* Category Cards */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="flex gap-5"
      >
        <CategoryCard
          icon={<Users size={18} />}
          label="Kendaraan Penumpang"
          metaLabel="Armada Aktif"
          metaValue={`${massPassenger.length} Unit`}
          description="Kendaraan untuk shuttle mahasiswa, kunjungan departemen, dan program komuter staf."
          vehicles={massPassenger}
        />
        <CategoryCard
          icon={<Package size={18} />}
          label="Utilitas & Logistik"
          metaLabel="Total Unit"
          metaValue={`${utility.length} Unit`}
          description="Aset untuk pemeliharaan fasilitas, pengiriman laboratorium, dan acara kampus."
          vehicles={utility}
        />
      </motion.div>

      {/* Table Section */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
        className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden"
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-base font-black text-gray-900">Ringkasan Ketersediaan Kendaraan</h2>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-2 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
              <Search size={14} className="text-gray-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cari kendaraan..."
                className="bg-transparent text-sm outline-none text-gray-700 placeholder-gray-400 w-40"
              />
            </div>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value as FilterStatus)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-2 bg-gray-50 text-gray-700 outline-none"
            >
              <option value="Semua">Semua Status</option>
              <option value="tersedia">Tersedia</option>
              <option value="dipinjam">Dipinjam</option>
            </select>
            <button
              onClick={fetchAll}
              className="flex items-center gap-1.5 px-3 py-2 text-sm font-bold bg-[#013C9E] text-white rounded-lg hover:bg-[#012f80] transition-colors"
            >
              <RefreshCw size={13} />
              Refresh
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left px-6 py-3 text-[11px] font-bold tracking-widest text-gray-400 uppercase">Kendaraan</th>
                <th className="text-left px-6 py-3 text-[11px] font-bold tracking-widest text-gray-400 uppercase">Kapasitas</th>
                <th className="text-left px-6 py-3 text-[11px] font-bold tracking-widest text-gray-400 uppercase">Hub Operasional</th>
                <th className="text-left px-6 py-3 text-[11px] font-bold tracking-widest text-gray-400 uppercase">Nomor Polisi</th>
                <th className="text-left px-6 py-3 text-[11px] font-bold tracking-widest text-gray-400 uppercase">Status</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {tableRows.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-16 text-center text-sm text-gray-400">
                    Tidak ada data kendaraan yang sesuai.
                  </td>
                </tr>
              ) : (
                tableRows.map((k) => {
                  const badge = statusBadge(k.status_ketersediaan)
                  return (
                    <tr key={k.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[#013C9E]/8 flex items-center justify-center text-[#013C9E]">
                            <VehicleIcon jenis={k.jenis_kendaraan} size={15} />
                          </div>
                          <div>
                            <p className="font-bold text-gray-900">{k.nama_kendaraan}</p>
                            <p className="text-xs text-gray-400">{k.jenis_kendaraan || "Kendaraan Umum"}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-black text-gray-900 text-base">
                          {String(k.kapasitas_penumpang || 0).padStart(2, "0")}
                        </span>
                        <span className="text-xs text-gray-400 ml-1">Orang</span>
                      </td>
                      <td className="px-6 py-4 text-gray-600 text-sm">{hubLabel(k.jenis_kendaraan)}</td>
                      <td className="px-6 py-4 font-mono text-[#013C9E] font-semibold text-xs">{k.nomor_polisi || "-"}</td>
                      <td className="px-6 py-4 text-center">
                        <button className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors">
                          <MoreVertical size={15} />
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {tableRows.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 bg-gray-50/40">
            <p className="text-xs text-gray-400">
              Menampilkan <span className="font-bold text-gray-700">{tableRows.length}</span> dari{" "}
              <span className="font-bold text-gray-700">{kendaraan.length}</span> kendaraan
            </p>
          </div>
        )}
      </motion.div>

      {/* Usage Chart — Real data dari getAllBookings() API */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#013C9E]/8 flex items-center justify-center text-[#013C9E]">
            <RefreshCw size={16} />
          </div>
          <div>
            <h2 className="text-base font-black text-gray-900">Statistik Pemakaian</h2>
            <p className="text-xs text-gray-400">Tren bulanan kendaraan dinas ITS</p>
          </div>
          <div className="ml-auto flex gap-3">
            <div className="text-center px-4 py-2 bg-emerald-50 rounded-xl border border-emerald-100">
              <p className="text-lg font-black text-emerald-700">{tersedia.length}</p>
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Tersedia</p>
            </div>
            <div className="text-center px-4 py-2 bg-blue-50 rounded-xl border border-blue-100">
              <p className="text-lg font-black text-blue-700">{dipinjam.length}</p>
              <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider">Dipinjam</p>
            </div>
            <div className="text-center px-4 py-2 bg-[#013C9E]/5 rounded-xl border border-[#013C9E]/10">
              <p className="text-lg font-black text-[#013C9E]">{kendaraan.length}</p>
              <p className="text-[10px] font-bold text-[#013C9E]/70 uppercase tracking-wider">Total</p>
            </div>
          </div>
        </div>

        {pemakaian.length > 0 ? (
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={pemakaian} margin={{ top: 4, right: 4, bottom: 0, left: -16 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="#F1F5F9" vertical={false} />
                <XAxis
                  dataKey="bulan"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fontWeight: 600, fill: "#94A3B8" }}
                />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: "#94A3B8" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#FFFFFF",
                    border: "1px solid #E2E8F0",
                    borderRadius: "12px",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
                    fontSize: "13px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="pemakaian"
                  stroke="#013C9E"
                  strokeWidth={2.5}
                  dot={{ fill: "#FFFFFF", strokeWidth: 2.5, stroke: "#013C9E", r: 5 }}
                  activeDot={{ r: 7, fill: "#FFBD07", strokeWidth: 3, stroke: "#013C9E" }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
            Belum ada data pemakaian tersedia.
          </div>
        )}
      </motion.div>

    </div>
  )
}