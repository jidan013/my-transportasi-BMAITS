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
} from "@tabler/icons-react";
import type { IconProps } from "@tabler/icons-react";
import type { ComponentType, ReactNode } from "react";
import type {
  BorrowStatus,
  TimelineKey,
  BorrowCardProps,
} from "@/types/times";
import { approveBooking } from "@/lib/services/booking-service";

/* =====================
   TYPES
===================== */
type IconComponent = ComponentType<IconProps>;

/* =====================
   CONFIG
===================== */
const timelineIcons: Record<TimelineKey, IconComponent> = {
  diajukan: IconClock,
  ditinjau: IconFileCheck,
  disetujui: IconCheck,
  diterbitkan: IconMail,
};

const statusConfig: Record<
  BorrowStatus,
  { label: string; icon: ReactNode; className: string }
> = {
  pending: {
    label: "Menunggu",
    icon: <IconClock size={14} />,
    className:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-800/40 dark:text-yellow-300",
  },
  approved: {
    label: "Disetujui",
    icon: <IconCheck size={14} />,
    className:
      "bg-emerald-100 text-emerald-800 dark:bg-emerald-800/40 dark:text-emerald-300",
  },
  rejected: {
    label: "Ditolak",
    icon: <IconX size={14} />,
    className:
      "bg-red-100 text-red-800 dark:bg-red-800/40 dark:text-red-300",
  },
  terbit: {
    label: "Surat Terbit",
    icon: <IconMail size={14} />,
    className:
      "bg-blue-100 text-blue-800 dark:bg-blue-800/40 dark:text-blue-300",
  },
};

/* =====================
   COMPONENT
===================== */
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
}: BorrowCardProps) {
  const statusMeta = statusConfig[status];

  /* =====================
     DOWNLOAD PDF (FROM BE)
  ===================== */
  const handleDownloadESurat = async () => {
    try {
      const res = await approveBooking(id);

      if (!res.downloadUrl) {
        alert("❌ File PDF tidak tersedia");
        return;
      }

      // buka file dari Laravel
      window.open(res.downloadUrl, "_blank");
    } catch (error) {
      alert("❌ Gagal mengunduh E-Surat");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -3 }}
      className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg
                 border border-gray-200 dark:border-gray-700 p-6"
    >
      {/* HEADER */}
      <div className="flex justify-between mb-5">
        <div className="flex gap-4">
          <div className="p-2 rounded-xl bg-linear-to-br from-[#00AEEF] to-[#002D72]">
            <IconCar className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {vehicle}
            </h3>
            <p className="text-xs text-gray-500">{plate}</p>
          </div>
        </div>

        <span className={`px-3 py-1 rounded-full text-xs ${statusMeta.className}`}>
          {statusMeta.icon} {statusMeta.label}
        </span>
      </div>

      {/* INFO */}
      <div className="grid grid-cols-2 text-sm gap-y-2">
        <p className="col-span-2">
          <strong>Peminjam:</strong> {borrower}
        </p>
        <p>
          <strong>Pinjam:</strong>{" "}
          {new Date(borrowDate).toLocaleDateString("id-ID")}
        </p>
        <p className="col-span-2">
          <strong>Keperluan:</strong> {keperluan}
        </p>
        <p>
          <strong>Kembali:</strong>{" "}
          {new Date(returnDate).toLocaleDateString("id-ID")}
        </p>
      </div>

      {/* TIMELINE */}
      <div className="mt-6 pt-4 border-t">
        {timeline.map((t) => {
          const Icon = timelineIcons[t.key];
          return (
            <div key={t.time} className="flex gap-3 mb-3">
              <div className="w-7 h-7 rounded-full bg-blue-700 text-white flex items-center justify-center">
                <Icon size={14} />
              </div>
              <div>
                <p className="text-sm font-medium">{t.label}</p>
                <p className="text-xs text-gray-500">{t.time}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ACTION */}
      {status === "terbit" && (
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleDownloadESurat}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl
                       bg-blue-600 text-white text-sm font-semibold
                       hover:bg-blue-700 shadow"
          >
            <IconDownload size={16} />
            Unduh E-Surat
          </button>
        </div>
      )}
    </motion.div>
  );
}