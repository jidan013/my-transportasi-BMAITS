"use client";

import { motion } from "framer-motion";
import {
  IconCar,
  IconCheck,
  IconClockHour4,
  IconTools,
  IconTrendingUp,
} from "@tabler/icons-react";
import StatsCard from "@/components/stats/StatsCard";

interface Stats {
  total: number;
  available: number;
  borrowed: number;
  maintenance: number;
}

interface Props {
  stats: Stats;
}

export default function QuickStats({ stats }: Props) {
  const items = [
    {
      title: "Total Armada",
      value: stats.total,
      icon: IconCar,
      color: "text-[#002D72] dark:text-[#00AEEF]",
      bg: "bg-gradient-to-br from-[#002D72] to-[#00AEEF]",
    },
    {
      title: "Tersedia",
      value: stats.available,
      icon: IconCheck,
      color: "text-emerald-600 dark:text-emerald-400",
      bg: "bg-gradient-to-br from-emerald-500 to-teal-500",
    },
    {
      title: "Dipinjam",
      value: stats.borrowed,
      icon: IconClockHour4,
      color: "text-orange-600 dark:text-orange-400",
      bg: "bg-gradient-to-br from-orange-500 to-red-500",
    },
    {
      title: "Maintenance",
      value: stats.maintenance,
      icon: IconTools,
      color: "text-purple-600 dark:text-purple-400",
      bg: "bg-gradient-to-br from-purple-500 to-indigo-500",
    },
  ];

  return (
    <section className="py-16 px-4 sm:px-6 bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-900">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-extrabold text-center mb-10 flex items-center justify-center gap-3"
        >
          <IconTrendingUp className="w-8 h-8 text-[#002D72] dark:text-[#00AEEF]" />
          Statistik Cepat
        </motion.h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {items.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <StatsCard {...stat} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
