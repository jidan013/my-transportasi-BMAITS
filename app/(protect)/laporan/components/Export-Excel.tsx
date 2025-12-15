"use client"

import * as XLSX from "xlsx"
import { saveAs } from "file-saver"

type LaporanItem = {
  id: string
  peminjam: string
  unit: string
  kendaraan: string
  tanggalPinjam: Date
  tanggalKembali: Date
  status: string
}

export function exportToExcel(data: LaporanItem[]) {
  const worksheetData = data.map((item, index) => ({
    No: index + 1,
    "ID Peminjaman": item.id,
    Peminjam: item.peminjam,
    Unit: item.unit,
    Kendaraan: item.kendaraan,
    "Tanggal Pinjam": item.tanggalPinjam,
    "Tanggal Kembali": item.tanggalKembali,
    Status: item.status.toUpperCase(),
  }))

  const worksheet = XLSX.utils.json_to_sheet(worksheetData)
  const workbook = XLSX.utils.book_new()

  XLSX.utils.book_append_sheet(workbook, worksheet, "Laporan")

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  })

  const blob = new Blob([excelBuffer], {
    type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  })

  saveAs(blob, `laporan-peminjaman-${Date.now()}.xlsx`)
}
