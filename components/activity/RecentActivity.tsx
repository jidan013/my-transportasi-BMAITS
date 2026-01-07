"use client";

import { motion } from "framer-motion";
import { IconActivity } from "@tabler/icons-react";
import ActivityCard from "./ActivityCard";
import { Activity } from "@/lib/data";
import SkeletonCard from "../ui/skeleton";
import { AnimatePresence } from "framer-motion";

interface Props {
  activities: Activity[];
  isLoading: boolean;
}

export default function RecentActivity({ activities, isLoading }: Props) {
  return (
    <section className="py-16 px-4 sm:px-6 bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-900">
      <div className="max-w-7xl mx-auto">
        <motion.h2
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-3xl sm:text-4xl font-extrabold mb-8 flex items-center gap-3"
        >
          <IconActivity className="w-8 h-8 text-[#002D72] dark:text-[#00AEEF]" />
          Aktivitas Terbaru
        </motion.h2>
        <div className="space-y-4">
          <AnimatePresence mode="popLayout">
            {isLoading
              ? Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={`skeleton-a-${i}`} />)
              : activities.map((a) => <ActivityCard key={a.id} {...a} />)}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}