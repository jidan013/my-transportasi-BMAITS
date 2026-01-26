"use client"

import { useState, useCallback } from "react"
import { exportToExcel } from "./Export-Excel"
import {
  Button
} from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  IconDownload,
  IconFileReport,
  IconSearch,
  IconCar,
  IconClock,
  IconUsers,
  IconFilter,
  IconRefresh
} from "@tabler/icons-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Proper TypeScript types
type LaporanStatus = "disetujui" | "ditolak" | "menunggu"

type LaporanItem = {
  id: string
  peminjam: string
  unit: string
  kendaraan: string
  tanggalPinjam: Date
  tanggalKembali: Date
  status: LaporanStatus
  createdAt: Date
}

// Status filter type
type StatusFilter = LaporanStatus | "all"

// Status configuration
interface StatusConfig {
  variant: "default" | "secondary" | "destructive"
  className: string
  label: string
  icon: React.ReactNode
}

const statusConfig: Record<LaporanStatus, StatusConfig> = {
  disetujui: {
    variant: "default",
    className: "bg-green-500 hover:bg-green-600 border-green-500 text-white",
    label: "Disetujui",
    icon: "✅",
  },
  menunggu: {
    variant: "secondary",
    className: "bg-yellow-500 hover:bg-yellow-600 border-yellow-500 text-white",
    label: "Menunggu",
    icon: "⏳",
  },
  ditolak: {
    variant: "destructive",
    className: "bg-red-500 hover:bg-red-600 border-red-500 text-white",
    label: "Ditolak",
    icon: "❌",
  },
} as const

// Sample data with proper typing
const laporanData: LaporanItem[] = [
  {
    id: "PMJ-001",
    peminjam: "Budi Santoso",
    unit: "Departemen Elektro",
    kendaraan: "Toyota Hiace D-1234-AB",
    tanggalPinjam: new Date("2025-01-10"),
    tanggalKembali: new Date("2025-01-12"),
    status: "disetujui",
    createdAt: new Date("2025-01-08"),
  },
  {
    id: "PMJ-002",
    peminjam: "Siti Aminah",
    unit: "Fakultas Teknik",
    kendaraan: "Innova Reborn D-5678-CD",
    tanggalPinjam: new Date("2025-01-15"),
    tanggalKembali: new Date("2025-01-16"),
    status: "menunggu",
    createdAt: new Date("2025-01-14"),
  },
  {
    id: "PMJ-003",
    peminjam: "Ahmad Fauzi",
    unit: "Departemen Mesin",
    kendaraan: "Suzuki APV D-9012-EF",
    tanggalPinjam: new Date("2025-01-12"),
    tanggalKembali: new Date("2025-01-14"),
    status: "disetujui",
    createdAt: new Date("2025-01-10"),
  },
  {
    id: "PMJ-004",
    peminjam: "Rina Kartika",
    unit: "Biro Umum",
    kendaraan: "Toyota Avanza D-3456-GH",
    tanggalPinjam: new Date("2025-01-18"),
    tanggalKembali: new Date("2025-01-20"),
    status: "ditolak",
    createdAt: new Date("2025-01-16"),
  },
  {
    id: "PMJ-005",
    peminjam: "Eko Prasetyo",
    unit: "Departemen Sipil",
    kendaraan: "Isuzu Panther D-7890-IJ",
    tanggalPinjam: new Date("2025-01-20"),
    tanggalKembali: new Date("2025-01-22"),
    status: "menunggu",
    createdAt: new Date("2025-01-19"),
  },
]

interface Stats {
  total: number
  disetujui: number
  menunggu: number
  ditolak: number
}

export default function LaporanPage() {
  // State dengan proper typing
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")

  // Simplified date range - menggunakan string untuk menghindari DatePicker dependency
  const [dateFrom, setDateFrom] = useState<string>("")
  const [dateTo, setDateTo] = useState<string>("")

  // Memoized filtered data untuk performance
  const filteredData = useCallback(() => {
    return laporanData.filter((item) => {
      const matchesSearch = 
        item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.peminjam.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.unit.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.kendaraan.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === "all" || item.status === statusFilter
      
      const itemDate = item.tanggalPinjam.toISOString().split('T')[0]
      const matchesDate = 
        !dateFrom && !dateTo ||
        (dateFrom && dateTo && itemDate >= dateFrom && itemDate <= dateTo) ||
        (dateFrom && !dateTo && itemDate >= dateFrom) ||
        (!dateFrom && dateTo && itemDate <= dateTo)

      return matchesSearch && matchesStatus && matchesDate
    })
  }, [searchTerm, statusFilter, dateFrom, dateTo])

  // Memoized stats calculation
  const stats: Stats = useCallback(() => {
    const data = filteredData()
    return {
      total: data.length,
      disetujui: data.filter(d => d.status === "disetujui").length,
      menunggu: data.filter(d => d.status === "menunggu").length,
      ditolak: data.filter(d => d.status === "ditolak").length,
    }
  }, [filteredData])()

  const handleExport = useCallback(() => {
    exportToExcel(filteredData())
  }, [filteredData])

  const resetFilters = useCallback(() => {
    setSearchTerm("")
    setStatusFilter("all")
    setDateFrom("")
    setDateTo("")
  }, [])

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  return (
    <div className="container mx-auto py-8 px-4 lg:px-8 space-y-8 min-h-screen">
      {/* === PAGE HEADER === */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight flex items-center gap-3">
            <IconFileReport className="h-10 w-10 text-primary" />
            Laporan Peminjaman Kendaraan
          </h1>
          <p className="text-md text-muted-foreground max-w-md">
            Pantau dan kelola seluruh transaksi peminjaman kendaraan dinas dengan mudah dan cepat.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button onClick={handleExport} className="gap-2 shadow-lg hover:shadow-xl transition-all">
            <IconDownload className="h-4 w-4" />
            Export Excel
          </Button>
          <Button 
            variant="outline" 
            onClick={resetFilters}
            className="gap-2 border-2 hover:border-primary"
          >
            <IconRefresh className="h-4 w-4" />
            Reset Filter
          </Button>
        </div>
      </div>

      {/* === FILTERS === */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <IconFilter className="h-5 w-5" />
            Filter Data
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-muted-foreground">Cari</label>
            <div className="relative">
              <IconSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ID, Nama, Unit, Kendaraan..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-muted-foreground">Status</label>
            <Select value={statusFilter} onValueChange={(value: string) => setStatusFilter(value as StatusFilter)}>
              <SelectTrigger>
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="disetujui">Disetujui</SelectItem>
                <SelectItem value="menunggu">Menunggu</SelectItem>
                <SelectItem value="ditolak">Ditolak</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-muted-foreground">Dari</label>
            <Input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="h-10"
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-muted-foreground">Sampai</label>
            <Input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="h-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* === DASHBOARD METRICS === */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-primary/10 to-primary/5">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <IconFileReport className="h-4 w-4" />
              Total Peminjaman
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl lg:text-4xl font-bold text-foreground">
              {stats.total}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-green-500/10 to-green-500/5">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-sm font-medium text-green-600 font-semibold">
              <IconCar className="h-4 w-4" />
              Disetujui
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl lg:text-4xl font-bold text-green-600">
              {stats.disetujui}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-yellow-500/10 to-yellow-500/5">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-sm font-medium text-yellow-600 font-semibold">
              <IconClock className="h-4 w-4" />
              Menunggu
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl lg:text-4xl font-bold text-yellow-600">
              {stats.menunggu}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all bg-gradient-to-br from-destructive/10 to-destructive/5">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-sm font-medium text-destructive font-semibold">
              <IconUsers className="h-4 w-4" />
              Ditolak
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl lg:text-4xl font-bold text-destructive">
              {stats.ditolak}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* === DATA TABLE === */}
      <Card className="border-0 shadow-xl">
        <CardHeader className="pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                Daftar Peminjaman
                <Badge variant="secondary" className="text-xs">
                  {filteredData().length} dari {laporanData.length} data
                </Badge>
              </CardTitle>
              <CardDescription>
                Data lengkap peminjaman kendaraan dinas dengan status terkini
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto rounded-lg border">
            <Table>
              <TableHeader>
                <TableRow className="hover:bg-transparent border-b-2 border-border">
                  <TableHead className="w-16">ID</TableHead>
                  <TableHead>Peminjam</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Kendaraan</TableHead>
                  <TableHead className="text-center">Tgl Pinjam</TableHead>
                  <TableHead className="text-center">Tgl Kembali</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredData().length > 0 ? (
                  filteredData().map((item) => {
                    const status = statusConfig[item.status]
                    return (
                      <TableRow key={item.id} className="border-b hover:bg-accent/50 transition-colors">
                        <TableCell className="font-mono font-semibold text-primary">
                          {item.id}
                        </TableCell>
                        <TableCell className="font-medium">{item.peminjam}</TableCell>
                        <TableCell>{item.unit}</TableCell>
                        <TableCell className="font-medium">{item.kendaraan}</TableCell>
                        <TableCell className="text-center text-sm">
                          {formatDate(item.tanggalPinjam)}
                        </TableCell>
                        <TableCell className="text-center text-sm">
                          {formatDate(item.tanggalKembali)}
                        </TableCell>
                        <TableCell className="text-center">
                          <Badge
                            variant={status.variant}
                            className={`font-semibold ${status.className}`}
                          >
                            <span className="mr-1 text-xs">{status.icon}</span>
                            {status.label}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    )
                  })
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      Tidak ada data yang sesuai dengan filter
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
