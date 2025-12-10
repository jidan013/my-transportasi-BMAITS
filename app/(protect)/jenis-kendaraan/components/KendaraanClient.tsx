"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Search,
  PlusCircle,
  Pencil,
  Trash2,
  Car,
  Bus,
  Truck,
  Bike,
  Settings,
  CheckCircle2,
  AlertTriangle,
  LucideIcon,
} from "lucide-react"
import {
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts"

const kendaraanAwal : item[] = [
  {
    id: 1,
    icon: Bus,
    nama: "BUS MANDIRI",
    jenis: "Bus",
    warna: "Putih Biru",
    plat: "L 7808 AE",
    bbm: "Dexlite",
    status: "Aktif",
    kapasitas: "35 Orang",
  },
  {
    id: 2,
    icon: Bus,
    nama: "BUS BNI",
    jenis: "Bus",
    warna: "Putih Oren",
    plat: "L 7684 AP",
    bbm: "Dexlite",
    status: "Aktif",
    kapasitas: "28 Orang",
  },
  {
    id: 3,
    icon: Bus,
    nama: "BUS SPS",
    jenis: "Bus",
    warna: "Putih Biru",
    plat: "L 7151 AH",
    bbm: "Dexlite",
    status: "Aktif",
    kapasitas: "28 Orang",
  },
  {
    id: 4,
    icon: Bus,
    nama: "BUS IKOMA",
    jenis: "Bus",
    warna: "Putih Biru",
    plat: "L 7608 AP",
    bbm: "Dexlite",
    status: "Aktif",
    kapasitas: "27 Orang",
  },
  {
    id: 5,
    icon: Bus,
    nama: "HAICE",
    jenis: "Microbus",
    warna: "Hitam",
    plat: "L 7010 N",
    bbm: "Dexlite",
    status: "Aktif",
    kapasitas: "14 Orang",
  },
  {
    id: 6,
    icon: Car,
    nama: "HYUNDAI",
    jenis: "Kendaraan Dinas",
    warna: "Hitam",
    plat: "L 1843 OD",
    bbm: "Dexlite",
    status: "Aktif",
    kapasitas: "5 Orang",
  },
  {
    id: 7,
    icon: Car,
    nama: "SEDAN VIOS XSK ITS",
    jenis: "Sedan",
    warna: "Hitam",
    plat: "L 1069 OE",
    bbm: "Pertamak",
    status: "Aktif",
    kapasitas: "3 Orang",
  },
  {
    id: 8,
    icon: Car,
    nama: "SEDAN ALTIS XWR4",
    jenis: "Sedan",
    warna: "Hitam",
    plat: "L 1081 OE",
    bbm: "Pertamak",
    status: "Aktif",
    kapasitas: "3 Orang",
  },
  {
    id: 9,
    icon: Car,
    nama: "SEDAN ALTIS XWR3",
    jenis: "Sedan",
    warna: "Hitam",
    plat: "L 1080 OE",
    bbm: "Pertamak",
    status: "Aktif",
    kapasitas: "3 Orang",
  },
  {
    id: 10,
    icon: Car,
    nama: "INNOVA XDPP",
    jenis: "MPV",
    warna: "Hitam",
    plat: "L 1511 EP",
    bbm: "Dexlite",
    status: "Aktif",
    kapasitas: "5 Orang",
  },
  {
    id: 11,
    icon: Car,
    nama: "INNOVA XFTSPK",
    jenis: "MPV",
    warna: "Hitam",
    plat: "L 1852 AP",
    bbm: "Pertamak",
    status: "Aktif",
    kapasitas: "5 Orang",
  },
  {
    id: 12,
    icon: Car,
    nama: "INNOVA X ELEKTRO",
    jenis: "MPV",
    warna: "Abu-abu",
    plat: "L 1502 BP",
    bbm: "Pertamak",
    status: "Aktif",
    kapasitas: "5 Orang",
  },
  {
    id: 13,
    icon: Car,
    nama: "INNOVA XDRPM",
    jenis: "MPV",
    warna: "Hijau",
    plat: "L 1059 AP",
    bbm: "Pertamak",
    status: "Aktif",
    kapasitas: "5 Orang",
  },
  {
    id: 14,
    icon: Car,
    nama: "AVANZA XDKG",
    jenis: "MPV",
    warna: "Hitam",
    plat: "L 1031 CP",
    bbm: "Pertamak",
    status: "Aktif",
    kapasitas: "5 Orang",
  },
  {
    id: 15,
    icon: Car,
    nama: "AVANZA X INFORMATIKA",
    jenis: "MPV",
    warna: "Putih",
    plat: "L 6001 DP",
    bbm: "Pertamak",
    status: "Aktif",
    kapasitas: "5 Orang",
  },
  {
    id: 16,
    icon: Car,
    nama: "AVANZA XBURB",
    jenis: "MPV",
    warna: "Silver",
    plat: "L 1393 DL",
    bbm: "Pertamak",
    status: "Aktif",
    kapasitas: "5 Orang",
  },
  {
    id: 17,
    icon: Car,
    nama: "AVANZA XBK",
    jenis: "MPV",
    warna: "Silver",
    plat: "L 1068 OD",
    bbm: "Pertamak",
    status: "Aktif",
    kapasitas: "5 Orang",
  },
  {
    id: 18,
    icon: Car,
    nama: "AVANZA XBSP",
    jenis: "MPV",
    warna: "Silver",
    plat: "L 1171 OD",
    bbm: "Pertamak",
    status: "Aktif",
    kapasitas: "5 Orang",
  },
];


const pemakaianBulanan = [
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

interface item {
  id: number
  icon: LucideIcon
  nama: string
  jenis: string
  warna: string
  plat: string
  bbm: string
  status: string
  kapasitas: string
}

export default function KendaraanPage() {
  const [kendaraan, setKendaraan] = useState(kendaraanAwal)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("Semua")
  const [form, setForm] = useState({ nama: "", jenis: "", kapasitas: "", status: "Aktif", plat: "", warna: "", bbm: "" })
  const [editingId, setEditingId] = useState<number | null>(null)
  const [notification, setNotification] = useState<{ message: string; type: "success" | "warning" } | null>(null)

  const filteredData = kendaraan.filter(
    (k) =>
      (filterStatus === "Semua" || k.status === filterStatus) &&
      k.nama.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const showNotif = (message: string, type: "success" | "warning") => {
    setNotification({ message, type })
    setTimeout(() => setNotification(null), 2500)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId) {
      setKendaraan((prev) =>
        prev.map((k) => (k.id === editingId ? { ...k, ...form } : k))
      )
      showNotif("Data kendaraan berhasil diperbarui", "success")
      setEditingId(null)
    } else {
      setKendaraan((prev) => [
        ...prev,
        { id: prev.length + 1, ...form, icon: Car },
      ])
      showNotif("Kendaraan berhasil ditambahkan", "success")
    }
    setForm({ nama: "", jenis: "", kapasitas: "", status: "Aktif", plat: "", warna: "", bbm: "" })
  }

  const handleEdit = (item: item  ) => {
    setEditingId(item.id)
    setForm({
      nama: item.nama,
      jenis: item.jenis,
      kapasitas: item.kapasitas,
      status: item.status,
      plat: item.plat,
      warna: item.warna,
      bbm: item.bbm
    })
  }

  const handleDelete = (id: number) => {
    if (confirm("Apakah Anda yakin ingin menghapus kendaraan ini?")) {
      setKendaraan((prev) => prev.filter((k) => k.id !== id))
      showNotif("Kendaraan berhasil dihapus", "warning")
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      {/* HEADER */}
      <motion.header
        initial={{ opacity: 0, y: -25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="max-w-6xl mx-auto text-center mb-10"
      >
        <h1 className="text-[clamp(1.8rem,5vw,3rem)] font-extrabold text-gray-900 mb-2">
          🚗 Portal Kendaraan Dinas ITS
        </h1>
        <p className="text-gray-500 text-sm sm:text-base">
          Biro Manajemen Aset – Institut Teknologi Sepuluh Nopember (ITS)
        </p>
        <div className="h-[3px] w-24 bg-blue-600 mx-auto mt-4 rounded-full" />
      </motion.header>

      {/* CHART */}
      <section className="max-w-6xl mx-auto mb-10 bg-white/90 backdrop-blur-xl border border-gray-100 shadow-lg rounded-3xl p-5 sm:p-8">
        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
          📊 Statistik Pemakaian Kendaraan per Bulan
        </h2>
        <div className="w-full h-[250px] sm:h-[320px]">
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
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </section>

      {/* FILTER + SEARCH */}
      <section className="max-w-6xl mx-auto mb-6 flex flex-wrap gap-4 justify-between items-center">
        <div className="flex items-center gap-2 flex-1 min-w-[240px]">
          <Search className="w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Cari kendaraan..."
            className="border border-gray-300 rounded-lg px-3 py-2 flex-1 focus:ring-2 focus:ring-blue-400 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <label className="text-sm text-gray-600">Filter Status:</label>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
          >
            <option>Semua</option>
            <option>Aktif</option>
            <option>Siaga</option>
          </select>
        </div>
      </section>

      {/* ADMIN TABLE */}
      <section className="max-w-6xl mx-auto bg-white/90 backdrop-blur-xl border border-gray-100 shadow-2xl rounded-3xl p-5 sm:p-8">
        <div className="flex flex-wrap justify-between items-center gap-3 mb-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800">🗂️ Data Kendaraan</h2>
        </div>

        {/* FORM */}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6"
        >
          <input
            type="text"
            placeholder="Nama Kendaraan"
            value={form.nama}
            onChange={(e) => setForm({ ...form, nama: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />
          <input
            type="text"
            placeholder="Jenis"
            value={form.jenis}
            onChange={(e) => setForm({ ...form, jenis: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
            required
          />
          <input
            type="text"
            placeholder="Kapasitas"
            value={form.kapasitas}
            onChange={(e) => setForm({ ...form, kapasitas: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
          />
          <select
            value={form.status}
            onChange={(e) => setForm({ ...form, status: e.target.value })}
            className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-400 outline-none"
          >
            <option>Aktif</option>
            <option>Siaga</option>
          </select>

          <button
            type="submit"
            className="bg-blue-600 text-white rounded-lg px-4 py-2 hover:bg-blue-700 transition-all"
          >
            {editingId ? "💾 Simpan" : "➕ Tambah"}
          </button>
        </form>

        {/* TABLE */}
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full text-sm">
            <thead className="bg-blue-100 text-gray-700 font-semibold">
              <tr>
                <th className="border px-3 py-2 text-left">No</th>
                <th className="border px-3 py-2 text-left">Nama Kendaraan</th>
                <th className="border px-3 py-2 text-left">Jenis</th>
                <th className="border px-3 py-2 text-left">Kapasitas</th>
                <th className="border px-3 py-2 text-left">Status</th>
                <th className="border px-3 py-2 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredData.map((k, i) => (
                <tr key={k.id} className="hover:bg-gray-50 transition-colors">
                  <td className="border px-3 py-2">{i + 1}</td>
                  <td className="border px-3 py-2 font-medium">{k.nama}</td>
                  <td className="border px-3 py-2">{k.jenis}</td>
                  <td className="border px-3 py-2">{k.kapasitas}</td>
                  <td className="border px-3 py-2">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        k.status === "Aktif"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}
                    >
                      {k.status}
                    </span>
                  </td>
                  <td className="border px-3 py-2 text-center flex justify-center gap-3">
                    <button onClick={() => handleEdit(k)} className="text-blue-600 hover:text-blue-800">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDelete(k.id)} className="text-red-600 hover:text-red-800">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">
                    Tidak ada kendaraan ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      

      {/* NOTIFICATION */}
      <AnimatePresence>
        {notification && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed bottom-6 right-6 px-5 py-3 rounded-xl shadow-lg flex items-center gap-3 text-white z-50 ${
              notification.type === "success" ? "bg-green-600" : "bg-yellow-600"
            }`}
          >
            {notification.type === "success" ? <CheckCircle2 /> : <AlertTriangle />}
            {notification.message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER */}
      <motion.footer
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center text-gray-500 mt-16 text-xs sm:text-sm"
      >
        <div className="h-[2px] w-24 bg-blue-600 mx-auto mb-4 rounded-full" />
        <p>Biro Manajemen Aset – ITS</p>
        <p className="mt-1 text-gray-400 italic">Dokumen Internal • © 2025</p>
      </motion.footer>
    </main>
  )
}
