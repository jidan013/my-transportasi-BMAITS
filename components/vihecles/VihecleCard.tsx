import { memo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import StatusBadge from "../StatusBidge";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface Vehicle {
  id: string;
  name: string;
  type: string;
  plate: string;
  status: "available" | "borrowed" | "maintenance";
  borrower?: string;
  returnDate?: string;
  image: string;
  year: number;
  capacity: string;
}

const VehicleCard = memo(({ vehicle }: { vehicle: Vehicle }) => {
  const reduced = useReducedMotion();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={!reduced ? { y: -8, scale: 1.02 } : {}}
      className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700"
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          src={vehicle.image}
          alt={vehicle.name}
          width={600}
          height={400}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
        />
        <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-lg" />
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{vehicle.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {vehicle.plate} • {vehicle.year} • {vehicle.capacity}
        </p>
        <div className="mt-4">
          <StatusBadge status={vehicle.status} borrower={vehicle.borrower} returnDate={vehicle.returnDate} />
        </div>
        {vehicle.status === "available" && (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="mt-5 w-full py-3 bg-gradient-to-r from-[#002D72] to-[#00AEEF] text-white font-semibold rounded-xl shadow-md text-sm"
          >
            Pinjam Sekarang
          </motion.button>
        )}
      </div>
    </motion.div>
  );
});

VehicleCard.displayName = "VehicleCard";
export default VehicleCard;