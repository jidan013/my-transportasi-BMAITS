"use client";

import { useState } from "react";
import BorrowCard from "./BorrowCard";
import { IconSearch } from "@tabler/icons-react";
import type { BorrowItem } from "@/types/times";

/* ======================
   MOCK DATA
====================== */

const mockHistory: BorrowItem[] = [
  {
    id: 1,
    borrower: "Andi Wijaya",
    vehicle: "Toyota Avanza",
    plate: "B 1234 XYZ",
    borrowDate: "2025-10-12",
    returnDate: "2025-10-13",
    status: "terbit", 
    timeline: [
      { key: "diajukan", label: "Diajukan", time: "12 Okt 2025" },
      { key: "ditinjau", label: "Ditinjau", time: "12 Okt 2025" },
      { key: "disetujui", label: "Disetujui", time: "12 Okt 2025" },
      { key: "diterbitkan", label: "Surat Diterbitkan", time: "12 Okt 2025" },
    ],
  },
  {
    id: 2,
    borrower: "Siti Rahma",
    vehicle: "Hiace",
    plate: "L 4321 ABC",
    borrowDate: "2025-09-28",
    returnDate: "2025-09-29",
    status: "rejected",
    timeline: [
      { key: "diajukan", label: "Diajukan", time: "28 Sep 2025" },
      { key: "ditinjau", label: "Ditinjau", time: "28 Sep 2025" },
    ],
  },
  {
    id: 3,
    borrower: "Budi Santoso",
    vehicle: "Toyota Avanza",
    plate: "N 9988 DD",
    borrowDate: "2025-10-05",
    returnDate: "2025-10-10",
    status: "rejected",
    timeline: [
      { key: "diajukan", label: "Diajukan", time: "5 Okt 2025" },
      { key: "ditinjau", label: "Ditinjau", time: "6 Okt 2025" },
    ],
  },
  {
    id: 4,
    borrower: "Rina Putri",
    vehicle: "Toyota Avanza",
    plate: "B 7744 TT",
    borrowDate: "2025-11-01",
    returnDate: "2025-11-03",
    status: "pending",
    timeline: [{ key: "diajukan", label: "Diajukan", time: "1 Nov 2025" }],
  },
];



/* ======================
   COMPONENT
====================== */

export default function BorrowStat() {
  const [search, setSearch] = useState("");

  const filtered = mockHistory.filter(
    (item) =>
      item.vehicle.toLowerCase().includes(search.toLowerCase()) ||
      item.borrower.toLowerCase().includes(search.toLowerCase()) ||
      item.plate.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* HEADER */}
      <div className="mb-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Status Peminjaman
        </h2>
      </div>

      {/* SEARCH */}
      <div className="relative mb-8">
        <IconSearch className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari kendaraan, plat, atau peminjam..."
          className="w-full pl-12 pr-4 py-3 rounded-2xl
                     border border-gray-300 dark:border-gray-700
                     bg-white dark:bg-gray-900
                     text-gray-700 dark:text-gray-200
                     focus:ring-2 focus:ring-[#00AEEF]
                     focus:outline-none"
        />
      </div>

      {/* LIST */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filtered.length > 0 ? (
          filtered.map((item) => (
            <BorrowCard key={item.id} {...item} />
          ))
        ) : (
          <p className="col-span-2 py-10 text-center text-gray-500 dark:text-gray-400">
            Tidak ada data peminjaman ditemukan.
          </p>
        )}
      </div>
    </div>
  );
}