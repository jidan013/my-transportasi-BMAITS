"use client";

import { motion } from "framer-motion";
import {
  IconCar,
  IconClock,
  IconCheck,
  IconAlertTriangle,
  IconX,
  IconFileCheck,
  IconMail,
} from "@tabler/icons-react";
import type { IconProps } from "@tabler/icons-react";
import type { ComponentType, ReactNode } from "react";

/* =====================
   TYPES
===================== */

export type BorrowStatus = "approved" | "pending" | "rejected" | "returned";

export type TimelineKey = "diajukan" | "ditinjau" | "disetujui" | "terbit";

export interface TimelineItem {
  key: TimelineKey;
  label: string;
  time: string;
}

export interface BorrowCardProps {
  borrower: string;
  vehicle: string;
  plate: string;
  borrowDate: string;
  returnDate: string;
  status: BorrowStatus;
  timeline: TimelineItem[];
}

/* =====================
   ICON MAPS (TYPE SAFE)
===================== */

type IconComponent = ComponentType<IconProps>;

const timelineIcons: Record<TimelineKey, IconComponent> = {
  diajukan: IconClock,
  ditinjau: IconFileCheck,
  disetujui: IconCheck,
  terbit: IconMail,
};

const statusConfig: Record<
  BorrowStatus,
  {
    label: string;
    icon: ReactNode;
    className: string;
  }
> = {
  approved: {
    label: "Disetujui",
    icon: <IconCheck size={16} />,
    className:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-800/40 dark:text-emerald-300",
  },
  pending: {
    label: "Menunggu",
    icon: <IconClock size={16} />,
    className:
      "bg-yellow-100 text-yellow-700 dark:bg-yellow-800/40 dark:text-yellow-300",
  },
  rejected: {
    label: "Ditolak",
    icon: <IconX size={16} />,
    className:
      "bg-red-100 text-red-700 dark:bg-red-800/40 dark:text-red-300",
  },
  returned: {
    label: "Dikembalikan",
    icon: <IconAlertTriangle size={16} />,
    className:
      "bg-blue-100 text-blue-700 dark:bg-blue-800/40 dark:text-blue-300",
  },
};

/* =====================
   COMPONENT
===================== */

export default function BorrowCard({
  borrower,
  vehicle,
  plate,
  borrowDate,
  returnDate,
  status,
  timeline,
}: BorrowCardProps) {
  const statusMeta = statusConfig[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-5 transition-all"
    >
      {/* HEADER */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-gradient-to-br from-[#00AEEF] to-[#002D72] rounded-lg">
            <IconCar className="w-5 h-5 text-white" />
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {vehicle}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">{plate}</p>
          </div>
        </div>

        <span
          className={`px-3 py-1.5 text-sm font-medium rounded-xl flex items-center gap-1 ${statusMeta.className}`}
        >
          {statusMeta.icon}
          {statusMeta.label}
        </span>
      </div>

      {/* INFO */}
      <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
        <p>
          <span className="font-medium">Peminjam:</span> {borrower}
        </p>
        <p>
          <span className="font-medium">Tgl Pinjam:</span>{" "}
          {new Date(borrowDate).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </p>
        <p>
          <span className="font-medium">Tgl Kembali:</span>{" "}
          {new Date(returnDate).toLocaleDateString("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>

      {/* TIMELINE */}
      <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
        <h4 className="mb-4 font-semibold text-gray-800 dark:text-gray-200">
          Status Pengajuan
        </h4>

        <div className="relative space-y-6 pl-6">
          <div className="absolute left-3 inset-y-0 w-px bg-gray-300 dark:bg-gray-600" />

          {timeline.map((item, index) => {
            const Icon = timelineIcons[item.key];

            return (
              <div key={`${item.key}-${index}`} className="flex gap-4">
                <div className="z-10 w-8 h-8 rounded-full bg-[#0A2E6D] text-white flex items-center justify-center">
                  <Icon size={16} />
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {item.label}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {item.time}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </motion.div>
  );
}
