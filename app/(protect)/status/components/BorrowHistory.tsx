"use client";

import BorrowCard from "./BorrowCard";
import { useState } from "react";
import { IconSearch } from "@tabler/icons-react";

const mockHistory = [
  {
    borrower: "Andi Wijaya",
    vehicle: "Toyota Avanza",
    plate: "B 1234 XYZ",
    borrowDate: "2025-10-12",
    returnDate: "2025-10-13",
    status: "approved",
  },
  {
    borrower: "Siti Rahma",
    vehicle: "Suzuki Ertiga",
    plate: "L 4321 ABC",
    borrowDate: "2025-09-28",
    returnDate: "2025-09-29",
    status: "returned",
  },
  {
    borrower: "Budi Santoso",
    vehicle: "Mitsubishi Pajero",
    plate: "N 9988 DD",
    borrowDate: "2025-10-05",
    returnDate: "2025-10-10",
    status: "rejected",
  },
  {
    borrower: "Rina Putri",
    vehicle: "Honda Jazz",
    plate: "B 7744 TT",
    borrowDate: "2025-11-01",
    returnDate: "2025-11-03",
    status: "pending",
  },
];

export default function BorrowHistory() {
  const [search, setSearch] = useState("");

  const filtered = mockHistory.filter((item) =>
    item.vehicle.toLowerCase().includes(search.toLowerCase()) ||
    item.borrower.toLowerCase().includes(search.toLowerCase()) ||
    item.plate.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          Status Peminjaman
        </h2>
      </div>

      <div className="relative mb-8">
        <IconSearch className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari kendaraan atau nama peminjam..."
          className="w-full pl-12 pr-4 py-3 rounded-2xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#00AEEF]"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.length > 0 ? (
          filtered.map((item, index) => (
           <BorrowCard
  key={index}
  {...item}
  status={
    item.status === "selesai"
      ? "returned"
      : item.status === "disetujui"
      ? "approved"
      : item.status === "ditolak"
      ? "rejected"
      : "pending"
  }
/>

          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center col-span-2 py-10">
            Tidak ada data peminjaman ditemukan.
          </p>
        )}
      </div>
    </div>
  );
}
