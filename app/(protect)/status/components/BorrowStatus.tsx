"use client";

import { useState, useEffect } from "react";
import BorrowCard from "./BorrowCard";
import { IconSearch, IconLoader2 } from "@tabler/icons-react";
import type { BorrowItem } from "@/types/times";
import {
  checkBookingByNRP,
  getAllBookings,
} from "@/lib/services/booking-service";
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
  const [allItems, setAllItems] = useState<BorrowItem[]>([]); // cache admin data
  const [items, setItems] = useState<BorrowItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searched, setSearched] = useState(false);

  // Admin: load semua data saat mount → filter lokal
  useEffect(() => {
    if (!isAdmin) return;

    const fetchAll = async () => {
      setInitialLoading(true);
      try {
        const raw = await getAllBookings(); // GET /v1/booking (auth required)
        const mapped = raw.map(mapBookingToBorrowItem);
        setAllItems(mapped);
        setItems(mapped);
      } catch {
        setError("Gagal memuat data peminjaman.");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchAll();
  }, [isAdmin]);

  const handleSearch = async () => {
    const q = search.trim();

    // Admin: filter lokal dari data yang sudah di-cache
    if (isAdmin) {
      if (!q) {
        setItems(allItems);
        return;
      }
      const qLower = q.toLowerCase();
      const filtered = allItems.filter(
        (i) =>
          i.borrower.toLowerCase().includes(qLower) ||
          i.nrp?.toLowerCase().includes(qLower) ||
          i.vehicle.toLowerCase().includes(qLower) ||
          i.plate.toLowerCase().includes(qLower) ||
          String(i.id).includes(qLower)
      );
      setItems(filtered);
      setSearched(true);
      return;
    }

    // Publik: wajib NRP (angka) → GET /v1/booking/check/:nrp
    if (!q) return;

    if (!/^\d+$/.test(q)) {
      setError("Masukkan NRP yang valid (angka).");
      return;
    }

    setLoading(true);
    setError(null);
    setSearched(true);

    try {
      const raw = await checkBookingByNRP(q); // GET /v1/booking/check/:nrp
      setItems(raw.map(mapBookingToBorrowItem));
    } catch {
      setError("Data tidak ditemukan.");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSearch();
  };

  const isLoadingAny = loading || initialLoading;

  return (
    <div className="max-w-6xl mx-auto p-6">

      {/* HEADER */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold">Status Peminjaman</h2>
        <p className="text-sm text-gray-500">
          {isAdmin
            ? "Cari data peminjaman berdasarkan nama, NRP, kendaraan, atau plat"
            : "Masukkan NRP Anda untuk melihat status peminjaman"}
        </p>
      </div>

      {/* SEARCH */}
      <div className="flex gap-3 mb-8">
        <input
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setError(null);
          }}
          onKeyDown={handleKeyDown}
          placeholder={isAdmin ? "Cari nama, NRP, kendaraan..." : "Masukkan NRP..."}
          className="flex-1 border rounded-xl px-4 py-3"
          disabled={isLoadingAny}
        />

        <button
          onClick={handleSearch}
          disabled={isLoadingAny}
          className="px-6 py-3 bg-blue-700 text-white rounded-xl disabled:opacity-60 flex items-center gap-2"
        >
          {loading ? (
            <IconLoader2 className="animate-spin" size={18} />
          ) : (
            <IconSearch size={18} />
          )}
          Cari
        </button>
      </div>

      {/* ERROR */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* LOADING INITIAL (admin) */}
      {initialLoading && (
        <div className="flex justify-center py-12">
          <IconLoader2 className="animate-spin text-blue-700" size={32} />
        </div>
      )}

      {/* EMPTY STATE */}
      {!isLoadingAny && searched && items.length === 0 && !error && (
        <p className="text-gray-400 text-center py-12">
          Tidak ada data peminjaman ditemukan.
        </p>
      )}

      {/* RESULT */}
      {!initialLoading && (
        <div className="grid md:grid-cols-2 gap-6">
          {items.map((item) => (
            <BorrowCard key={item.id} {...item} />
          ))}
        </div>
      )}
    </div>
  );
}