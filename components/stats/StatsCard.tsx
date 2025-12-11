"use client";

import { motion } from "framer-motion";
import { IconProps } from "@tabler/icons-react";

interface Props {
  title: string;
  value: number;
  icon: React.FC<IconProps>;
  color: string;
  bg: string;
}

export default function StatsCard({ title, value, icon: Icon, color, bg }: Props) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className={`rounded-2xl p-6 shadow-lg flex flex-col justify-between text-white ${bg}`}
    >
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-sm opacity-90 font-medium">{title}</h3>
          <p className="text-3xl font-bold mt-1">{value}</p>
        </div>
        <div className="p-3 bg-white/20 rounded-xl">
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </motion.div>
  );
}
