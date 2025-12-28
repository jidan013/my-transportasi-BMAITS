"use client";

import { useState } from "react";
import {
  CheckCircle,
  XCircle,
  Clock,
  Car,
} from "lucide-react";

type BorrowStatus = "pending" | "approved" | "rejected";

interface BorrowRequest {
  id: number;
  pemohon: string;
  unit: string;
  kendaraan: string;
  tanggalPinjam: string;
  tanggalKembali: string;
  keperluan: string;
  status: BorrowStatus;
}

const dummyRequests: BorrowRequest[] = [
  {
    id: 1,
    pemohon: "Ahmad Fauzi",
    unit: "BMA ITS",
    kendaraan: "Mobil Operasional",
    tanggalPinjam: "2025-01-10",
    tanggalKembali: "2025-01-12",
    keperluan: "Kegiatan monitoring lapangan",
    status: "pending",
  },
  {
    id: 2,
    pemohon: "Siti Rahma",
    unit: "FTSP ITS",
    kendaraan: "Bus",
    tanggalPinjam: "2025-01-15",
    tanggalKembali: "2025-01-16",
    keperluan: "Kunjungan kerja",
    status: "approved",
  },
];

export default function PermintaanClient() {
  const [data, setData] = useState<BorrowRequest[]>(dummyRequests);

  const updateStatus = (id: number, status: BorrowStatus) => {
    setData((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status } : item
      )
    );
  };

  const statusBadge = (status: BorrowStatus) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700">
            <CheckCircle className="w-3 h-3" />
            Disetujui
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-700">
            <XCircle className="w-3 h-3" />
            Ditolak
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-700">
            <Clock className="w-3 h-3" />
            Menunggu
          </span>
        );
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* HEADER */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          Permintaan Peminjaman Kendaraan
        </h1>
        <p className="text-sm text-slate-500">
          Kelola persetujuan dan penolakan permintaan kendaraan
        </p>
      </div>

      {/* TABLE */}
      <div className="bg-white rounded-xl shadow border border-slate-200 overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-slate-100 text-slate-600">
            <tr>
              <th className="px-4 py-3 text-left">Pemohon</th>
              <th className="px-4 py-3 text-left">Unit</th>
              <th className="px-4 py-3 text-left">Kendaraan</th>
              <th className="px-4 py-3 text-left">Tanggal</th>
              <th className="px-4 py-3 text-left">Keperluan</th>
              <th className="px-4 py-3 text-center">Status</th>
              <th className="px-4 py-3 text-center">Aksi</th>
            </tr>
          </thead>

          <tbody>
            {data.map((item) => (
              <tr
                key={item.id}
                className="border-t hover:bg-slate-50 transition"
              >
                <td className="px-4 py-3 font-medium text-slate-800">
                  {item.pemohon}
                </td>

                <td className="px-4 py-3 text-slate-600">
                  {item.unit}
                </td>

                <td className="px-4 py-3 flex items-center gap-2 text-slate-700">
                  <Car className="w-4 h-4 text-slate-400" />
                  {item.kendaraan}
                </td>

                <td className="px-4 py-3 text-slate-600">
                  {item.tanggalPinjam} – {item.tanggalKembali}
                </td>

                <td className="px-4 py-3 text-slate-600">
                  {item.keperluan}
                </td>

                <td className="px-4 py-3 text-center">
                  {statusBadge(item.status)}
                </td>

                <td className="px-4 py-3 text-center">
                  {item.status === "pending" ? (
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() =>
                          updateStatus(item.id, "approved")
                        }
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-emerald-600 text-white hover:bg-emerald-700 transition"
                      >
                        <CheckCircle className="w-4 h-4" />
                        Setujui
                      </button>

                      <button
                        onClick={() =>
                          updateStatus(item.id, "rejected")
                        }
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
                      >
                        <XCircle className="w-4 h-4" />
                        Tolak
                      </button>
                    </div>
                  ) : (
                    <span className="text-xs text-slate-400">
                      Selesai
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
