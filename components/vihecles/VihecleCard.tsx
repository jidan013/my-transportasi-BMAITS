"use client";

import { memo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import StatusBadge from "../StatusBidge";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Car, Bus, LucideIcon } from "lucide-react";
import Link from "next/link";

/* =======================
   IMAGE MAP
======================= */
const VehicleImageMap: Record<string, string> = {
  // BUS
  L7808AE: "/FotoKendaraan/MANDIRI.png",
  L7684AP: "/FotoKendaraan/BNI.png",
  L7151AH: "/FotoKendaraan/SPS.png",
  L7608AP: "/FotoKendaraan/IKOMA.png",

  // MOBIL
  L1511EP: "/FotoKendaraan/L1511EP.png",
  L1502BP: "/FotoKendaraan/L1502BP.png",
  L1031CP: "/FotoKendaraan/L1031CP.png",
  L1393DL: "/FotoKendaraan/L1393DL.png",
  L1843OD: "/FotoKendaraan/L1843OD.png",
  L1081OE: "/FotoKendaraan/L1081OE.png",
  L1080OE: "/FotoKendaraan/L1080OE.png",

  DEFAULT: "/FotoKendaraan/Default.jpeg",
};


/* =======================
   TYPES
======================= */
interface Vehicle {
  id: number;
  icon: LucideIcon;
  nama: string;
  jenis: string;
  plat: string;
  warna: string;
  bbm: string;
  status: "available" | "borrowed" | "maintenance";
  borrower?: string;
  returnDate?: string;
  kapasitas: string;
}

/* =======================
   IMAGE RESOLVER
======================= */
const normalize = (value: string) =>
  value.toUpperCase().replace(/\s+/g, "_");

const resolveVehicleImage = (vehicle: Vehicle): string => {
  const platKey = vehicle.plat.replace(/\s+/g, "").toUpperCase();
  const image = VehicleImageMap[platKey] || VehicleImageMap.DEFAULT;

  console.log("PLAT:", platKey, "IMAGE:", image);

  return image;
};



/* =======================
   DATA
======================= */
const kendaraanAwal: Vehicle[] = [
  {
    id: 1,
    icon: Bus,
    nama: "BUS MANDIRI",
    jenis: "Bus",
    warna: "Putih Biru",
    plat: "L 7808 AE",
    bbm: "Dexlite",
    status: "available",
    kapasitas: "35 Orang",
  },
  {
    id: 2,
    icon: Bus,
    nama: "BUS BNI",
    jenis: "Bus",
    warna: "Putih Oren",
    plat: "L 7684 AP",
    bbm: "Dexlite",
    status: "available",
    kapasitas: "28 Orang",
  },
  {
    id: 3,
    icon: Bus,
    nama: "BUS SPS",
    jenis: "Bus",
    warna: "Putih Biru",
    plat: "L 7151 AH",
    bbm: "Dexlite",
    status: "available",
    kapasitas: "28 Orang",
  },
  {
    id: 4,
    icon: Bus,
    nama: "BUS IKOMA",
    jenis: "Bus",
    warna: "Putih Biru",
    plat: "L 7608 AP",
    bbm: "Dexlite",
    status: "available",
    kapasitas: "27 Orang",
  },
  {
    id: 6,
    icon: Car,
    nama: "HYUNDAI",
    jenis: "Kendaraan Dinas",
    warna: "Hitam",
    plat: "L 1843 OD",
    bbm: "Dexlite",
    status: "available",
    kapasitas: "5 Orang",
  },
  {
    id: 10,
    icon: Car,
    nama: "INNOVA XDPP",
    jenis: "MPV",
    warna: "Hitam",
    plat: "L 1511 EP",
    bbm: "Dexlite",
    status: "available",
    kapasitas: "5 Orang",
  },
  {
    id: 12,
    icon: Car,
    nama: "INNOVA X ELEKTRO",
    jenis: "MPV",
    warna: "Abu-abu",
    plat: "L 1502 BP",
    bbm: "Pertamak",
    status: "available",
    kapasitas: "5 Orang",
  },
  {
    id: 14,
    icon: Car,
    nama: "AVANZA XDKG",
    jenis: "MPV",
    warna: "Hitam",
    plat: "L 1031 CP",
    bbm: "Pertamak",
    status: "available",
    kapasitas: "5 Orang",
  },
  {
    id: 16,
    icon: Car,
    nama: "AVANZA XBURB",
    jenis: "MPV",
    warna: "Silver",
    plat: "L 1393 DL",
    bbm: "Pertamak",
    status: "available",
    kapasitas: "5 Orang",
  },
];

/* =======================
   COMPONENT
======================= */
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
          src={resolveVehicleImage(vehicle)}
          alt={`${vehicle.nama} - ${vehicle.jenis}`}
          width={600}
          height={400}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-lg" />
      </div>

      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">
          {vehicle.nama}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {vehicle.plat} • {vehicle.warna} • {vehicle.kapasitas}
        </p>

        <div className="mt-4">
          <StatusBadge
            status={vehicle.status}
            borrower={vehicle.borrower}
            returnDate={vehicle.returnDate}
          />
        </div>

        {vehicle.status === "available" && (
          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
            <Link
              href="/form"
              className="mt-5 block w-full py-3 bg-gradient-to-r from-[#002D72] to-[#00AEEF] 
              text-white font-semibold rounded-xl shadow-md text-sm hover:shadow-lg transition-all text-center"
            >
              Pinjam Sekarang
            </Link>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
});

VehicleCard.displayName = "VehicleCard";

export default VehicleCard;
export { kendaraanAwal, VehicleImageMap };
