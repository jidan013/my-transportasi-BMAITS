import { Bus, Car, LucideIcon } from "lucide-react"

export type Status = "available" | "borrowed" | "maintenance"

export const VehicleImage = {
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
} as const

export type VehicleImageKey = keyof typeof VehicleImage

export interface Vehicle {
  id: number
  icon: LucideIcon
  nama: string
  jenis: string
  plat: string
  warna: string
  bbm: string
  status: Status
  kapasitas: string
  image: VehicleImageKey
  borrower?: string
  returnDate?: string
}

export interface Activity {
  id: string
  action: string
  user: string
  vehicle: string
  timestamp: string
}

export interface Maintenance {
  id: string
  vehicle: string
  date: string
  type: string
}

export const VEHICLES: Vehicle[] = [
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
    image: "BUS_MANDIRI",
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
    image: "BUS_BNI",
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
    image: "BUS_SPS",
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
    image: "BUS_IKOMA",
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
    image: "BUS_IKOMA",
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
    image: "HYUNDAI_L1843OD",
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
    image: "AVANZA_L1169OD",
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
    image: "AVANZA_L1169OD",
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
    image: "AVANZA_L1169OD",
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
    image: "INOVA_L1511EP",
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
    image: "INOVA_L1511EP",
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
    image: "INOVA_L1502BP",
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
    image: "INOVA_L1502BP",
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
    image: "AVANZA_L1031CP",
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
    image: "AVANZA_L1393DL",
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
    image: "AVANZA_L1393DL",
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
    image: "AVANZA_L1169OD",
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
    image: "AVANZA_L1169OD",
  },
]

export const ACTIVITIES: Activity[] = [
  {
    id: "a1",
    action: "meminjam",
    user: "Andi",
    vehicle: "BUS MANDIRI",
    timestamp: "2025-12-01T08:00",
  },
  {
    id: "a2",
    action: "mengembalikan",
    user: "Siti",
    vehicle: "AVANZA XBURB",
    timestamp: "2025-12-10T15:30",
  },
  {
    id: "a3",
    action: "meminjam",
    user: "Budi",
    vehicle: "INNOVA XDPP",
    timestamp: "2025-12-12T09:15",
  },
]

export const MAINTENANCE_SCHEDULES: Maintenance[] = [
  {
    id: "m1",
    vehicle: "BUS BNI",
    date: "2025-12-20",
    type: "Servis Rutin",
  },
  {
    id: "m2",
    vehicle: "AVANZA X INFORMATIKA",
    date: "2025-12-25",
    type: "Ganti Oli",
  },
  {
    id: "m3",
    vehicle: "HYUNDAI",
    date: "2025-12-28",
    type: "Perbaikan AC",
  },
]

// Utility function to get actual image path
export const getVehicleImage = (imageKey: VehicleImageKey): string => {
  return VehicleImage[imageKey]
}
