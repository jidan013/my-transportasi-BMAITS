// components/maintenance/MaintenanceCard.tsx
"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { IconTools, IconCalendar, IconClock } from "@tabler/icons-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface Props {
  vehicle: string;
  date: string;
  type: string;
}

export default function MaintenanceCard({ vehicle, date, type }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const reduced = useReducedMotion();

  // Format tanggal
  const formattedDate = new Date(date).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  // Hitung hari tersisa
  const daysLeft = Math.ceil((new Date(date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  const isSoon = daysLeft <= 3 && daysLeft >= 0;
  const isOverdue = daysLeft < 0;

  // Warna berdasarkan jenis & status
  const getTypeConfig = () => {
    const base = {
      "Servis Rutin": { from: "#002D72", to: "#00AEEF", label: "Rutin" },
      "Ganti Oli": { from: "#002D72", to: "#00AEEF", label: "Oli" },
      "Perbaikan AC": { from: "#002D72", to: "#00AEEF", label: "AC" },
    }[type] || { from: "#002D72", to: "#00AEEF", label: "Lainnya" };

    return base;
  };

  const { from, to, label } = getTypeConfig();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: reduced ? 0 : 30, scale: 0.96 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: reduced ? 0 : 0.5, ease: "easeOut" }}
      whileHover={
        !reduced
          ? {
              y: -10,
              scale: 1.03,
              boxShadow: "0 25px 50px rgba(0, 45, 114, 0.15)",
            }
          : {}
      }
      className="group relative bg-white/95 dark:bg-gray-800/95 backdrop-blur-xl p-6 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300"
    >
      {/* Gradient Background Orb */}
      <div
        className="absolute -top-16 -right-16 w-40 h-40 rounded-full blur-3xl opacity-20 group-hover:opacity-30 transition-opacity duration-500"
        style={{
          background: `linear-gradient(135deg, ${from}20, ${to}20)`,
        }}
      />

      {/* ITS Accent Line */}
      <div className="absolute top-0 left-0 h-1 w-full bg-gradient-to-r from-[#002D72] via-[#00AEEF] to-[#FFC107] opacity-70" />

      {/* Content */}
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {/* Icon with ITS Gradient */}
            <div
              className={`p-3 rounded-xl shadow-lg bg-gradient-to-br from-[${from}] to-[${to}] group-hover:scale-110 transition-transform duration-300`}
            >
              <IconTools className="w-5 h-5 text-white" />
            </div>

            <div>
              <h3 className="font-bold text-lg text-gray-900 dark:text-white group-hover:text-[#002D72] dark:group-hover:text-[#00AEEF] transition-colors">
                {vehicle}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  <IconClock className="w-3.5 h-3.5" />
                  {label}
                </span>
                {isSoon && (
                  <span className="px-2 py-0.5 text-xs font-bold text-amber-700 bg-amber-100 dark:text-amber-300 dark:bg-amber-900/40 rounded-full animate-pulse">
                    {daysLeft === 0 ? "Hari Ini" : `${daysLeft} Hari Lagi`}
                  </span>
                )}
                {isOverdue && (
                  <span className="px-2 py-0.5 text-xs font-bold text-red-700 bg-red-100 dark:text-red-300 dark:bg-red-900/40 rounded-full">
                    Telat {Math.abs(daysLeft)} Hari
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Status Dot */}
          <div
            className={`w-3 h-3 rounded-full shadow-lg animate-pulse ${
              isOverdue
                ? "bg-red-500"
                : isSoon
                ? "bg-amber-500"
                : "bg-emerald-500"
            }`}
          />
        </div>

        {/* Tanggal dengan Badge ITS Style */}
        <div className="flex items-center gap-2 text-sm font-medium bg-gradient-to-r from-[#002D72]/5 to-[#00AEEF]/5 dark:from-[#002D72]/20 dark:to-[#00AEEF]/20 px-4 py-2.5 rounded-xl backdrop-blur-sm border border-[#002D72]/10 dark:border-[#00AEEF]/20">
          <IconCalendar className="w-4.5 h-4.5 text-[#002D72] dark:text-[#00AEEF]" />
          <span className="text-gray-800 dark:text-gray-200">{formattedDate}</span>
        </div>

        {/* Hover Bottom Line */}
        <motion.div
          initial={{ width: 0 }}
          whileHover={{ width: "100%" }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="absolute bottom-0 left-0 h-1.5 bg-gradient-to-r from-[#002D72] via-[#00AEEF] to-[#FFC107] rounded-full"
        />
      </div>
    </motion.div>
  );
}