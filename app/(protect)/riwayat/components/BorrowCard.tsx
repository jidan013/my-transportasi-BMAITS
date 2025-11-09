"use client";

import { motion } from "framer-motion";
import {
  IconCar,
  IconClock,
  IconCheck,
  IconAlertTriangle,
  IconX,
} from "@tabler/icons-react";

interface Props {
  borrower: string;
  vehicle: string;
  plate: string;
  borrowDate: string;
  returnDate: string;
  status: "approved" | "pending" | "rejected" | "returned";
}

export default function BorrowCard({
  borrower,
  vehicle,
  plate,
  borrowDate,
  returnDate,
  status,
}: Props) {
  const getStatusStyle = () => {
    switch (status) {
      case "approved":
        return "bg-emerald-100 text-emerald-700 dark:bg-emerald-800/40 dark:text-emerald-300";
      case "pending":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-800/40 dark:text-yellow-300";
      case "rejected":
        return "bg-red-100 text-red-700 dark:bg-red-800/40 dark:text-red-300";
      case "returned":
        return "bg-blue-100 text-blue-700 dark:bg-blue-800/40 dark:text-blue-300";
      default:
        return "";
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case "approved":
        return <IconCheck className="w-4 h-4" />;
      case "pending":
        return <IconClock className="w-4 h-4" />;
      case "rejected":
        return <IconX className="w-4 h-4" />;
      case "returned":
        return <IconAlertTriangle className="w-4 h-4" />;
      default:
        return null;
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, scale: 1.01 }}
      className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 p-5 transition-all"
    >
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-[#00AEEF] to-[#002D72] rounded-lg">
            <IconCar className="text-white w-5 h-5" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {vehicle}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {plate}
            </p>
          </div>
        </div>

        <span
          className={`px-3 py-1.5 text-sm font-medium rounded-xl flex items-center gap-1 ${getStatusStyle()}`}
        >
          {getStatusIcon()}
          {status === "approved"
            ? "Disetujui"
            : status === "pending"
            ? "Menunggu"
            : status === "rejected"
            ? "Ditolak"
            : "Dikembalikan"}
        </span>
      </div>

      <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
        <p>
          <span className="font-medium text-gray-800 dark:text-gray-200">
            Peminjam:
          </span>{" "}
          {borrower}
        </p>
        <p>
          <span className="font-medium text-gray-800 dark:text-gray-200">
            Tgl Pinjam:
          </span>{" "}
          {new Date(borrowDate).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
        <p>
          <span className="font-medium text-gray-800 dark:text-gray-200">
            Tgl Kembali:
          </span>{" "}
          {new Date(returnDate).toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </div>
    </motion.div>
  );
}
