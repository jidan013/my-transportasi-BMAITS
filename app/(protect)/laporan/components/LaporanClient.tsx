"use client"

import { useState, useCallback, useEffect } from "react"
import { getAllBookings } from "@/lib/services/booking-service"
import type { Booking } from "@/types/booking"
import { Button } from "@/components/ui/button"
import {
  Card, CardContent, CardDescription,
  CardHeader, CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table, TableBody, TableCell, TableHead,
  TableHeader, TableRow,
} from "@/components/ui/table"
import {
  IconDownload, IconFileReport, IconSearch,
  IconCar, IconClock, IconUsers, IconFilter, IconRefresh
} from "@tabler/icons-react"
import { Input } from "@/components/ui/input"
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from "@/components/ui/select"

type LaporanStatus = "disetujui" | "ditolak" | "menunggu"
type StatusFilter = LaporanStatus | "all"

interface StatusConfig {
  variant: "default" | "secondary" | "destructive"
  className: string
  label: string
  icon: string
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
}

// ✅ Format tanggal ISO → 19 April 2026
const formatDate = (dateStr: string): string => {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
};

export default function LaporanPage() {
  const [data, setData] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all")
  const [dateFrom, setDateFrom] = useState<string>("")
  const [dateTo, setDateTo] = useState<string>("")

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getAllBookings();
      setData(result);
    } catch {
      setError("Gagal memuat data laporan.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredData = useCallback(() => {
    return data.filter((item) => {
      const matchesSearch =
        String(item.id).toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.nama?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.unit_kerja?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.vehicle?.nama_kendaraan?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || item.status_booking === statusFilter;

      // ✅ Ambil hanya bagian tanggal dari ISO string untuk filter
      const itemDate = item.tanggal_pinjam?.split("T")[0] ?? "";
      const matchesDate =
        (!dateFrom && !dateTo) ||
        (dateFrom && dateTo && itemDate >= dateFrom && itemDate <= dateTo) ||
        (dateFrom && !dateTo && itemDate >= dateFrom) ||
        (!dateFrom && dateTo && itemDate <= dateTo);

      return matchesSearch && matchesStatus && matchesDate;
    });
  }, [data, searchTerm, statusFilter, dateFrom, dateTo]);

  const stats = useCallback(() => {
    const d = filteredData();
    return {
      total: d.length,
      disetujui: d.filter(i => i.status_booking === "disetujui").length,
      menunggu: d.filter(i => i.status_booking === "menunggu").length,
      ditolak: d.filter(i => i.status_booking === "ditolak").length,
    };
  }, [filteredData])();

  const handleExportPDF = useCallback(() => {
    const rows = filteredData().map((item) => `
      <tr>
        <td>${item.id}</td>
        <td>${item.nama ?? "-"}</td>
        <td>${item.unit_kerja ?? "-"}</td>
        <td>${item.vehicle?.nama_kendaraan ?? "-"} (${item.vehicle?.nomor_polisi ?? "-"})</td>
        <td>${formatDate(item.tanggal_pinjam)}</td>
        <td>${formatDate(item.tanggal_kembali)}</td>
        <td>${item.keperluan ?? "-"}</td>
        <td>${item.status_booking}</td>
      </tr>
    `).join("");

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
                <th>ID</th><th>Nama</th><th>Unit Kerja</th><th>Kendaraan</th>
                <th>Tgl Pinjam</th><th>Tgl Kembali</th><th>Keperluan</th><th>Status</th>
              </tr>
            </thead>
            <tbody>${rows}</tbody>
          </table>
        </body>
      </html>
    `;

    const win = window.open("", "_blank");
    if (win) {
      win.document.write(html);
      win.document.close();
      win.print();
    }
  }, [filteredData]);

  const resetFilters = useCallback(() => {
    setSearchTerm("");
    setStatusFilter("all");
    setDateFrom("");
    setDateTo("");
  }, []);

  return (
    <div className="container mx-auto py-8 px-4 lg:px-8 space-y-8 min-h-screen">

      {/* ===== Header ===== */}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight flex items-center gap-3">
            <IconFileReport className="h-10 w-10 text-primary" />
            Laporan Peminjaman Kendaraan
          </h1>
          <p className="text-md text-muted-foreground max-w-md">
            Pantau dan kelola seluruh transaksi peminjaman kendaraan dinas.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={handleExportPDF}
            disabled={filteredData().length === 0}
            className="gap-2 shadow-lg hover:shadow-xl transition-all"
          >
            <IconDownload className="h-4 w-4" />
            Export PDF
          </Button>
          <Button variant="outline" onClick={resetFilters} className="gap-2 border-2 hover:border-primary">
            <IconRefresh className="h-4 w-4" />
            Reset Filter
          </Button>
          <Button variant="outline" onClick={fetchData} disabled={loading} className="gap-2">
            <IconRefresh className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </div>

      {/* ===== Error ===== */}
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm">
          {error}
        </div>
      )}

      {/* ===== Filter ===== */}
      <Card className="border-0 shadow-lg">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg">
            <IconFilter className="h-5 w-5" />
            Filter Data
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="space-y-1">
            <label className="text-sm font-medium text-muted-foreground">Cari</label>
            <div className="relative">
              <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as StatusFilter)}>
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
            <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium text-muted-foreground">Sampai</label>
            <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      {/* ===== Stats ===== */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
              <IconFileReport className="h-4 w-4" /> Total
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{stats.total}</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-green-600">
              <IconCar className="h-4 w-4" /> Disetujui
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-600">{stats.disetujui}</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-yellow-600">
              <IconClock className="h-4 w-4" /> Menunggu
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-yellow-600">{stats.menunggu}</div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg">
          <CardHeader className="pb-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-destructive">
              <IconUsers className="h-4 w-4" /> Ditolak
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-destructive">{stats.ditolak}</div>
          </CardContent>
        </Card>
      </div>

      {/* ===== Tabel ===== */}
      <Card className="border-0 shadow-xl">
        <CardHeader className="pb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <CardTitle className="flex items-center gap-2 text-xl">
                Daftar Peminjaman
                <Badge variant="secondary" className="text-xs">
                  {filteredData().length} dari {data.length} data
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
                <TableRow className="hover:bg-transparent border-b-2">
                  <TableHead className="w-16">ID</TableHead>
                  <TableHead>Nama</TableHead>
                  <TableHead>Unit Kerja</TableHead>
                  <TableHead>Kendaraan</TableHead>
                  <TableHead className="text-center">Tgl Pinjam</TableHead>
                  <TableHead className="text-center">Tgl Kembali</TableHead>
                  <TableHead>Keperluan</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                </TableRow>
              </TableHeader>

              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                      Memuat data...
                    </TableCell>
                  </TableRow>
                ) : filteredData().length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="h-24 text-center text-muted-foreground">
                      Tidak ada data yang sesuai filter
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredData().map((item) => {
                    const status = statusConfig[item.status_booking as LaporanStatus];
                    return (
                      <TableRow key={item.id} className="border-b hover:bg-accent/50 transition-colors">
                        <TableCell className="font-mono font-semibold text-primary">
                          #{item.id}
                        </TableCell>
                        <TableCell className="font-medium">{item.nama ?? "-"}</TableCell>
                        <TableCell>{item.unit_kerja ?? "-"}</TableCell>
                        <TableCell>
                          {item.vehicle?.nama_kendaraan ?? "-"}{" "}
                          <span className="text-muted-foreground text-xs">
                            ({item.vehicle?.nomor_polisi ?? "-"})
                          </span>
                        </TableCell>
                        {/* ✅ Format tanggal */}
                        <TableCell className="text-center text-sm">
                          {formatDate(item.tanggal_pinjam)}
                        </TableCell>
                        <TableCell className="text-center text-sm">
                          {formatDate(item.tanggal_kembali)}
                        </TableCell>
                        <TableCell className="max-w-[160px] truncate" title={item.keperluan}>
                          {item.keperluan ?? "-"}
                        </TableCell>
                        <TableCell className="text-center">
                          {status ? (
                            <Badge variant={status.variant} className={`font-semibold ${status.className}`}>
                              <span className="mr-1 text-xs">{status.icon}</span>
                              {status.label}
                            </Badge>
                          ) : (
                            <span className="text-xs text-muted-foreground">{item.status_booking}</span>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}