"use client";

import { useState } from "react";
import BorrowCard from "./BorrowCard";
import { IconSearch, IconLoader2 } from "@tabler/icons-react";
import type { BorrowItem } from "@/types/times";
import { checkBookingByNRP, getAllBookings } from "@/lib/services/booking-service";
import type { Booking } from "@/types/booking";

/* =====================
   HELPER
===================== */
function mapBookingToBorrowItem(b: Booking): BorrowItem {
  const timeline: BorrowItem["timeline"] = [
    {
      key: "diajukan",
      label: "Diajukan",
      time: formatWaktu(b.tanggal_pinjam),
    },
  ];

  if (b.status_booking === "disetujui" || b.status_booking === "ditolak") {
    timeline.push({
      key: "ditinjau",
      label: "Ditinjau",
      time: formatWaktu(b.tanggal_pinjam),
    });
  }

  if (b.status_booking === "disetujui") {
    timeline.push(
      {
        key: "disetujui",
        label: "Disetujui",
        time: formatWaktu(b.tanggal_kembali),
      },
      {
        key: "diterbitkan",
        label: "Surat Diterbitkan",
        time: formatWaktu(b.tanggal_kembali),
      }
    );
  }

  const statusMap: Record<Booking["status_booking"], BorrowItem["status"]> = {
    menunggu: "pending",
    disetujui: "terbit",
    ditolak: "rejected",
  };

  return {
    id: b.id,
    borrower: b.nama,
    nrp: b.nrp, 
    vehicle: b.vehicle?.nama_kendaraan ?? "—",
    plate: b.vehicle?.nomor_polisi ?? "—",
    borrowDate: b.tanggal_pinjam,
    returnDate: b.tanggal_kembali,
    keperluan: b.keperluan,
    status: statusMap[b.status_booking],
    timeline,
  };
}

function formatWaktu(raw: string): string {
  if (!raw) return "—";
  try {
    return new Date(raw).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return raw;
  }
}

/* =====================
   COMPONENT
===================== */
export default function BorrowStat({ isAdmin = false }: { isAdmin?: boolean }) {
  const [search, setSearch] = useState("");
  const [items, setItems] = useState<BorrowItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    const q = search.trim();
    if (!q) return;

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      let raw: Booking[] = [];

      if (/^\d+$/.test(q)) {
        raw = await checkBookingByNRP(q);
      } else {
        if (isAdmin) {
          raw = await getAllBookings();
        } else {
          setError("Masukkan NRP (angka).");
          setLoading(false);
          return;
        }
      }

      const mapped = raw.map(mapBookingToBorrowItem);

      const filtered = isAdmin
        ? mapped.filter((i) => {
            const qLower = q.toLowerCase();
            return (
              i.borrower.toLowerCase().includes(qLower) ||
              i.vehicle.toLowerCase().includes(qLower) ||
              i.plate.toLowerCase().includes(qLower) ||
              String(i.id).includes(qLower)
            );
          })
        : mapped;

      setItems(filtered);
    } catch {
      setError("Data tidak ditemukan.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">

      {/* HEADER */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Status Peminjaman</h2>
        <p className="text-sm text-gray-500">
          {isAdmin
            ? "Cari data peminjaman"
            : "Masukkan NRP Anda"}
        </p>
      </div>

      {/* SEARCH */}
      <div className="flex gap-3 mb-8">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Masukkan NRP..."
          className="flex-1 border rounded-xl px-4 py-3"
        />

        <button
          onClick={handleSearch}
          className="px-6 py-3 bg-blue-700 text-white rounded-xl"
        >
          {loading ? <IconLoader2 className="animate-spin" /> : "Cari"}
        </button>
      </div>

      {/* ERROR */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* RESULT */}
      <div className="grid md:grid-cols-2 gap-6">
        {items.map((item) => (
          <BorrowCard key={item.id} {...item} />
        ))}
      </div>
    </div>
  );
}