"use client";

import { motion } from "framer-motion";
import {
  IconCar,
  IconClock,
  IconCheck,
  IconX,
  IconFileCheck,
  IconMail,
  IconDownload,
  IconCalendar,
  IconUser,
  IconNotes,
} from "@tabler/icons-react";
import type { ComponentType } from "react";
import type { IconProps } from "@tabler/icons-react";
import type { BorrowStatus, TimelineKey, BorrowCardProps } from "@/types/times";
import { approveBooking } from "@/lib/services/booking-service";

/* ─── Types ─────────────────────────────────────────────── */
type IconComponent = ComponentType<IconProps>;

/* ─── Config ─────────────────────────────────────────────── */
const timelineIcons: Record<TimelineKey, IconComponent> = {
  diajukan: IconClock,
  ditinjau: IconFileCheck,
  disetujui: IconCheck,
  diterbitkan: IconMail,
};

const statusConfig: Record<BorrowStatus, { label: string; className: string; bar: string }> = {
  pending: {
    label: "Diajukan",
    className: "bg-blue-100 text-blue-700 border border-blue-200",
    bar: "w-1/4",
  },
  approved: {
    label: "Ditinjau",
    className: "bg-yellow-100 text-yellow-700 border border-yellow-200",
    bar: "w-2/4",
  },
  rejected: {
    label: "Ditolak",
    className: "bg-red-100 text-red-700 border border-red-200",
    bar: "w-full bg-red-500",
  },
  terbit: {
    label: "Disetujui",
    className: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    bar: "w-full",
  },
};

/* ─── Progress bar label ─────────────────────────────────── */
function progressLabel(status: BorrowStatus): string {
  if (status === "pending") return "Pengajuan sedang diproses...";
  if (status === "approved") return "Sedang ditinjau admin";
  if (status === "rejected") return "Pengajuan ditolak";
  return "Pengajuan telah disetujui!";
}

/* ─── Component ──────────────────────────────────────────── */
export default function BorrowCard({
  id,
  borrower,
  vehicle,
  plate,
  keperluan,
  borrowDate,
  returnDate,
  status,
  timeline,
  unitKerja,
  kontak,
}: BorrowCardProps & { unitKerja?: string; kontak?: string }) {
  const meta = statusConfig[status];

  const handleDownloadESurat = async () => {
    try {
      const res = await approveBooking(id);
      if (!res.downloadUrl) { alert("❌ File PDF tidak tersedia"); return; }
      window.open(res.downloadUrl, "_blank");
    } catch {
      alert("❌ Gagal mengunduh E-Surat");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col gap-5 h-full"
    >
      {/* ── Detail Card ─────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">

        {/* Header */}
        <div className="flex items-start justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-gray-900">{vehicle}</h2>
            <p className="text-xs text-gray-400 mt-0.5">ID Peminjaman: #{id}</p>
          </div>
          <span className={`text-xs font-bold px-3 py-1.5 rounded-full ${meta.className}`}>
            {meta.label}
          </span>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-sm">
          <div>
            <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1 flex items-center gap-1">
              <IconCar size={11} /> Kendaraan
            </p>
            <p className="font-semibold text-gray-800">{vehicle}</p>
            <p className="text-gray-400 text-xs">{plate}</p>
          </div>

          <div>
            <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1 flex items-center gap-1">
              <IconCalendar size={11} /> Tanggal Pinjam
            </p>
            <p className="font-semibold text-gray-800">
              {new Date(borrowDate).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
            </p>
            <p className="text-gray-400 text-xs">
              s/d {new Date(returnDate).toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1 flex items-center gap-1">
              <IconUser size={11} /> Peminjam
            </p>
            <p className="font-semibold text-gray-800">{borrower}</p>
            {unitKerja && <p className="text-gray-400 text-xs">{unitKerja}</p>}
          </div>

          <div>
            <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1 flex items-center gap-1">
              <IconUser size={11} /> Kontak
            </p>
            <p className="font-semibold text-gray-800">{kontak || "—"}</p>
          </div>

          {keperluan && (
            <div className="col-span-2">
              <p className="text-[10px] font-bold tracking-widest text-gray-400 uppercase mb-1 flex items-center gap-1">
                <IconNotes size={11} /> Keperluan
              </p>
              <p className="font-semibold text-gray-800 leading-relaxed">{keperluan}</p>
            </div>
          )}
        </div>
      </div>

      {/* ── Progress Card ────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-sm font-bold text-gray-700 mb-4">Progress Peminjaman</h3>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-2">
          <motion.div
            className={`h-full rounded-full ${status === "rejected" ? "bg-red-400" : "bg-[#002D72]"}`}
            initial={{ width: 0 }}
            animate={{
              width: status === "pending" ? "25%" : status === "approved" ? "55%" : "100%",
            }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          />
        </div>
        <p className={`text-xs text-center font-medium ${status === "rejected" ? "text-red-500" : "text-gray-400"}`}>
          {progressLabel(status)}
        </p>
      </div>

      {/* ── Timeline Card ────────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
        <h3 className="text-sm font-bold text-gray-700 mb-5">Status Peminjaman</h3>

        <div className="relative pl-5">
          {/* vertical line */}
          <div className="absolute left-4 top-4 bottom-4 w-px bg-gray-200" />

          <div className="space-y-5">
            {timeline.map((t, i) => {
              const Icon = timelineIcons[t.key];
              const isLast = i === timeline.length - 1;
              return (
                <div key={`${t.key}-${i}`} className="flex gap-4 items-start relative">
                  <div className={`
                    z-10 w-8 h-8 rounded-full flex items-center justify-center shadow-sm shrink-0
                    ${isLast
                      ? status === "rejected"
                        ? "bg-red-500 text-white"
                        : "bg-emerald-600 text-white"
                      : "bg-[#002D72] text-white"
                    }
                  `}>
                    {isLast && status === "rejected"
                      ? <IconX size={14} />
                      : <Icon size={14} />
                    }
                  </div>
                  <div className="pt-0.5">
                    <p className={`text-sm font-semibold ${
                      isLast
                        ? status === "rejected" ? "text-red-600" : "text-emerald-600"
                        : "text-gray-800"
                    }`}>
                      {t.label}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{t.time}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── E-Surat Download Card ─────────────────────────────── */}
      {status === "terbit" && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 flex items-center justify-between"
        >
          <div>
            <p className="text-sm font-bold text-gray-800">E-Surat Persetujuan</p>
            <p className="text-xs text-gray-400 mt-0.5">
              Surat persetujuan peminjaman kendaraan telah diterbitkan
            </p>
          </div>
          <button
            onClick={handleDownloadESurat}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#002D72] text-white text-sm font-bold hover:bg-[#001f5a] transition-colors shadow-sm shrink-0"
          >
            <IconDownload size={15} />
            Unduh PDF
          </button>
        </motion.div>
      )}
    </motion.div>
  );
}