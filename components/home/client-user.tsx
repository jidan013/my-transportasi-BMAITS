"use client";

import { useState, useEffect, useRef, useMemo, useCallback, useId } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
  LazyMotion,
  domAnimation,
} from "framer-motion";
import Image from "next/image";
import {
  IconCar,
  IconCircleCheckFilled,
  IconUsers,
  IconAlertTriangle,
  IconCalendar,
  IconMoon,
  IconSun,
  IconHistory,
  IconPlus,
  IconChevronRight,
  IconSearch,
  IconTools,
  IconActivity,
  IconMail,
  IconPhone,
  IconMapPin,
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandLinkedin,
  IconBrandYoutube,
  IconTrendingUp,
} from "@tabler/icons-react";

// === Constants ===
const ITS = {
  primary: "#002D72",
  secondary: "#00AEEF",
  accent: "#FFC107",
  dark: "#1F2937",
  light: "#F3F4F6",
  white: "#FFFFFF",
} as const;

const VEHICLES: Vehicle[] = [
  { id: "1", name: "Toyota Avanza", type: "MPV", plate: "B 1234 XYZ", status: "available", image: "https://images.unsplash.com/photo-1590650046871-92c887180603?auto=format&fit=crop&w=600", year: 2022, capacity: "7 Penumpang" },
  { id: "2", name: "Honda Jazz", type: "Hatchback", plate: "B 5678 ABC", status: "borrowed", borrower: "Andi", returnDate: "2025-10-30", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600", year: 2020, capacity: "5 Penumpang" },
  { id: "3", name: "Daihatsu Xenia", type: "MPV", plate: "B 9012 DEF", status: "available", image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=600", year: 2021, capacity: "7 Penumpang" },
  { id: "4", name: "Suzuki Ertiga", type: "MPV", plate: "B 3456 GHI", status: "borrowed", borrower: "Budi", returnDate: "2025-11-01", image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600", year: 2023, capacity: "7 Penumpang" },
  { id: "5", name: "Mitsubishi Pajero", type: "SUV", plate: "B 7890 JKL", status: "maintenance", image: "https://images.unsplash.com/photo-1507136566006-8bb97875d4e5?auto=format&fit=crop&w=600", year: 2019, capacity: "5 Penumpang" },
];

const ACTIVITIES: Activity[] = [
  { id: "a1", action: "meminjam", user: "Andi", vehicle: "Honda Jazz", timestamp: "2025-10-29T08:00" },
  { id: "a2", action: "mengembalikan", user: "Siti", vehicle: "Toyota Avanza", timestamp: "2025-10-28T15:30" },
  { id: "a3", action: "meminjam", user: "Budi", vehicle: "Suzuki Ertiga", timestamp: "2025-10-27T09:15" },
];

const MAINTENANCE_SCHEDULES: Maintenance[] = [
  { id: "m1", vehicle: "Mitsubishi Pajero", date: "2025-11-05", type: "Servis Rutin" },
  { id: "m2", vehicle: "Toyota Avanza", date: "2025-11-10", type: "Ganti Oli" },
  { id: "m3", vehicle: "Daihatsu Xenia", date: "2025-11-15", type: "Perbaikan AC" },
];

// === Types ===
type Status = "available" | "borrowed" | "maintenance";

interface Vehicle {
  id: string;
  name: string;
  type: string;
  plate: string;
  status: Status;
  borrower?: string;
  returnDate?: string;
  image: string;
  year: number;
  capacity: string;
}

interface Activity {
  id: string;
  action: string;
  user: string;
  vehicle: string;
  timestamp: string;
}

interface Maintenance {
  id: string;
  vehicle: string;
  date: string;
  type: string;
}

// === Reduced Motion Hook ===
const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handleChange = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    setPrefersReducedMotion(mediaQuery.matches);
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);
  return prefersReducedMotion;
};

// === Skeleton Loader ===
function SkeletonCard() {
  return (
    <div className="bg-gray-100 dark:bg-gray-800 rounded-2xl p-6 animate-pulse">
      <div className="h-48 bg-gray-200 dark:bg-gray-700 rounded-t-2xl mb-4" />
      <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
    </div>
  );
}

// === Reusable Components ===
function StatusBadge({ status, borrower, returnDate }: Pick<Vehicle, "status" | "borrower" | "returnDate">) {
  const today = new Date().toISOString().split("T")[0];
  const isDueToday = returnDate === today;

  const config: Record<Status, { color: string; icon: any; label: string }> = {
    available: { color: "bg-emerald-50 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800", icon: IconCircleCheckFilled, label: "Tersedia" },
    borrowed: { color: "bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800", icon: IconUsers, label: "Dipinjam" },
    maintenance: { color: "bg-purple-50 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800", icon: IconTools, label: "Maintenance" },
  };

  const { icon: Icon, color, label } = config[status];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 ${color} border rounded-full font-semibold text-xs`} role="status" aria-label={`Status: ${label}`}>
          <Icon className="w-4 h-4" aria-hidden="true" />
          {label}
        </span>
        {isDueToday && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-red-100 dark:bg-red-900/40 text-red-800 dark:text-red-300 border border-red-300 dark:border-red-700 rounded-full text-xs font-bold animate-pulse" aria-label="Jatuh tempo hari ini">
            <IconAlertTriangle className="w-3.5 h-3.5" aria-hidden="true" />
            Hari Ini
          </span>
        )}
      </div>
      {status === "borrowed" && borrower && returnDate && (
        <div className="text-right text-xs">
          <p className="font-semibold text-orange-700 dark:text-orange-400">{borrower}</p>
          <p className="text-gray-500 dark:text-gray-400 flex items-center gap-1 justify-end">
            <IconCalendar className="w-3 h-3" aria-hidden="true" />
            {new Date(returnDate).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
          </p>
        </div>
      )}
    </div>
  );
}

function StatsCard({ title, value, icon: Icon, color, bg }: { title: string; value: number; icon: any; color: string; bg: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const reduced = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: reduced ? 0 : 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: reduced ? 0 : 0.4 }}
      whileHover={!reduced ? { y: -5, scale: 1.02 } : {}}
      className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-5 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-3">
        <div className={`p-3 rounded-xl ${bg} group-hover:scale-105 transition-transform duration-300`}>
          <Icon className={`w-6 h-6 ${color}`} aria-hidden="true" />
        </div>
        <IconChevronRight className="w-5 h-5 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition" aria-hidden="true" />
      </div>
      <p className="text-3xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
    </motion.div>
  );
}

function MaintenanceCard({ vehicle, date, type }: Maintenance) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const reduced = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: reduced ? 0 : 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: reduced ? 0 : 0.4 }}
      whileHover={!reduced ? { y: -5 } : {}}
      className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm p-5 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700"
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="p-2.5 bg-gradient-to-br from-purple-500 to-purple-700 rounded-xl">
          <IconTools className="w-5 h-5 text-white" aria-hidden="true" />
        </div>
        <div>
          <p className="font-semibold text-gray-900 dark:text-white">{vehicle}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{type}</p>
        </div>
      </div>
      <p className="text-sm flex items-center gap-1.5 text-gray-600 dark:text-gray-400">
        <IconCalendar className="w-4 h-4" aria-hidden="true" />
        {new Date(date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
      </p>
    </motion.div>
  );
}

function ActivityCard({ action, user, vehicle, timestamp }: Activity) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
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
        <IconActivity className="w-5 h-5 text-white" aria-hidden="true" />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-gray-900 dark:text-white">
          {user} <span className="text-[#002D72] dark:text-[#00AEEF]">{action}</span> {vehicle}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {new Date(timestamp).toLocaleString("id-ID", { dateStyle: "medium", timeStyle: "short" })}
        </p>
      </div>
    </motion.div>
  );
}

function VehicleCard({ vehicle }: { vehicle: Vehicle }) {
  const reduced = useReducedMotion();
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  return (
    <motion.div
      ref={ref}
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={isInView ? { opacity: 1, scale: 1 } : {}}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: reduced ? 0 : 0.4 }}
      whileHover={!reduced ? { y: -8, scale: 1.02 } : {}}
      className="group bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700"
    >
      <div className="relative h-48 overflow-hidden">
        <Image
          src={vehicle.image}
          alt={`${vehicle.name} (${vehicle.plate})`}
          width={600}
          height={400}
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII="
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-4 right-4 w-3 h-3 rounded-full bg-emerald-500 animate-pulse shadow-lg" aria-hidden="true" />
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{vehicle.name}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{vehicle.plate} • {vehicle.year} • {vehicle.capacity}</p>
        <div className="mt-4">
          <StatusBadge status={vehicle.status} borrower={vehicle.borrower} returnDate={vehicle.returnDate} />
        </div>
        {vehicle.status === "available" && (
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="mt-5 w-full py-3 bg-gradient-to-r from-[#002D72] to-[#00AEEF] text-white font-semibold rounded-xl shadow-md text-sm"
            aria-label={`Pinjam ${vehicle.name}`}
          >
            Pinjam Sekarang
          </motion.button>
        )}
      </div>
    </motion.div>
  );
}

// === Main Component ===
export default function PageUser() {
  const [darkMode, setDarkMode] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<Status | null>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.9]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.97]);
  const uid = useId();
  const [isLoading, setIsLoading] = useState(true);

  // === Dark Mode Sync ===
  useEffect(() => {
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    setDarkMode(prefersDark);
    setIsLoading(false); // Simulate data loading
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  // === Derived Stats ===
  const stats = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return {
      total: VEHICLES.length,
      available: VEHICLES.filter((v) => v.status === "available").length,
      borrowed: VEHICLES.filter((v) => v.status === "borrowed").length,
      maintenance: VEHICLES.filter((v) => v.status === "maintenance").length,
      dueToday: VEHICLES.filter((v) => v.status === "borrowed" && v.returnDate === today).length,
    };
  }, []);

  // === Filtered Vehicles ===
  const filteredVehicles = useMemo(() => {
    return VEHICLES.filter(
      (v) =>
        (v.name.toLowerCase().includes(search.toLowerCase()) || v.plate.toLowerCase().includes(search.toLowerCase())) &&
        (!filterStatus || v.status === filterStatus)
    );
  }, [search, filterStatus]);

  // === Handlers ===
  const handleSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>) => setSearch(e.target.value), []);
  const handleFilter = useCallback((status: Status | null) => setFilterStatus(status), []);

  return (
    <LazyMotion features={domAnimation}>
      <div className={`min-h-screen font-sans transition-colors duration-300 ${darkMode ? "dark bg-gray-950" : "bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50"}`}>
        {/* Sticky Header */}
        <motion.header
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
          className="sticky top-0 z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 shadow-sm"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4 sm:gap-6 text-sm font-medium flex-wrap">
              {[
                { label: "Armada", value: stats.total, icon: IconCar, color: "text-[#002D72] dark:text-[#00AEEF]" },
                { label: "Tersedia", value: stats.available, icon: IconCircleCheckFilled, color: "text-emerald-600 dark:text-emerald-400" },
                { label: "Dipinjam", value: stats.borrowed, icon: IconUsers, color: "text-orange-600 dark:text-orange-400" },
                { label: "Jatuh Tempo", value: stats.dueToday, icon: IconAlertTriangle, color: "text-red-600 dark:text-red-400" },
              ].map((stat, i) => (
                <motion.div
                  key={`${uid}-stat-${i}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-center gap-2"
                >
                  <stat.icon className={`w-5 h-5 ${stat.color}`} aria-hidden="true" />
                  <span className="text-gray-600 dark:text-gray-400">{stat.label}:</span>
                  <span className={`font-bold ${stat.color}`}>{stat.value}</span>
                </motion.div>
              ))}
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#002D72]"
              aria-label={darkMode ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
            >
              {darkMode ? <IconSun className="w-5 h-5 text-yellow-500" /> : <IconMoon className="w-5 h-5 text-gray-700" />}
            </button>
          </div>
        </motion.header>

        {/* Hero Section */}
        <motion.section
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 sm:px-6 py-12"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#001F5B]/90 via-[#002D72] to-[#00AEEF]/80" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />

          <div className="absolute inset-0 pointer-events-none">
            <motion.div
              animate={{ scale: [1, 1.2, 1], x: [-15, 15, -15] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="absolute top-20 left-20 w-64 h-64 bg-[#00AEEF]/30 rounded-full blur-3xl"
            />
            <motion.div
              animate={{ scale: [1.2, 1, 1.2], x: [15, -15, 15] }}
              transition={{ duration: 6, repeat: Infinity }}
              className="absolute bottom-20 right-20 w-48 h-48 bg-[#FFC107]/20 rounded-full blur-3xl"
            />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <p className="text-sm sm:text-base font-semibold text-cyan-200 tracking-widest uppercase mb-6">Sistem Peminjaman Kendaraan Dinas</p>
              <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
                {["Biro", "Manajemen", "Aset"].map((word, i) => (
                  <motion.span
                    key={`${uid}-hero-${i}`}
                    className="inline-block"
                    initial={{ y: 80, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: i * 0.15, duration: 0.6 }}
                  >
                    <span className={`bg-clip-text text-transparent bg-gradient-to-r ${i === 0 ? "from-white to-cyan-100" : i === 1 ? "from-[#00AEEF] to-[#FFC107]" : "from-[#FFC107] to-[#00AEEF]"}`}>{word}{" "}</span>
                  </motion.span>
                ))}
              </h1>
              <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-3xl mx-auto font-light mb-8">
                Platform modern untuk pengelolaan armada institusi dengan efisiensi, transparansi, dan kemudahan.
              </p>
            </motion.div>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }} className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={!reduced ? { scale: 1.05, y: -4, boxShadow: "0 15px 30px rgba(0,45,114,0.4)" } : {}}
                whileTap={{ scale: 0.95 }}
                className="group relative px-8 py-3 bg-white text-[#002D72] font-semibold text-base rounded-xl shadow-xl overflow-hidden focus:outline-none focus:ring-2 focus:ring-[#002D72]"
                aria-label="Ajukan Peminjaman"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <IconPlus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" aria-hidden="true" />
                  Ajukan Peminjaman
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#002D72] to-[#00AEEF] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
              </motion.button>
              <motion.button
                whileHover={!reduced ? { scale: 1.05, y: -4 } : {}}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-3 bg-white/10 backdrop-blur-xl text-white font-semibold text-base rounded-xl border border-white/30 shadow-xl flex items-center gap-2 hover:bg-white/20 transition-all focus:outline-none focus:ring-2 focus:ring-[#002D72]"
                aria-label="Lihat Riwayat"
              >
                <IconHistory className="w-5 h-5" aria-hidden="true" />
                Lihat Riwayat
              </motion.button>
            </motion.div>
          </div>

          <motion.div
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 1.4, repeat: Infinity }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 w-8 h-14 border-2 border-white/50 rounded-full flex justify-center"
            aria-hidden="true"
          >
            <motion.div animate={{ y: [0, 20, 0] }} transition={{ duration: 1.4, repeat: Infinity }} className="w-1.5 h-3 bg-white/70 rounded-full mt-2" />
          </motion.div>
        </motion.section>

        {/* Quick Stats */}
        <section className="py-16 px-4 sm:px-6 bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-900">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              className="text-3xl sm:text-4xl font-extrabold text-center mb-10 flex items-center justify-center gap-3"
            >
              <IconTrendingUp className="w-8 h-8 text-[#002D72] dark:text-[#00AEEF]" aria-hidden="true" />
              Statistik Cepat
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {[
                { title: "Total Armada", value: stats.total, icon: IconCar, color: "text-[#002D72] dark:text-[#00AEEF]", bg: "bg-gradient-to-br from-[#002D72] to-[#00AEEF]" },
                { title: "Tersedia", value: stats.available, icon: IconCircleCheckFilled, color: "text-emerald-600 dark:text-emerald-400", bg: "bg-gradient-to-br from-emerald-500 to-teal-500" },
                { title: "Dipinjam", value: stats.borrowed, icon: IconUsers, color: "text-orange-600 dark:text-orange-400", bg: "bg-gradient-to-br from-orange-500 to-red-500" },
                { title: "Maintenance", value: stats.maintenance, icon: IconTools, color: "text-purple-600 dark:text-purple-400", bg: "bg-gradient-to-br from-purple-500 to-indigo-500" },
              ].map((stat, i) => (
                <StatsCard key={`${uid}-stats-${i}`} {...stat} />
              ))}
            </div>
          </div>
        </section>

        {/* Maintenance Schedule */}
        <section className="py-16 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              className="text-3xl sm:text-4xl font-extrabold mb-8 flex items-center gap-3"
            >
              <IconTools className="w-8 h-8 text-[#002D72] dark:text-[#00AEEF]" aria-hidden="true" />
              Jadwal Maintenance
            </motion.h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <AnimatePresence mode="popLayout">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={`${uid}-skeleton-${i}`} />)
                ) : (
                  MAINTENANCE_SCHEDULES.map((m) => <MaintenanceCard key={m.id} {...m} />)
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Recent Activity */}
        <section className="py-16 px-4 sm:px-6 bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-900">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              className="text-3xl sm:text-4xl font-extrabold mb-8 flex items-center gap-3"
            >
              <IconActivity className="w-8 h-8 text-[#002D72] dark:text-[#00AEEF]" aria-hidden="true" />
              Aktivitas Terbaru
            </motion.h2>
            <div className="space-y-4">
              <AnimatePresence mode="popLayout">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => <SkeletonCard key={`${uid}-activity-skeleton-${i}`} />)
                ) : (
                  ACTIVITIES.map((a) => <ActivityCard key={a.id} {...a} />)
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Vehicle List */}
        <section className="py-16 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              className="text-3xl sm:text-4xl font-extrabold mb-8 flex items-center gap-3"
            >
              <IconCar className="w-8 h-8 text-[#002D72] dark:text-[#00AEEF]" aria-hidden="true" />
              Daftar Kendaraan
            </motion.h2>

            <div className="flex flex-col lg:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" aria-hidden="true" />
                <input
                  type="text"
                  value={search}
                  onChange={handleSearch}
                  placeholder="Cari kendaraan atau plat nomor..."
                  className="w-full pl-10 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#002D72] transition-all"
                  aria-label="Cari kendaraan"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {[
                  { label: "Semua", icon: IconCar, value: null },
                  { label: "Tersedia", icon: IconCircleCheckFilled, value: "available" },
                  { label: "Dipinjam", icon: IconUsers, value: "borrowed" },
                  { label: "Maintenance", icon: IconTools, value: "maintenance" },
                ].map((f, i) => (
                  <button
                    key={`${uid}-filter-${i}`}
                    onClick={() => handleFilter(f.value)}
                    className={`px-4 py-2 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all ${
                      filterStatus === f.value
                        ? "bg-gradient-to-r from-[#002D72] to-[#00AEEF] text-white shadow-md"
                        : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
                    } focus:outline-none focus:ring-2 focus:ring-[#002D72]`}
                    aria-label={`Filter ${f.label}`}
                  >
                    <f.icon className="w-4 h-4" aria-hidden="true" />
                    {f.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              <AnimatePresence mode="popLayout">
                {isLoading ? (
                  Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={`${uid}-vehicle-skeleton-${i}`} />)
                ) : filteredVehicles.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-full text-center text-gray-500 dark:text-gray-400 py-8"
                  >
                    Tidak ada kendaraan ditemukan.
                  </motion.div>
                ) : (
                  filteredVehicles.map((vehicle, i) => (
                    <VehicleCard key={vehicle.id} vehicle={vehicle} />
                  ))
                )}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-gray-900 text-white py-12 px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-gradient-to-br from-[#002D72] to-[#00AEEF] rounded-xl flex items-center justify-center shadow-lg">
                    <span className="text-lg font-extrabold text-white">ITS</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-extrabold">ITS Fleet</h3>
                    <p className="text-xs text-cyan-400">Biro Manajemen Aset</p>
                  </div>
                </div>
                <p className="text-sm text-gray-400 leading-relaxed">
                  Sistem peminjaman kendaraan dinas ITS dengan teknologi modern untuk efisiensi maksimal.
                </p>
              </div>

              <div>
                <h4 className="font-bold text-lg mb-4">Layanan</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li><a href="#" className="hover:text-[#00AEEF] transition focus:outline-none focus:ring-2 focus:ring-[#00AEEF]" tabIndex={0}>Peminjaman Kendaraan</a></li>
                  <li><a href="#" className="hover:text-[#00AEEF] transition focus:outline-none focus:ring-2 focus:ring-[#00AEEF]" tabIndex={0}>Jadwal Maintenance</a></li>
                  <li><a href="#" className="hover:text-[#00AEEF] transition focus:outline-none focus:ring-2 focus:ring-[#00AEEF]" tabIndex={0}>Laporan Penggunaan</a></li>
                  <li><a href="#" className="hover:text-[#00AEEF] transition focus:outline-none focus:ring-2 focus:ring-[#00AEEF]" tabIndex={0}>Bantuan</a></li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-lg mb-4">Kontak</h4>
                <ul className="space-y-2 text-sm text-gray-400">
                  <li className="flex items-center gap-2">
                    <IconMapPin className="w-4 h-4 text-[#00AEEF]" aria-hidden="true" />
                    <span>Kampus ITS Sukolilo, Surabaya 60111</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <IconPhone className="w-4 h-4 text-[#00AEEF]" aria-hidden="true" />
                    <span>(031) 599-1234</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <IconMail className="w-4 h-4 text-[#00AEEF]" aria-hidden="true" />
                    <span>transportasi@its.ac.id</span>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="font-bold text-lg mb-4">Ikuti Kami</h4>
                <div className="flex gap-3">
                  {[
                    { icon: IconBrandFacebook, href: "#", label: "Facebook" },
                    { icon: IconBrandInstagram, href: "#", label: "Instagram" },
                    { icon: IconBrandLinkedin, href: "#", label: "LinkedIn" },
                    { icon: IconBrandYoutube, href: "#", label: "YouTube" },
                  ].map((social, i) => (
                    <motion.a
                      key={`${uid}-social-${i}`}
                      href={social.href}
                      whileHover={{ scale: 1.15, rotate: 5 }}
                      className="w-9 h-9 bg-gray-800 rounded-xl flex items-center justify-center hover:bg-[#00AEEF] transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-[#00AEEF]"
                      aria-label={`Ikuti kami di ${social.label}`}
                      tabIndex={0}
                    >
                      <social.icon className="w-5 h-5" aria-hidden="true" />
                    </motion.a>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-10 pt-6 border-t border-gray-800 text-center text-sm text-gray-500">
              <p>© 2025 <span className="text-[#00AEEF] font-bold">Institut Teknologi Sepuluh Nopember</span>. Hak Cipta Dilindungi.</p>
              <p className="mt-2">Sistem Peminjaman Kendaraan • Bagian Umum & Transportasi</p>
            </div>
          </div>
        </footer>
      </div>
    </LazyMotion>
  );
}