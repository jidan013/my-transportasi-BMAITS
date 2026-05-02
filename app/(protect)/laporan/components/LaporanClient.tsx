"use client"

import { useState, useCallback, useEffect } from "react"
import { getAllBookings } from "@/lib/services/booking-service"
import type { Booking } from "@/types/booking"
import {
  IconDownload, IconFileReport, IconSearch,
  IconCar, IconClock, IconUsers, IconFilter,
  IconRefresh, IconChartBar, IconDotsVertical,
  IconTrendingUp, IconTrendingDown, IconRoute,
  IconCalendar, IconTableExport,
} from "@tabler/icons-react"

// ─── Types ────────────────────────────────────────────────────────────────────

type LaporanStatus = "disetujui" | "ditolak" | "menunggu"
type StatusFilter = LaporanStatus | "all"

// ─── Helpers ──────────────────────────────────────────────────────────────────

const formatDate = (dateStr: string): string => {
  if (!dateStr) return "-"
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric", month: "short", year: "numeric",
  })
}

const formatDateTime = (dateStr: string): string => {
  if (!dateStr) return "-"
  const d = new Date(dateStr)
  return d.toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
    + "\n" + d.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })
}

const MONTH_LABELS = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"]

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status: LaporanStatus }) {
  const cfg = {
    disetujui: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400",
    menunggu:  "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400",
    ditolak:   "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
  }
  const label = { disetujui: "Disetujui", menunggu: "Menunggu", ditolak: "Ditolak" }
  return (
    <span className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded-full ${cfg[status]}`}>
      {label[status]}
    </span>
  )
}

// ─── Mini Sparkline Bar Chart ─────────────────────────────────────────────────

function MonthlyVolumeChart({ bookings }: { bookings: Booking[] }) {
  const now = new Date()
  const year = now.getFullYear()

  // Count bookings per month for current year
  const monthly = Array.from({ length: 12 }, (_, m) => {
    return bookings.filter((b) => {
      const d = new Date(b.tanggal_pinjam)
      return d.getFullYear() === year && d.getMonth() === m
    }).length
  })

  const max = Math.max(...monthly, 1)

  // Approx predicted: slight variation
  const predicted = monthly.map((v, i) => (i <= now.getMonth() ? null : Math.round(v * 0.9 + 2)))

  return (
    <div className="relative w-full h-48 flex flex-col">
      {/* Legend */}
      <div className="flex items-center gap-4 mb-4 text-xs text-gray-500 dark:text-gray-400">
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-[#002D72] dark:bg-[#00AEEF] inline-block rounded" />
          Actual
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-3 h-0.5 bg-gray-300 dark:bg-gray-600 inline-block rounded" style={{ borderStyle: "dashed" }} />
          Predicted
        </span>
      </div>

      {/* Bar chart */}
      <div className="flex items-end gap-1.5 flex-1 pb-6 relative">
        {/* Y-axis guide lines */}
        <div className="absolute inset-0 flex flex-col justify-between pb-6 pointer-events-none">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="w-full border-t border-gray-100 dark:border-gray-800" />
          ))}
        </div>

        {monthly.map((val, i) => {
          const height = max > 0 ? (val / max) * 100 : 0
          const predHeight = predicted[i] != null ? ((predicted[i]! / max) * 100) : null
          return (
            <div key={i} className="flex-1 flex flex-col items-center gap-1 relative h-full justify-end">
              {predHeight != null && (
                <div
                  className="w-full rounded-sm bg-gray-200 dark:bg-gray-700 opacity-60"
                  style={{ height: `${predHeight}%` }}
                />
              )}
              {predHeight == null && (
                <div
                  className="w-full rounded-sm bg-[#002D72] dark:bg-[#00AEEF]"
                  style={{ height: `${height}%`, minHeight: val > 0 ? 3 : 0 }}
                />
              )}
            </div>
          )
        })}
      </div>

      {/* X labels */}
      <div className="flex gap-1.5 absolute bottom-0 left-0 right-0">
        {MONTH_LABELS.map((m) => (
          <div key={m} className="flex-1 text-center text-[9px] text-gray-400 font-medium">
            {m}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Most Used Vehicles ───────────────────────────────────────────────────────

function MostUsedVehicles({ bookings }: { bookings: Booking[] }) {
  const countMap: Record<string, { name: string; plate: string; count: number }> = {}

  bookings.forEach((b) => {
    if (!b.vehicle) return
    const key = b.vehicle.nomor_polisi
    if (!countMap[key]) {
      countMap[key] = { name: b.vehicle.nama_kendaraan, plate: key, count: 0 }
    }
    countMap[key].count++
  })

  const sorted = Object.values(countMap).sort((a, b) => b.count - a.count).slice(0, 5)
  const max = sorted[0]?.count || 1

  return (
    <div className="space-y-4">
      {sorted.length === 0 ? (
        <p className="text-sm text-gray-400 text-center py-6">Belum ada data kendaraan.</p>
      ) : (
        sorted.map((v) => (
          <div key={v.plate}>
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {v.name}{" "}
                <span className="text-gray-400 font-normal text-xs">({v.plate})</span>
              </span>
              <span className="text-gray-500 dark:text-gray-400 text-xs font-semibold">
                {v.count} Trips
              </span>
            </div>
            <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#002D72] dark:bg-[#00AEEF] rounded-full transition-all duration-700"
                style={{ width: `${(v.count / max) * 100}%` }}
              />
            </div>
          </div>
        ))
      )}
    </div>
  )
}

// ─── Fleet Distribution Donut ─────────────────────────────────────────────────

function FleetDistribution({ bookings }: { bookings: Booking[] }) {
  const unitMap: Record<string, number> = {}

  bookings.forEach((b) => {
    if (!b.unit_kerja) return
    unitMap[b.unit_kerja] = (unitMap[b.unit_kerja] || 0) + 1
  })

  const sorted = Object.entries(unitMap)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4)

  const total = sorted.reduce((s, [, c]) => s + c, 0) || 1

  const colors = ["#002D72", "#EF9F27", "#E24B4A", "#1D9E75"]
  const lightColors = ["#3B82F6", "#F59E0B", "#EF4444", "#10B981"]

  const r = 54
  const cx = 70
  const cy = 70
  const stroke = 18
  const circ = 2 * Math.PI * r

  const segments = sorted.map(([, count]) => count)

  const offsets = segments.map((_, i) =>
    segments.slice(0, i).reduce((sum, val) => sum + val, 0)
  )

  return (
    <div className="flex items-center gap-6">
      {/* Donut */}
      <div className="relative shrink-0">
        <svg width="140" height="140" viewBox="0 0 140 140">
          {/* background */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke="#e5e7eb"
            strokeWidth={stroke}
            className="dark:stroke-gray-700"
          />

          {/* segments */}
          {sorted.map(([, count], i) => {
            const dash = (count / total) * circ
            const offsetVal = offsets[i]

            return (
              <circle
                key={i}
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke={colors[i]}
                strokeWidth={stroke}
                strokeDasharray={`${dash} ${circ}`}
                strokeDashoffset={-(offsetVal / total) * circ}
                transform="rotate(-90 70 70)"
              />
            )
          })}
        </svg>

        {/* center */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold text-gray-900 dark:text-white">
            {bookings.length}
          </span>
          <span className="text-[10px] uppercase tracking-widest text-gray-400">
            Bookings
          </span>
        </div>
      </div>

      {/* legend */}
      <div className="flex-1 space-y-2.5">
        {sorted.map(([unit, count], i) => (
          <div key={unit} className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-gray-600 dark:text-gray-300 truncate max-w-[160px]">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ backgroundColor: lightColors[i] }}
              />
              <span className="truncate text-xs">{unit}</span>
            </span>
            <span className="font-bold text-gray-800 dark:text-gray-200 text-sm shrink-0 ml-2">
              {count}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Avatar initials ──────────────────────────────────────────────────────────

function Avatar({ name }: { name: string }) {
  const initials = name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("")
  const colors = [
    "bg-blue-500", "bg-purple-500", "bg-emerald-500",
    "bg-amber-500", "bg-red-500", "bg-indigo-500",
  ]
  const color = colors[name.charCodeAt(0) % colors.length]
  return (
    <div className={`w-8 h-8 rounded-full ${color} flex items-center justify-center text-white text-xs font-bold shrink-0`}>
      {initials}
    </div>
  )
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function LaporanPage() {
  const [data, setData] = useState<Booking[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [dateFrom, setDateFrom] = useState("")
  const [dateTo, setDateTo] = useState("")
  const [tripFilter, setTripFilter] = useState<"all" | "menunggu">("all")
  const [page, setPage] = useState(1)
  const PAGE_SIZE = 10

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await getAllBookings()
      setData(result)
    } catch {
      setError("Gagal memuat data laporan.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchData() }, [])

const filteredData = useCallback(() => {
  return data.filter((item) => {
    const keyword = searchTerm.toLowerCase()

    const matchesSearch =
      String(item.id ?? "").toLowerCase().includes(keyword) ||
      String(item.nama ?? "").toLowerCase().includes(keyword) ||
      String(item.nrp ?? "").toLowerCase().includes(keyword) || 
      String(item.unit_kerja ?? "").toLowerCase().includes(keyword) ||
      String(item.vehicle?.nama_kendaraan ?? "").toLowerCase().includes(keyword)

    const matchesStatus =
      statusFilter === "all" || item.status_booking === statusFilter

    const matchesTripFilter =
      tripFilter === "all" || item.status_booking === "menunggu"

    const itemDate = item.tanggal_pinjam?.split("T")[0] ?? ""

    const matchesDate =
      (!dateFrom && !dateTo) ||
      (dateFrom && dateTo && itemDate >= dateFrom && itemDate <= dateTo) ||
      (dateFrom && !dateTo && itemDate >= dateFrom) ||
      (!dateFrom && dateTo && itemDate <= dateTo)

    return matchesSearch && matchesStatus && matchesDate && matchesTripFilter
  })
}, [data, searchTerm, statusFilter, dateFrom, dateTo, tripFilter])

  const stats = useCallback(() => {
    return {
      total: data.length,
      disetujui: data.filter((i) => i.status_booking === "disetujui").length,
      menunggu: data.filter((i) => i.status_booking === "menunggu").length,
      ditolak: data.filter((i) => i.status_booking === "ditolak").length,
    }
  }, [data])()

  const handleExportPDF = useCallback(() => {
    const rows = filteredData().map((item) => `
      <tr>
        <td>${item.id}</td>
        <td>${item.nama ?? "-"}</td>
        <td>${item.nrp ?? "-"}</td>
        <td>${item.unit_kerja ?? "-"}</td>
        <td>${item.vehicle?.nama_kendaraan ?? "-"} (${item.vehicle?.nomor_polisi ?? "-"})</td>
        <td>${formatDate(item.tanggal_pinjam)}</td>
        <td>${formatDate(item.tanggal_kembali)}</td>
        <td>${item.keperluan ?? "-"}</td>
        <td>${item.status_booking}</td>
      </tr>
    `).join("")

    const html = `
      <html>
        <head>
          <title>Laporan Peminjaman Kendaraan</title>
          <style>
            body { font-family: Arial, sans-serif; padding: 24px; font-size: 12px; }
            h1 { font-size: 18px; margin-bottom: 4px; }
            p { color: #666; margin-bottom: 16px; }
            table { width: 100%; border-collapse: collapse; }
            th { background: #f1f5f9; text-align: left; padding: 8px; border: 1px solid #e2e8f0; }
            td { padding: 8px; border: 1px solid #e2e8f0; }
            tr:nth-child(even) { background: #f8fafc; }
          </style>
        </head>
        <body>
          <h1>Laporan Peminjaman Kendaraan</h1>
          <p>Dicetak pada: ${formatDate(new Date().toISOString())}</p>
          <table>
            <thead>
              <tr>
                <th>ID</th><th>Nama</th><th>NRP</th><th>Unit Kerja</th><th>Kendaraan</th>
                <th>Tgl Pinjam</th><th>Tgl Kembali</th><th>Keperluan</th><th>Status</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </body>
      </html>
    `
    const win = window.open("", "_blank")
    if (win) { win.document.write(html); win.document.close(); win.print() }
  }, [filteredData])

  const resetFilters = useCallback(() => {
    setSearchTerm(""); setStatusFilter("all"); setDateFrom(""); setDateTo(""); setPage(1)
  }, [])

  const paged = filteredData()
  const totalPages = Math.max(1, Math.ceil(paged.length / PAGE_SIZE))
  const pageData = paged.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)

  // ────────────────────────────────────────────────────────────────────────────

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-950 px-8 py-7 space-y-6">

      {/* ── Breadcrumb ───────────────────────────────────────────────────── */}
      <div className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-wider font-semibold">
        <span>Admin</span>
        <span>›</span>
        <span className="text-[#002D72] dark:text-[#00AEEF]">Analytics</span>
      </div>

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Laporan Peminjaman Kendaraan
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
            Real-time usage metrics and historical operational logs.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportPDF}
            disabled={filteredData().length === 0}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 shadow-sm transition-all disabled:opacity-50"
          >
            <IconDownload className="w-4 h-4" />
            Download PDF
          </button>
          <button
            onClick={handleExportPDF}
            disabled={filteredData().length === 0}
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 shadow-sm transition-all disabled:opacity-50"
          >
            <IconTableExport className="w-4 h-4" />
            Export Excel
          </button>
        </div>
      </div>

      {/* ── Error ─────────────────────────────────────────────────────────── */}
      {error && (
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl text-red-700 dark:text-red-400 text-sm flex justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="font-bold text-red-400 hover:text-red-600">✕</button>
        </div>
      )}

      {/* ── Top Row: Stat Cards + Monthly Chart ───────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

        {/* Stat cards 2×2 */}
        <div className="grid grid-cols-2 gap-4">
          {/* Total Booking */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-wider font-semibold mb-3">
              <IconFileReport className="w-3.5 h-3.5" />
              Total Booking
            </div>
            <div className="flex items-end justify-between">
              <span className="text-4xl font-bold text-gray-900 dark:text-white">
                {loading ? "—" : stats.total}
              </span>
              <span className="flex items-center gap-0.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 mb-1">
                <IconTrendingUp className="w-3.5 h-3.5" /> +12%
              </span>
            </div>
          </div>

          {/* Total Kendaraan */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-wider font-semibold mb-3">
              <IconRoute className="w-3.5 h-3.5" />
              Disetujui
            </div>
            <div className="flex items-end justify-between">
              <span className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
                {loading ? "—" : stats.disetujui}
              </span>
              <span className="flex items-center gap-0.5 text-xs font-semibold text-red-500 mb-1">
                <IconTrendingDown className="w-3.5 h-3.5" /> -2%
              </span>
            </div>
          </div>

          {/* Active Drivers */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-wider font-semibold mb-3">
              <IconUsers className="w-3.5 h-3.5" />
              Menunggu
            </div>
            <div className="flex items-end justify-between">
              <span className="text-4xl font-bold text-amber-500">
                {loading ? "—" : stats.menunggu}
              </span>
              <span className="text-xs font-semibold text-gray-400 mb-1">pending</span>
            </div>
          </div>

          {/* Booking Rate */}
          <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 text-xs text-gray-400 uppercase tracking-wider font-semibold mb-3">
              <IconCalendar className="w-3.5 h-3.5" />
              Ditolak
            </div>
            <div className="flex items-end justify-between">
              <span className="text-4xl font-bold text-red-500">
                {loading ? "—" : stats.ditolak}
              </span>
              <span className="text-xs font-semibold text-gray-400 mb-1">rejected</span>
            </div>
          </div>
        </div>

        {/* Monthly booking volume chart */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">
              Monthly Booking Volume
            </h2>
          </div>
          {loading ? (
            <div className="h-48 flex items-center justify-center">
              <IconRefresh className="w-6 h-6 animate-spin text-gray-300" />
            </div>
          ) : (
            <MonthlyVolumeChart bookings={data} />
          )}
        </div>
      </div>

      {/* ── Middle Row: Most Used + Fleet Distribution ─────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Most Used Vehicles */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">
              Most Used Vehicles
            </h2>
            <button className="text-xs font-semibold text-[#002D72] dark:text-[#00AEEF] hover:underline">
              View All
            </button>
          </div>
          {loading ? (
            <div className="space-y-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse space-y-1.5">
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                  <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full" />
                </div>
              ))}
            </div>
          ) : (
            <MostUsedVehicles bookings={data} />
          )}
        </div>

        {/* Fleet Distribution */}
        <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-sm font-bold text-gray-900 dark:text-white">
              Fleet Distribution
            </h2>
            <button className="flex items-center gap-1 text-xs font-semibold text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 px-2.5 py-1 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all">
              By Unit <span className="text-[10px]">▾</span>
            </button>
          </div>
          {loading ? (
            <div className="flex items-center gap-6 animate-pulse">
              <div className="w-36 h-36 rounded-full bg-gray-200 dark:bg-gray-700 shrink-0" />
              <div className="flex-1 space-y-3">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="h-3 bg-gray-200 dark:bg-gray-700 rounded" />
                ))}
              </div>
            </div>
          ) : (
            <FleetDistribution bookings={data} />
          )}
        </div>
      </div>

      {/* ── Historical Trip Logs ───────────────────────────────────────────── */}
      <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-2xl shadow-sm overflow-hidden">

        {/* Section header */}
        <div className="px-6 py-5 border-b border-gray-100 dark:border-gray-800">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-base font-bold text-gray-900 dark:text-white">
                Historical Trip Logs
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Audit trail of all vehicle movements
              </p>
            </div>

            {/* Filter tabs + search */}
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-xl p-1 text-xs font-semibold">
                <button
                  onClick={() => { setTripFilter("all"); setPage(1) }}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    tripFilter === "all"
                      ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
                  }`}
                >
                  All Trips
                </button>
                <button
                  onClick={() => { setTripFilter("menunggu"); setPage(1) }}
                  className={`px-3 py-1.5 rounded-lg transition-all ${
                    tripFilter === "menunggu"
                      ? "bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm"
                      : "text-gray-500 dark:text-gray-400 hover:text-gray-700"
                  }`}
                >
                  Under Review
                </button>
              </div>

              {/* Filters popover (inline) */}
              <div className="flex items-center gap-2">
                <div className="relative">
                  <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setPage(1) }}
                    placeholder="Cari..."
                    className="pl-8 pr-3 py-2 text-xs border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-[#002D72]/20 dark:focus:ring-[#00AEEF]/20 w-40"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(e) => { setStatusFilter(e.target.value as StatusFilter); setPage(1) }}
                  className="px-3 py-2 text-xs border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 outline-none focus:ring-2 focus:ring-[#002D72]/20"
                >
                  <option value="all">Semua Status</option>
                  <option value="disetujui">Disetujui</option>
                  <option value="menunggu">Menunggu</option>
                  <option value="ditolak">Ditolak</option>
                </select>

                <button
                  onClick={() => { resetFilters(); setTripFilter("all") }}
                  className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                  title="Reset filter"
                >
                  <IconFilter className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={fetchData}
                  disabled={loading}
                  className="p-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all disabled:opacity-50"
                  title="Refresh"
                >
                  <IconRefresh className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 dark:bg-gray-800/50 text-[11px] font-semibold text-gray-400 dark:text-gray-500 uppercase tracking-wider">
                <th className="text-left px-6 py-3">Date & Time</th>
                <th className="text-left px-6 py-3">Requester</th>
                <th className="text-left px-6 py-3">Vehicle Info</th>
                <th className="text-left px-6 py-3">Destination</th>
                <th className="text-left px-6 py-3">Status</th>
                <th className="text-left px-6 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
              {loading ? (
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    {[...Array(6)].map((__, j) => (
                      <td key={j} className="px-6 py-4">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
                      </td>
                    ))}
                  </tr>
                ))
              ) : pageData.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-14 text-center text-sm text-gray-400">
                    Tidak ada data yang sesuai filter.
                  </td>
                </tr>
              ) : (
                pageData.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/40 transition-colors">

                    {/* Date */}
                    <td className="px-6 py-4">
                      <p className="font-semibold text-[#002D72] dark:text-[#00AEEF] text-xs">
                        {new Date(item.tanggal_pinjam).toLocaleDateString("id-ID", {
                          day: "numeric", month: "short", year: "numeric",
                        })}
                      </p>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        {new Date(item.tanggal_pinjam).toLocaleTimeString("id-ID", {
                          hour: "2-digit", minute: "2-digit",
                        })}
                      </p>
                    </td>

                    {/* Requester */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2.5">
                        <Avatar name={item.nama ?? "?"} />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white text-xs">
                            {item.nama ?? "-"}
                          </p>
                          <p className="text-[11px] text-gray-400 truncate max-w-[120px]">
                            {item.unit_kerja ?? "-"}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Vehicle */}
                    <td className="px-6 py-4">
                      {item.vehicle ? (
                        <>
                          <p className="font-medium text-gray-900 dark:text-white text-xs">
                            {item.vehicle.nama_kendaraan}
                          </p>
                          <p className="text-[11px] text-gray-400">
                            {item.vehicle.nomor_polisi}
                          </p>
                        </>
                      ) : (
                        <span className="text-gray-400 text-xs">—</span>
                      )}
                    </td>

                    {/* Destination */}
                    <td className="px-6 py-4 max-w-[160px]">
                      <p className="text-xs text-gray-700 dark:text-gray-300 truncate" title={item.keperluan}>
                        {item.keperluan ?? "-"}
                      </p>
                    </td>

                    {/* Status */}
                    <td className="px-6 py-4">
                      <StatusBadge status={item.status_booking as LaporanStatus} />
                    </td>

                    {/* Action */}
                    <td className="px-6 py-4">
                      <button className="p-1.5 rounded-lg text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all">
                        <IconDotsVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!loading && paged.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
            <p className="text-xs text-gray-400">
              Showing {Math.min((page - 1) * PAGE_SIZE + 1, paged.length)}–
              {Math.min(page * PAGE_SIZE, paged.length)} of {paged.length} trips
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 transition-all text-xs"
              >
                ‹
              </button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const pg = i + 1
                return (
                  <button
                    key={pg}
                    onClick={() => setPage(pg)}
                    className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-semibold transition-all ${
                      page === pg
                        ? "bg-[#002D72] dark:bg-[#00AEEF] text-white"
                        : "border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    {pg}
                  </button>
                )
              })}
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 disabled:opacity-40 transition-all text-xs"
              >
                ›
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}