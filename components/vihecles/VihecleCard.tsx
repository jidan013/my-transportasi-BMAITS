import { memo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import StatusBadge from "../StatusBidge";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { Car, Bus, LucideIcon } from "lucide-react";

const VehicleImage = {
  BUS_MANDIRI: "bus(Mandiri).jpeg",
  BUS_SPS: "bus(SPS).jpeg",
  BUS_BNI: "bus(BNI).jpeg",
  BUS_IKOMA: "bus(Ikoma).jpeg",
  AVANZA_L1601OD: "avanza(L 1601 OD).jpeg",
  AVANZA_L1031CP: "avanza(L 1031 CP).jpeg",
  AVANZA_L1169OD: "avanza(L 1169 OD).jpeg",
  AVANZA_L1393DL: "avanza(L 1392 DL).jpeg",
  AVANZA_L1501FP: "avanza(L 1501 FP).jpeg",
  AVANZA_L1505AP: "avanza(L 1505 AP).jpeg",
  AVANZA_L1662AP: "avanza(L 1662 AP).jpeg",
  AVANZA_L1924AP: "avanza(L 1924 AP).jpeg",
  INOVA_L1502BP: "innova(L 1502 BP).jpeg",
  INOVA_L1511EP: "innova(L 1511 EP).jpeg",
  HYUNDAI_L1843OD: "hyundai(L 1843 OD).jpeg",
}

const kendaraanAwal : Vehicle[] = [
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
    status: "available",
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
    status: "available",
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
    status: "available",
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
    status: "available",
    kapasitas: "14 Orang",
    image: VehicleImage.BUS_IKOMA
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
    image: VehicleImage.HYUNDAI_L1843OD
  },
  {
    id: 7,
    icon: Car,
    nama: "SEDAN VIOS XSK ITS",
    jenis: "Sedan",
    warna: "Hitam",
    plat: "L 1069 OD",
    bbm: "Pertamak",
    status: "available",
    kapasitas: "3 Orang",
    image: VehicleImage.AVANZA_L1169OD
  },
  {
    id: 8,
    icon: Car,
    nama: "SEDAN ALTIS XWR4",
    jenis: "Sedan",
    warna: "Hitam",
    plat: "L 1081 OE",
    bbm: "Pertamak",
    status: "available",
    kapasitas: "3 Orang",
    image: VehicleImage.AVANZA_L1169OD
    
  },
  {
    id: 9,
    icon: Car,
    nama: "SEDAN ALTIS XWR3",
    jenis: "Sedan",
    warna: "Hitam",
    plat: "L 1080 OE",
    bbm: "Pertamak",
    status: "available",
    kapasitas: "3 Orang",
    image: VehicleImage.AVANZA_L1169OD
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
    image: VehicleImage.INOVA_L1511EP
  },
  {
    id: 11,
    icon: Car,
    nama: "INNOVA XFTSPK",
    jenis: "MPV",
    warna: "Hitam",
    plat: "L 1852 AP",
    bbm: "Pertamak",
    status: "available",
    kapasitas: "5 Orang",
    image: VehicleImage.INOVA_L1511EP
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
    image: VehicleImage.AVANZA_L1393DL
  },
  {
    id: 13,
    icon: Car,
    nama: "INNOVA XDRPM",
    jenis: "MPV",
    warna: "Hijau",
    plat: "L 1059 AP",
    bbm: "Pertamak",
    status: "available",
    kapasitas: "5 Orang",
    image: VehicleImage.AVANZA_L1393DL
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
    image: VehicleImage.AVANZA_L1393DL
  },
  {
    id: 15,
    icon: Car,
    nama: "AVANZA X INFORMATIKA",
    jenis: "MPV",
    warna: "Putih",
    plat: "L 6001 DP",
    bbm: "Pertamak",
    status: "available",
    kapasitas: "5 Orang",
    image: VehicleImage.AVANZA_L1393DL
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
    image: VehicleImage.AVANZA_L1393DL
  },
  {
    id: 17,
    icon: Car,
    nama: "AVANZA XBK",
    jenis: "MPV",
    warna: "Silver",
    plat: "L 1068 OD",
    bbm: "Pertamak",
    status: "available",
    kapasitas: "5 Orang",
    image: VehicleImage.AVANZA_L1393DL
  },
  {
    id: 18,
    icon: Car,
    nama: "AVANZA XBSP",
    jenis: "MPV",
    warna: "Silver",
    plat: "L 1171 OD",
    bbm: "Pertamak",
    status: "available",
    kapasitas: "5 Orang",
    image: VehicleImage.AVANZA_L1169OD
  },
]

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
  image: string;
  kapasitas: string;
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
          alt={vehicle.nama}
          width={600}
          height={400}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
        />
        <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-lg" />
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{vehicle.nama}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
          {vehicle.plat} • {vehicle.warna} • {vehicle.kapasitas}
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