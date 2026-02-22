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
   ITS COLOR PALETTE - FIXED HEX DIRECT
======================= */
const ITS_COLORS = {
  primary: '#013C9E',     // Biru tua ITS
  secondary: '#FFBD07',   // Kuning emas ITS
  navy: '#013880',
  lightBlue: '#DBE4F3',
  goldLight: '#FFF3CD',
  gray50: '#F8FAFC',
  gray100: '#F1F5F9',
  gray200: '#E2E8F0',
  gray500: '#64748B',
  gray600: '#475569',
  gray900: '#0F172A',
  white: '#FFFFFF',
} as const

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
   PAGE - FULLY FIXED COLORS
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
    } catch (error) {
      console.error('Error fetching vehicles:', error)
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
        return `bg-green-100 text-green-800 border-2 border-green-200 shadow-md`
      case "dipinjam":
        return `bg-blue-100 text-blue-800 border-2 border-blue-200 shadow-md`
      default:
        return `bg-gray-100 text-gray-800 border-2 border-gray-200 shadow-md`
    }
  }

  if (loading) {
    return (
      <main className="w-full min-h-screen flex items-center justify-center bg-gradient-to-br from-[#DBE4F3] to-[#F1F5F9]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <RefreshCw className="w-16 h-16 text-[#013C9E]" />
        </motion.div>
      </main>
    )
  }

  return (
    <main className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-white to-[#DBE4F3] px-6 lg:px-12 py-8 lg:py-12">
      {/* HEADER - 100% FIXED WARNA ITS BLUE */}
      <motion.section
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16 lg:mb-24 max-w-4xl mx-auto"
      >
        <motion.div 
          className="inline-flex items-center gap-6 p-8 lg:p-12 bg-gradient-to-r from-[#013C9E]/10 to-[#013880]/5 backdrop-blur-xl rounded-3xl shadow-2xl border border-[#013C9E]/20 hover:shadow-3xl hover:-translate-y-2 transition-all duration-500"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <motion.div 
            className="w-20 h-20 lg:w-28 lg:h-28 bg-gradient-to-br from-[#013C9E] via-[#1E4AA5] to-[#013880] rounded-3xl flex items-center justify-center shadow-2xl border-4 border-white/60 relative overflow-hidden"
            animate={{ rotate: [0, 3, -3, 0] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          >
            <span className="text-4xl lg:text-5xl drop-shadow-lg z-10">🚗</span>
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent rounded-3xl" />
          </motion.div>
          
          <div className="text-left min-w-0">
            <h1 className="text-2xl lg:text-2xl xl:text-2xl font-black leading-tight drop-shadow-2xl bg-gradient-to-r from-[#013C9E] via-[#1E4AA5] to-[#013880] bg-clip-text text-transparent">
              Data Kendaraan 
              <span className="block lg:inline text-[#FFBD07] drop-shadow-lg"> Dinas ITS</span>
            </h1>
            <p className="text-xl lg:text-2xl text-[#475569] font-semibold mt-6 max-w-xl leading-relaxed drop-shadow-md">
              Sistem Manajemen Kendaraan
              <br className="hidden md:block" />
              <span className="text-[#013C9E] font-bold">Institut Teknologi Sepuluh Nopember</span>
            </p>
          </div>
        </motion.div>
      </motion.section>

      {/* STATS CARDS */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12 max-w-4xl mx-auto"
      >
        <motion.div 
          className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50 hover:shadow-3xl hover:-translate-y-2 transition-all duration-500 text-center"
          whileHover={{ y: -8 }}
        >
          <p className="text-4xl lg:text-5xl font-black text-[#013C9E] mb-2">{kendaraan.filter(k => k.status_ketersediaan === 'tersedia').length}</p>
          <p className="text-lg font-bold text-gray-700 uppercase tracking-wider">Tersedia</p>
        </motion.div>

        <motion.div 
          className="bg-white/90 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/50 hover:shadow-3xl hover:-translate-y-2 transition-all duration-500 text-center"
          whileHover={{ y: -8 }}
        >
          <p className="text-4xl lg:text-5xl font-black text-[#013C9E] mb-2">{kendaraan.filter(k => k.status_ketersediaan === 'dipinjam').length}</p>
          <p className="text-lg font-bold text-gray-700 uppercase tracking-wider">Dipinjam</p>
        </motion.div>

      </motion.div>

      {/* CHART */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 p-8 lg:p-12 mb-12 max-w-7xl mx-auto"
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-gradient-to-r from-[#013C9E] to-[#013880] rounded-2xl flex items-center justify-center shadow-xl">
            <span className="text-2xl">📊</span>
          </div>
          <div>
            <h2 className="text-3xl lg:text-4xl font-black text-[#0F172A]">Statistik Pemakaian</h2>
            <p className="text-lg text-[#475569] font-semibold">Tren bulanan kendaraan dinas ITS</p>
          </div>
        </div>
        <div className="h-[400px] lg:h-[500px] rounded-2xl overflow-hidden">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={pemakaianBulanan}>
              <defs>
                <linearGradient id="itsGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#013C9E" stopOpacity={0.3}/>
                  <stop offset="100%" stopColor="#013C9E" stopOpacity={0.05}/>
                </linearGradient>
                <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#013C9E"/>
                  <stop offset="100%" stopColor="#FFBD07"/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="5 5" stroke="#F1F5F9" vertical={false} />
              <XAxis dataKey="bulan" axisLine={false} tickLine={false} tick={{ fontSize: 14, fontWeight: 600, fill: '#64748B' }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 14, fill: '#64748B' }} />
              <Tooltip 
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E2E8F0',
                  borderRadius: '16px',
                  boxShadow: '0 20px 25px -5px rgba(0, 0,0, 0.1)'
                }}
              />
              <Line
                type="monotone"
                dataKey="pemakaian"
                stroke="url(#lineGradient)"
                strokeWidth={5}
                dot={{ fill: '#FFFFFF', strokeWidth: 3, stroke: '#013C9E', r: 7 }}
                activeDot={{ r: 10, fill: '#FFBD07', strokeWidth: 4, stroke: '#013C9E' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </motion.section>

      {/* FILTERS */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="flex flex-col lg:flex-row gap-6 mb-12 max-w-7xl mx-auto"
      >
        <div className="flex-1 flex items-center gap-4 p-6 lg:p-8 bg-white/90 backdrop-blur-xl rounded-3xl shadow-xl border border-[#013C9E]/20 hover:shadow-2xl hover:border-[#013C9E]/40 transition-all duration-300">
          <Search className="w-6 h-6 text-[#013C9E]" />
          <input
            className="flex-1 bg-transparent outline-none text-xl placeholder-[#64748B] font-semibold"
            placeholder="Cari nama kendaraan, nomor polisi, atau jenis..."
            value={search}
            onChange={(e: ChangeEvent<HTMLInputElement>) => setSearch(e.target.value)}
          />
        </div>

        <div className="p-6 lg:p-8 bg-gradient-to-r from-[#FFBD07]/10 to-[#FFBD07]/5 backdrop-blur-xl rounded-3xl shadow-xl border border-[#FFBD07]/30 hover:shadow-2xl hover:border-[#FFBD07]/50 transition-all duration-300">
          <select
            className="w-full lg:w-auto bg-transparent outline-none text-xl font-bold text-[#0F172A] cursor-pointer"
            value={status}
            onChange={(e: ChangeEvent<HTMLSelectElement>) => setStatus(e.target.value as FilterStatus)}
          >
            <option value="Semua">Semua Status</option>
            <option value="tersedia">Tersedia</option>
            <option value="dipinjam">Dipinjam</option>
          </select>
        </div>
      </motion.div>

      {/* TABLE */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.8 }}
        className="max-w-7xl mx-auto"
      >
        <div className="bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl overflow-hidden border border-white/70">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-[#013C9E] via-[#1E4AA5] to-[#013880]">
                <tr>
                  <th className="px-8 py-8 text-left text-white font-black text-xl uppercase tracking-wider">Nama Kendaraan</th>
                  <th className="px-8 py-8 text-white font-black text-xl uppercase tracking-wider hidden md:table-cell">Jenis</th>
                  <th className="px-8 py-8 text-white font-black text-xl uppercase tracking-wider hidden lg:table-cell">Nomor Polisi</th>
                  <th className="px-8 py-8 text-white font-black text-xl uppercase tracking-wider hidden xl:table-cell">Kapasitas</th>
                  <th className="px-8 py-8 text-white font-black text-xl uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]/50">
                {filtered.map((k, index) => (
                  <motion.tr 
                    key={k.id} 
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: index * 0.04 }}
                    className="hover:bg-[#FFF3CD]/30 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-b border-[#E2E8F0]/30"
                  >
                    <td className="px-8 py-8 font-black text-[#0F172A] text-2xl">{k.nama_kendaraan}</td>
                    <td className="px-8 py-8 text-[#475569] font-bold text-xl hidden md:table-cell">{k.jenis_kendaraan}</td>
                    <td className="px-8 py-8 font-mono text-[#013C9E] font-black text-xl hidden lg:table-cell">{k.nomor_polisi}</td>
                    <td className="px-8 py-8 text-center text-[#475569] font-bold text-xl hidden xl:table-cell">{k.kapasitas_penumpang} orang</td>
                    <td className="px-8 py-8">
                      <span className={`px-6 py-3 rounded-2xl text-lg font-black shadow-lg ${badgeClass(k.status_ketersediaan)}`}>
                        {k.status_ketersediaan === 'tersedia' && '✅'}
                        {k.status_ketersediaan === 'dipinjam' && '📤'}
                        {k.status_ketersediaan.charAt(0).toUpperCase() + k.status_ketersediaan.slice(1)}
                      </span>
                    </td>
                  </motion.tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-24">
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-[#64748B]"
                      >
                        <div className="text-8xl mb-8 animate-pulse">🔍</div>
                        <h3 className="text-4xl font-black mb-4 text-[#0F172A]">Data Tidak Ditemukan</h3>
                        <p className="text-2xl font-semibold">Coba ubah kata kunci pencarian atau filter status</p>
                      </motion.div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {filtered.length > 0 && (
            <div className="p-12 bg-gradient-to-r from-[#013C9E]/5 to-[#FFBD07]/5 border-t border-[#E2E8F0] text-center">
              <p className="text-2xl lg:text-3xl font-bold text-[#475569] mb-6">
                Menampilkan <span className="text-[#013C9E] text-3xl lg:text-4xl font-black">{filtered.length}</span>{' '}
                dari <span className="text-[#013C9E] text-3xl lg:text-4xl font-black">{kendaraan.length}</span> kendaraan
              </p>
              <motion.button
                onClick={fetchVehicles}
                className="inline-flex items-center gap-3 px-10 py-5 bg-gradient-to-r from-[#013C9E] to-[#013880] text-white font-black text-xl rounded-3xl shadow-2xl hover:shadow-3xl hover:-translate-y-2 transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCw className="w-6 h-6" />
                Refresh Data Terkini
              </motion.button>
            </div>
          )}
        </div>
      </motion.section>
    </main>
  )
}
