// components/maintenance/MaintenanceSchedule.tsx
"use client";

import { motion } from "framer-motion";
import { IconTools } from "@tabler/icons-react";
import MaintenanceCard from "./MaintenanceCard";
import { Maintenance } from "@/lib/data";
import SkeletonCard from "../ui/skeleton";
import { AnimatePresence } from "framer-motion";

interface Props {
  schedules: Maintenance[];
  isLoading: boolean;
}

export default function MaintenanceSchedule({ schedules, isLoading }: Props) {
  return (
    <section className="py-16 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-extrabold mb-8 flex items-center gap-3"
        >
          <IconTools className="w-8 h-8 text-[#002D72] dark:text-[#00AEEF]" />
          Jadwal Maintenance
        </motion.h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          <AnimatePresence mode="popLayout">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={`skeleton-m-${i}`} />)
              : schedules.map((m) => <MaintenanceCard key={m.id} {...m} />)}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}