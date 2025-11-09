// components/activity/ActivityCard.tsx
"use client";

import { motion, useInView } from "framer-motion";
import { IconActivity } from "@tabler/icons-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useRef } from "react";

interface Props {
  action: string;
  user: string;
  vehicle: string;
  timestamp: string;
}

export default function ActivityCard({ action, user, vehicle, timestamp }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true });
  const reduced = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: reduced ? 0 : -20 }}
      animate={isInView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: reduced ? 0 : 0.4 }}
      className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-5 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 flex items-center gap-4"
    >
      <div className="p-2.5 bg-gradient-to-br from-[#002D72] to-[#00AEEF] rounded-xl">
        <IconActivity className="w-5 h-5 text-white" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-900 dark:text-white">
          {user} <span className="text-[#002D72] dark:text-[#00AEEF]">{action}</span> {vehicle}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {new Date(timestamp).toLocaleString("id-ID", {
            dateStyle: "medium",
            timeStyle: "short",
          })}
        </p>
      </div>
    </motion.div>
  );
}