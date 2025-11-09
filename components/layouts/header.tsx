// components/layout/Header.tsx
"use client";

import { useId } from "react";
import { motion } from "framer-motion";
import { IconCar, IconCircleCheckFilled, IconUsers, IconAlertTriangle, IconTools } from "@tabler/icons-react";
import DarkModeToggle from "../ui/DarkMode";

interface HeaderProps {
  stats: { total: number; available: number; borrowed: number; dueToday: number; maintenance: number };
}

export default function Header({ stats }: HeaderProps) {
  const uid = useId();

  const items = [
    { label: "Armada", value: stats.total, icon: IconCar, color: "text-[#002D72] dark:text-[#00AEEF]" },
    { label: "Dipinjam", value: stats.borrowed, icon: IconUsers, color: "text-orange-600 dark:text-orange-400" },
    { label: "Jatuh Tempo", value: stats.dueToday, icon: IconAlertTriangle, color: "text-red-600 dark:text-red-400" },
    { label: "Maintenance", value: stats.maintenance, icon: IconTools, color: "text-purple-600 dark:text-purple-400" },
  ];

  return (
    <motion.header
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-6">
        <div className="flex items-center gap-6 text-sm font-medium flex-wrap">
          {items.map((item, i) => (
            <motion.div
              key={`${uid}-stat-${i}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex items-center gap-2"
            >
              <item.icon className={`w-5 h-5 ${item.color}`} />
              <span className="text-gray-600 dark:text-gray-400">{item.label}:</span>
              <span className={`font-bold ${item.color}`}>{item.value}</span>
            </motion.div>
          ))}
        </div>
        <DarkModeToggle />
      </div>
    </motion.header>
  );
}