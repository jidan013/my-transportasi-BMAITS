"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import {
  IconCar,
  IconCircleCheckFilled,
  IconUsers,
  IconTools,
  IconTrendingUp,
  IconHistory,
  IconAlertTriangle,
  IconArrowUpRight,
  IconArrowDownRight,
} from "@tabler/icons-react";

interface Props {
  title: string;
  value: number;
  icon:
    | "total"
    | "available"
    | "borrowed"
    | "maintenance"
    | "due"
    | "history"
    | "trending";
  color: string;
  bg: string;
  trend?: "up" | "down";
  percent?: number;
}

const iconMap = {
  total: IconCar,
  available: IconCircleCheckFilled,
  borrowed: IconUsers,
  maintenance: IconTools,
  due: IconAlertTriangle,
  history: IconHistory,
  trending: IconTrendingUp,
};

export default function StatsCard({
  title,
  value,
  icon,
  color,
  bg,
  trend,
  percent,
}: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const reduced = useReducedMotion();
  const Icon = iconMap[icon] || IconTrendingUp;

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: reduced ? 0 : 24 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: reduced ? 0 : 0.35, ease: "easeOut" }}
      whileHover={
        !reduced
          ? {
              y: -6,
              scale: 1.04,
              boxShadow:
                "0 8px 25px rgba(0,174,239,0.25), 0 0 20px rgba(255,193,7,0.15)",
            }
          : {}
      }
      className="group relative bg-white/70 dark:bg-gray-800/60 
                 backdrop-blur-xl p-6 rounded-2xl border border-gray-200 
                 dark:border-gray-700 shadow-lg transition-all duration-300 overflow-hidden"
    >
      {/* Decorative Floating Icon (background) */}
      <motion.div
        initial={{ opacity: 0, y: 20, rotate: -10 }}
        animate={isInView ? { opacity: 0.08, y: 0, rotate: 0 } : {}}
        transition={{ delay: 0.1, duration: 0.6 }}
        className="absolute top-4 right-4 text-[#00AEEF]"
      >
        <Icon className="w-20 h-20" />
      </motion.div>

      {/* Gradient Accent Line */}
      <div className="absolute top-0 left-0 w-full h-[3px] bg-gradient-to-r from-[#002D72] via-[#00AEEF] to-[#FFC107]" />

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-3">
        {/* Header with Icon */}
        <div className="flex items-center justify-between">
          <div
            className={`p-3 rounded-xl ${bg} shadow-md transition-transform group-hover:scale-110`}
          >
            <Icon className={`w-6 h-6 ${color}`} />
          </div>

          {/* Animated Glow Dot */}
          <motion.div
            animate={{ scale: [1, 1.3, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="w-2.5 h-2.5 rounded-full bg-gradient-to-r from-[#00AEEF] to-[#FFC107]"
          />
        </div>

        {/* Value */}
        <motion.p
          initial={{ scale: 0.9 }}
          animate={isInView ? { scale: 1 } : {}}
          transition={{ duration: 0.3 }}
          className="text-4xl font-extrabold tracking-tight bg-clip-text text-transparent 
                     bg-gradient-to-r from-[#002D72] via-[#00AEEF] to-[#FFC107]"
        >
          {value.toLocaleString("id-ID")}
        </motion.p>

        {/* Title */}
        <div className="flex items-center justify-between">
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-300 tracking-wide">
            {title}
          </p>

          {/* Trend indicator (optional) */}
          {trend && percent !== undefined && (
            <div
              className={`flex items-center gap-1 text-xs font-medium ${
                trend === "up"
                  ? "text-green-600 dark:text-green-400"
                  : "text-red-600 dark:text-red-400"
              }`}
            >
              {trend === "up" ? (
                <IconArrowUpRight className="w-4 h-4" />
              ) : (
                <IconArrowDownRight className="w-4 h-4" />
              )}
              <span>{percent}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Bottom Glow */}
      <motion.div
        initial={{ scaleX: 0 }}
        whileHover={{ scaleX: 1 }}
        transition={{ duration: 0.4 }}
        className="absolute bottom-0 left-0 origin-left h-[3px] bg-gradient-to-r from-[#002D72] via-[#00AEEF] to-[#FFC107] rounded-full"
      />
    </motion.div>
  );
}
