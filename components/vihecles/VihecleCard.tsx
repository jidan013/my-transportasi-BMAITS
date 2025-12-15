"use client";

import { memo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import StatusBadge from "../StatusBidge";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Car, Bus, LucideIcon } from "lucide-react";
import Link from "next/link";

const VehicleImage = {
  BUS_MANDIRI: "/FotoKendaraan/bus-mandiri.jpeg",
  BUS_SPS: "/FotoKendaraan/bus-sps.jpeg",
  BUS_BNI: "/FotoKendaraan/bus-bni.jpeg",
  BUS_IKOMA: "/FotoKendaraan/bus-ikoma.jpeg",
  AVANZA_L1601OD: "/FotoKendaraan/avanza-l1601od.jpeg",
  AVANZA_L1031CP: "/FotoKendaraan/avanza-l1031cp.jpeg",
  AVANZA_L1169OD: "/FotoKendaraan/avanza-l1169od.jpeg",
  AVANZA_L1393DL: "/FotoKendaraan/avanza-l1393dl.jpeg",
  AVANZA_L1501FP: "/FotoKendaraan/avanza-l1501fp.jpeg",
  AVANZA_L1505AP: "/FotoKendaraan/avanza-l1505ap.jpeg",
  AVANZA_L1662AP: "/FotoKendaraan/avanza-l1662ap.jpeg",
  AVANZA_L1924AP: "/FotoKendaraan/avanza-l1924ap.jpeg",
  INOVA_L1502BP: "/FotoKendaraan/innova-l1502bp.jpeg",
  INOVA_L1511EP: "/FotoKendaraan/innova-l1511ep.jpeg",
  HYUNDAI_L1843OD: "/FotoKendaraan/hyundai-l1843od.jpeg",
  // Default fallback untuk kendaraan tanpa gambar spesifik
  DEFAULT: "/FotoKendaraan/Default.jpeg",
} as const;

const kendaraanAwal: Vehicle[] = [
  // Bus (1-5)
  {
    id: 1,
    icon: Bus,
    nama: "BUS MANDIRI",
    jenis: "Bus",
    warna: "Putih Biru",
    plat: "L 7808 AE",
    bbm: "Dexlite",
    status: "available" as const,
    kapasitas: "35 Orang",
    image: VehicleImage.BUS_MANDIRI,
  },
  {
    id: 2,
    icon: Bus,
    nama: "BUS BNI",
    jenis: "Bus",
    warna: "Putih Oren",
    plat: "L 7684 AP",
    bbm: "Dexlite",
    status: "available" as const,
    kapasitas: "28 Orang",
    image: VehicleImage.BUS_BNI,
  },
  {
    id: 3,
    icon: Bus,
    nama: "BUS SPS",
    jenis: "Bus",
    warna: "Putih Biru",
    plat: "L 7151 AH",
    bbm: "Dexlite",
    status: "available" as const,
    kapasitas: "28 Orang",
    image: VehicleImage.BUS_SPS,
  },
  {
    id: 4,
    icon: Bus,
    nama: "BUS IKOMA",
    jenis: "Bus",
    warna: "Putih Biru",
    plat: "L 7608 AP",
    bbm: "Dexlite",
    status: "available" as const,
    kapasitas: "27 Orang",
    image: VehicleImage.BUS_IKOMA,
  },
  {
    id: 5,
    icon: Bus,
    nama: "HAICE",
    jenis: "Microbus",
    warna: "Hitam",
    plat: "L 7010 N",
    bbm: "Dexlite",
    status: "available" as const,
    kapasitas: "14 Orang",
    image: VehicleImage.BUS_IKOMA, // Fixed: pakai BUS_IKOMA yang mirip
  },
  {
    id: 6,
    icon: Car,
    nama: "HYUNDAI",
    jenis: "Kendaraan Dinas",
    warna: "Hitam",
    plat: "L 1843 OD",
    bbm: "Dexlite",
    status: "available" as const,
    kapasitas: "5 Orang",
    image: VehicleImage.HYUNDAI_L1843OD,
  },
 
  {
    id: 7,
    icon: Car,
    nama: "SEDAN VIOS XSK ITS",
    jenis: "Sedan",
    warna: "Hitam",
    plat: "L 1069 OD",
    bbm: "Pertamak",
    status: "available" as const,
    kapasitas: "3 Orang",
    image: VehicleImage.AVANZA_L1169OD,
  },
  {
    id: 8,
    icon: Car,
    nama: "SEDAN ALTIS XWR4",
    jenis: "Sedan",
    warna: "Hitam",
    plat: "L 1081 OE",
    bbm: "Pertamak",
    status: "available" as const,
    kapasitas: "3 Orang",
    image: VehicleImage.AVANZA_L1169OD,
  },
  {
    id: 9,
    icon: Car,
    nama: "SEDAN ALTIS XWR3",
    jenis: "Sedan",
    warna: "Hitam",
    plat: "L 1080 OE",
    bbm: "Pertamak",
    status: "available" as const,
    kapasitas: "3 Orang",
    image: VehicleImage.AVANZA_L1169OD,
  },
  // Innova (10-13)
  {
    id: 10,
    icon: Car,
    nama: "INNOVA XDPP",
    jenis: "MPV",
    warna: "Hitam",
    plat: "L 1511 EP",
    bbm: "Dexlite",
    status: "available" as const,
    kapasitas: "5 Orang",
    image: VehicleImage.INOVA_L1511EP,
  },
  {
    id: 11,
    icon: Car,
    nama: "INNOVA XFTSPK",
    jenis: "MPV",
    warna: "Hitam",
    plat: "L 1852 AP",
    bbm: "Pertamak",
    status: "available" as const,
    kapasitas: "5 Orang",
    image: VehicleImage.INOVA_L1511EP,
  },
  {
    id: 12,
    icon: Car,
    nama: "INNOVA X ELEKTRO",
    jenis: "MPV",
    warna: "Abu-abu",
    plat: "L 1502 BP",
    bbm: "Pertamak",
    status: "available" as const,
    kapasitas: "5 Orang",
    image: VehicleImage.INOVA_L1502BP,
  },
  {
    id: 13,
    icon: Car,
    nama: "INNOVA XDRPM",
    jenis: "MPV",
    warna: "Hijau",
    plat: "L 1059 AP",
    bbm: "Pertamak",
    status: "available" as const,
    kapasitas: "5 Orang",
    image: VehicleImage.INOVA_L1502BP,
  },
  // Avanza (14-18)
  {
    id: 14,
    icon: Car,
    nama: "AVANZA XDKG",
    jenis: "MPV",
    warna: "Hitam",
    plat: "L 1031 CP",
    bbm: "Pertamak",
    status: "available" as const,
    kapasitas: "5 Orang",
    image: VehicleImage.AVANZA_L1031CP,
  },
  {
    id: 15,
    icon: Car,
    nama: "AVANZA X INFORMATIKA",
    jenis: "MPV",
    warna: "Putih",
    plat: "L 6001 DP",
    bbm: "Pertamak",
    status: "available" as const,
    kapasitas: "5 Orang",
    image: VehicleImage.AVANZA_L1169OD,
  },
  {
    id: 16,
    icon: Car,
    nama: "AVANZA XBURB",
    jenis: "MPV",
    warna: "Silver",
    plat: "L 1393 DL",
    bbm: "Pertamak",
    status: "available" as const,
    kapasitas: "5 Orang",
    image: VehicleImage.AVANZA_L1393DL,
  },
  {
    id: 17,
    icon: Car,
    nama: "AVANZA XBK",
    jenis: "MPV",
    warna: "Silver",
    plat: "L 1068 OD",
    bbm: "Pertamak",
    status: "available" as const,
    kapasitas: "5 Orang",
    image: VehicleImage.AVANZA_L1169OD,
  },
  {
    id: 18,
    icon: Car,
    nama: "AVANZA XBSP",
    jenis: "MPV",
    warna: "Silver",
    plat: "L 1171 OD",
    bbm: "Pertamak",
    status: "available" as const,
    kapasitas: "5 Orang",
    image: VehicleImage.AVANZA_L1169OD,
  },
] as const;

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
  image?: string;
  kapasitas: string;
  fotoSrc?: string;
  fotoAlt?: string;
}

const VehicleCard = memo(({ vehicle }: { vehicle: Vehicle }) => {
  const reduced = useReducedMotion();

  const getVehicleImage = (image?: string): string => {
    if (!image) return VehicleImage.DEFAULT;
    if (!image.startsWith("/")) return VehicleImage.DEFAULT;
    return image;
  };

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
          src={getVehicleImage(vehicle.image)}
          alt={`${vehicle.nama} - ${vehicle.jenis}`}
          width={600}
          height={400}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />


        <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-lg" />
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{vehicle.nama}</h3>
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
          <motion.div
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Link
              href="/form"
              className="mt-5 block w-full py-3 bg-gradient-to-r from-[#002D72] to-[#00AEEF] 
               text-white font-semibold rounded-xl shadow-md text-sm 
               hover:shadow-lg transition-all text-center"
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
export { kendaraanAwal, VehicleImage };
