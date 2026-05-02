"use client"

import * as React from "react"
import { motion } from "framer-motion"
import {
  FileText,
  ClipboardList,
  Phone,
  Shield,
  UploadCloud,
  CheckCircle2,
  LayoutGrid,
  List,
  TrendingUp,
  Clock,
  AlertTriangle,
  Download,
  FileCheck2,
  FileSpreadsheet,
  FileBadge,
  Search,
} from "lucide-react"

// ─── Types ───────────────────────────────────────────────────────────────────

type StatusType = "AKTIF" | "REVIEW" | "DIARSIPKAN"

interface SopDocument {
  id: number
  name: string
  description: string
  lastUpdated: string
  fileSize: string
  status: StatusType
  icon: React.ReactNode
}

interface Category {
  label: string
  count: number
  icon: React.ReactNode
  active?: boolean
}

// ─── Data ────────────────────────────────────────────────────────────────────

const categories: Category[] = [
  {
    label: "Standard Operating Procedures",
    count: 10,
    icon: <FileText className="w-4 h-4 text-amber-500" />,
    active: true,
  },
  {
    label: "Protokol Pemeliharaan",
    count: 6,
    icon: <ClipboardList className="w-4 h-4 text-gray-400" />,
  },
  {
    label: "Kontak Darurat",
    count: 4,
    icon: <Phone className="w-4 h-4 text-gray-400" />,
  },
  {
    label: "Legal & Asuransi",
    count: 5,
    icon: <Shield className="w-4 h-4 text-gray-400" />,
  },
]

const documents: SopDocument[] = [
  {
    id: 1,
    name: "SOP_Peminjaman_Kendaraan_Dinas_v2",
    description: "Prosedur peminjaman kendaraan dinas ITS – pengajuan s/d pengembalian",
    lastUpdated: "10 Apr 2025",
    fileSize: "1.8 MB",
    status: "AKTIF",
    icon: <FileBadge className="w-5 h-5 text-red-500" />,
  },
  {
    id: 2,
    name: "SOP_Penugasan_Sopir_Kendaraan",
    description: "Mekanisme penugasan sopir & distribusi Surat Perintah Jalan",
    lastUpdated: "2 Mar 2025",
    fileSize: "980 KB",
    status: "AKTIF",
    icon: <FileBadge className="w-5 h-5 text-red-500" />,
  },
  {
    id: 3,
    name: "SOP_Pemeriksaan_Kelayakan_Kendaraan",
    description: "Checklist kelayakan teknis sebelum & sesudah penggunaan kendaraan",
    lastUpdated: "15 Feb 2025",
    fileSize: "1.2 MB",
    status: "REVIEW",
    icon: <FileBadge className="w-5 h-5 text-red-500" />,
  },
  {
    id: 4,
    name: "Template_Surat_Permohonan_Kendaraan",
    description: "Template surat permohonan peminjaman sesuai Tata Naskah ITS",
    lastUpdated: "20 Jan 2025",
    fileSize: "320 KB",
    status: "AKTIF",
    icon: <FileSpreadsheet className="w-5 h-5 text-blue-500" />,
  },
  {
    id: 5,
    name: "Template_Surat_Perintah_Jalan",
    description: "Formulir SPJ kendaraan dinas – Biro Manajemen Aset ITS",
    lastUpdated: "20 Jan 2025",
    fileSize: "280 KB",
    status: "AKTIF",
    icon: <FileSpreadsheet className="w-5 h-5 text-blue-500" />,
  },
  {
    id: 6,
    name: "SOP_Pelaporan_Penggunaan_Kendaraan",
    description: "Prosedur pembuatan laporan kondisi, BBM, dan kilometer kendaraan",
    lastUpdated: "5 Nov 2024",
    fileSize: "760 KB",
    status: "DIARSIPKAN",
    icon: <FileCheck2 className="w-5 h-5 text-red-500" />,
  },
]

const statusStyle: Record<StatusType, string> = {
  AKTIF: "bg-green-100 text-green-700",
  REVIEW: "bg-yellow-100 text-yellow-700",
  DIARSIPKAN: "bg-gray-200 text-gray-500",
}

// ─── Storage Bar ─────────────────────────────────────────────────────────────

function StorageBar() {
  const used = 4.2
  const total = 10
  const pct = Math.round((used / total) * 100)
  return (
    <div className="mt-4 bg-white border border-gray-200 rounded-xl p-4">
      <p className="text-sm font-semibold text-gray-700 mb-3">Penggunaan Penyimpanan</p>
      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-600 rounded-full transition-all duration-700"
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="text-xs text-gray-500 mt-2">
        {used} GB dari {total} GB penyimpanan institusi digunakan
      </p>
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function SopContentPage() {
  const [view, setView] = React.useState<"grid" | "list">("list")
  const [query, setQuery] = React.useState("")
  const [activeCategory, setActiveCategory] = React.useState(0)

  const filtered = documents.filter(
    (d) =>
      d.name.toLowerCase().includes(query.toLowerCase()) ||
      d.description.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* ── TOP SEARCH BAR ── */}
      <div className="bg-white border-b border-gray-200 px-8 py-3 flex items-center justify-between">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Cari SOP, manual, atau protokol..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-sm bg-gray-100 rounded-lg border border-transparent focus:outline-none focus:border-blue-300 focus:bg-white transition"
          />
        </div>
        <p className="text-sm text-gray-400">24 Okt 2023 · 09:41</p>
      </div>

      <div className="px-8 py-6 max-w-screen-xl mx-auto">

        {/* ── HERO BANNER ── */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative rounded-2xl overflow-hidden mb-8"
          style={{ background: "linear-gradient(135deg, #1a3a6b 0%, #2d5fa8 60%, #3b7dd8 100%)" }}
        >
          {/* decorative circles */}
          <div className="absolute -right-12 -top-12 w-64 h-64 rounded-full bg-white/5" />
          <div className="absolute right-24 bottom-0 w-40 h-40 rounded-full bg-white/5" />

          <div className="relative z-10 px-10 py-10">
            <h1 className="text-3xl font-bold text-white mb-2">
              Prosedur Operasional Standar Kendaraan
            </h1>
            <p className="text-blue-200 text-sm max-w-xl mb-6">
              Akses protokol armada institusi ITS, standar pemeliharaan, dan panduan pengelolaan
              kendaraan dinas secara terpusat.
            </p>
            <div className="flex gap-3">
              <button className="flex items-center gap-2 bg-amber-400 hover:bg-amber-500 text-gray-900 font-semibold text-sm px-5 py-2.5 rounded-lg transition">
                <UploadCloud className="w-4 h-4" />
                Perbarui Protokol
              </button>
              <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold text-sm px-5 py-2.5 rounded-lg border border-white/20 transition">
                <CheckCircle2 className="w-4 h-4" />
                Status Kepatuhan
              </button>
            </div>
          </div>
        </motion.div>

        {/* ── BODY: sidebar categories + document list ── */}
        <div className="flex gap-6">

          {/* LEFT: Categories */}
          <motion.aside
            initial={{ opacity: 0, x: -16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="w-56 flex-shrink-0"
          >
            <p className="text-base font-bold text-gray-800 mb-3">Kategori</p>
            <div className="flex flex-col gap-1">
              {categories.map((cat, i) => (
                <button
                  key={i}
                  onClick={() => setActiveCategory(i)}
                  className={`flex items-center justify-between w-full px-3 py-2.5 rounded-xl text-left transition text-sm ${
                    activeCategory === i
                      ? "bg-blue-50 border border-blue-200"
                      : "hover:bg-gray-100 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {cat.icon}
                    <span
                      className={`leading-snug ${
                        activeCategory === i
                          ? "font-semibold text-blue-700"
                          : "text-gray-600"
                      }`}
                    >
                      {cat.label}
                    </span>
                  </div>
                  <span
                    className={`text-xs font-semibold ml-1 ${
                      activeCategory === i ? "text-blue-600" : "text-gray-400"
                    }`}
                  >
                    {cat.count.toString().padStart(2, "0")}
                  </span>
                </button>
              ))}
            </div>

            <StorageBar />
          </motion.aside>

          {/* RIGHT: Document List */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="flex-1 min-w-0"
          >
            {/* sub-header */}
            <div className="flex items-end justify-between mb-4">
              <div>
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
                  Menelusuri
                </p>
                <h2 className="text-xl font-bold text-gray-800">
                  {categories[activeCategory].label}
                </h2>
              </div>
              <div className="flex gap-1">
                <button
                  onClick={() => setView("grid")}
                  className={`p-2 rounded-lg border transition ${
                    view === "grid"
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "border-gray-200 text-gray-400 hover:bg-gray-100"
                  }`}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setView("list")}
                  className={`p-2 rounded-lg border transition ${
                    view === "list"
                      ? "bg-blue-600 border-blue-600 text-white"
                      : "border-gray-200 text-gray-400 hover:bg-gray-100"
                  }`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* table/list */}
            <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden">
              {view === "list" ? (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left px-5 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        Nama Dokumen
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">
                        Terakhir Diperbarui
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        Ukuran
                      </th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        Status
                      </th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filtered.map((doc) => (
                      <tr key={doc.id} className="hover:bg-gray-50 transition-colors group">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex-shrink-0">{doc.icon}</div>
                            <div>
                              <p className="font-semibold text-blue-700 group-hover:underline cursor-pointer leading-snug">
                                {doc.name}
                              </p>
                              <p className="text-xs text-gray-400 mt-0.5">{doc.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 text-gray-500 whitespace-nowrap">
                          {doc.lastUpdated}
                        </td>
                        <td className="px-4 py-4 text-gray-500">{doc.fileSize}</td>
                        <td className="px-4 py-4">
                          <span
                            className={`text-xs font-semibold px-2.5 py-1 rounded-full ${statusStyle[doc.status]}`}
                          >
                            {doc.status}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <button className="opacity-0 group-hover:opacity-100 transition p-1.5 rounded-lg hover:bg-gray-100">
                            <Download className="w-4 h-4 text-gray-500" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="grid grid-cols-2 gap-4 p-5">
                  {filtered.map((doc) => (
                    <div
                      key={doc.id}
                      className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:bg-blue-50/30 transition cursor-pointer"
                    >
                      <div className="flex items-start gap-3">
                        {doc.icon}
                        <div className="min-w-0">
                          <p className="font-semibold text-blue-700 text-sm leading-snug truncate">
                            {doc.name}
                          </p>
                          <p className="text-xs text-gray-400 mt-1 line-clamp-2">
                            {doc.description}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-3">
                        <span
                          className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusStyle[doc.status]}`}
                        >
                          {doc.status}
                        </span>
                        <span className="text-xs text-gray-400">{doc.lastUpdated}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* ── BOTTOM CARDS ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="grid grid-cols-3 gap-4 mt-6"
        >
          {/* Latest Update */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" /> Pembaruan Terbaru
            </p>
            <p className="font-bold text-gray-800 text-sm mb-0.5">
              SOP Peminjaman Kendaraan v2
            </p>
            <p className="text-xs text-gray-500 mb-4">Diperbarui oleh Budi Santoso</p>
            <button className="text-sm font-semibold text-blue-600 hover:underline flex items-center gap-1">
              Lihat Perubahan →
            </button>
          </div>

          {/* Most Downloaded */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" /> Paling Banyak Diunduh
            </p>
            <p className="font-bold text-gray-800 text-sm mb-0.5">
              Template Surat Perintah Jalan
            </p>
            <p className="text-xs text-gray-500 mb-4">87 unduhan minggu ini</p>
            <button className="text-sm font-semibold text-blue-600 hover:underline flex items-center gap-1">
              Ambil Salinan ↓
            </button>
          </div>

          {/* Audit Required */}
          <div className="bg-[#1a3a6b] rounded-2xl p-5 text-white relative overflow-hidden">
            <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/10 flex items-center justify-center text-white text-lg font-bold cursor-pointer hover:bg-white/20 transition">
              +
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-9 h-9 rounded-xl bg-amber-400 flex items-center justify-center flex-shrink-0">
                <AlertTriangle className="w-5 h-5 text-gray-900" />
              </div>
              <div>
                <p className="text-xs text-blue-300 uppercase font-semibold tracking-wide">
                  Sistem
                </p>
                <p className="font-bold text-white text-sm">Audit Diperlukan</p>
              </div>
            </div>
            <p className="text-sm text-blue-200 mb-4">3 protokol kedaluwarsa dalam 15 hari</p>
            <button className="w-full bg-amber-400 hover:bg-amber-500 text-gray-900 font-bold text-sm py-2 rounded-lg transition">
              Mulai Tinjauan
            </button>
          </div>
        </motion.div>

      </div>
    </div>
  )
}