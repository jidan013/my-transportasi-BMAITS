"use client";
import { useState, useEffect, useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useInView,
  AnimatePresence,
  LazyMotion,
  domAnimation,
} from "framer-motion";
import {
  IconCar,
  IconCircleCheckFilled,
  IconUsers,
  IconAlertCircle,
  IconCalendar,
  IconMoon,
  IconSun,
  IconHistory,
  IconPlus,
  IconChevronRight,
  IconSearch,
  IconTools,
  IconAlertTriangle,
  IconStar,
  IconShieldCheck,
  IconHeadset,
  IconQuote,
  IconTrendingUp,
  IconClock,
} from "@tabler/icons-react";

// ITS Color Palette
const ITS = {
  primary: "#002D72",
  secondary: "#00AEEF",
  accent: "#FFC107",
  dark: "#4A4A4A",
  light: "#E5E5E5",
  white: "#FFFFFF",
};

interface Vehicle {
  id: string;
  name: string;
  type: string;
  plate: string;
  status: "available" | "borrowed" | "maintenance";
  borrower?: string;
  returnDate?: string;
  image?: string;
  year?: number;
  capacity?: string;
}

// Reduced Motion Hook
const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReducedMotion(mediaQuery.matches);
    const handler = (e: MediaQueryListEvent) => setPrefersReducedMotion(e.matches);
    mediaQuery.addEventListener("change", handler);
    return () => mediaQuery.removeEventListener("change", handler);
  }, []);
  return prefersReducedMotion;
};

// Stats Card
function StatsCard({ title, value, icon: Icon, color, bg }: { title: string; value: number; icon: any; color: string; bg: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const reduced = useReducedMotion();

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: reduced ? 0 : 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: reduced ? 0 : 0.4 }}
      whileHover={!reduced ? { y: -4, scale: 1.02 } : {}}
      className="group bg-white dark:bg-gray-800 p-5 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 transition-all duration-200"
    >
      <div className="flex items-center justify-between mb-2">
        <div className={`p-2.5 rounded-lg ${bg}`}>
          <Icon className={`w-5 h-5 ${color}`} />
        </div>
        <IconChevronRight className="w-4 h-4 text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300 transition" />
      </div>
      <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
      <p className="text-xs font-medium text-gray-600 dark:text-gray-400">{title}</p>
    </motion.div>
  );
}

// Status Badge
function StatusBadge({ status, borrower, returnDate }: { status: string; borrower?: string; returnDate?: string }) {
  const today = new Date().toISOString().split("T")[0];
  const isDueToday = returnDate === today;
  const statusConfig = {
    available: { color: "bg-cyan-50 dark:bg-cyan-900/20 text-cyan-700 dark:text-cyan-400 border-cyan-200 dark:border-cyan-800", icon: IconCircleCheckFilled, label: "Tersedia" },
    borrowed: { color: "bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800", icon: IconUsers, label: "Dipinjam" },
    maintenance: { color: "bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800", icon: IconTools, label: "Maintenance" },
  };
  const config = statusConfig[status as keyof typeof statusConfig];
  const Icon = config.icon;

  return (
    <div className="w-full flex flex-col gap-1.5">
      <div className="flex items-center gap-2 flex-wrap">
        <span className={`inline-flex items-center gap-1.5 px-3 py-1 ${config.color} border rounded-full font-medium text-xs`}>
          <Icon className="w-4 h-4" />
          {config.label}
        </span>
        {isDueToday && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300 border border-yellow-300 dark:border-yellow-700 rounded-full text-xs font-bold animate-pulse">
            <IconAlertTriangle className="w-3.5 h-3.5" />
            Hari Ini
          </span>
        )}
      </div>
      {status === "borrowed" && borrower && returnDate && (
        <div className="text-right text-xs">
          <p className="font-medium text-orange-700 dark:text-orange-400">{borrower}</p>
          <p className="text-gray-500 dark:text-gray-400 flex items-center gap-1 justify-end">
            <IconCalendar className="w-3 h-3" />
            {new Date(returnDate).toLocaleDateString("id-ID", { day: "numeric", month: "short" })}
          </p>
        </div>
      )}
    </div>
  );
}

// Mini Chart Component
function MiniChart({ data, color }: { data: number[]; color: string }) {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-1 h-16">
      {data.map((val, i) => (
        <div
          key={i}
          className={`flex-1 ${color} rounded-t-sm transition-all duration-500`}
          style={{ height: `${(val / max) * 100}%` }}
        />
      ))}
    </div>
  );
}

export default function VehicleLoanDashboard() {
  const [darkMode, setDarkMode] = useState(false);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"available" | "borrowed" | "maintenance" | null>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const heroOpacity = useTransform(scrollYProgress, [0, 0.2], [1, 0.7]);
  const heroScale = useTransform(scrollYProgress, [0, 0.2], [1, 0.98]);

  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
  }, [darkMode]);

  const vehicles: Vehicle[] = [
    { id: "1", name: "Toyota Avanza", type: "MPV", plate: "B 1234 XYZ", status: "available", image: "https://images.unsplash.com/photo-1590650046871-92c887180603?auto=format&fit=crop&w=600", year: 2022, capacity: "7 Penumpang" },
    { id: "2", name: "Honda Jazz", type: "Hatchback", plate: "B 5678 ABC", status: "borrowed", borrower: "Andi", returnDate: "2025-10-29", image: "https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=600", year: 2020, capacity: "5 Penumpang" },
    { id: "3", name: "Daihatsu Xenia", type: "MPV", plate: "B 9012 DEF", status: "available", image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?auto=format&fit=crop&w=600", year: 2021, capacity: "7 Penumpang" },
    { id: "4", name: "Suzuki Ertiga", type: "MPV", plate: "B 3456 GHI", status: "borrowed", borrower: "Budi", returnDate: "2025-11-01", image: "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?auto=format&fit=crop&w=600", year: 2023, capacity: "7 Penumpang" },
    { id: "5", name: "Mitsubishi Pajero", type: "SUV", plate: "B 7890 JKL", status: "maintenance", image: "https://images.unsplash.com/photo-1507136566006-8bb97875d4e5?auto=format&fit=crop&w=600", year: 2019, capacity: "5 Penumpang" },
  ];

  const today = new Date().toISOString().split("T")[0];
  const stats = {
    total: vehicles.length,
    available: vehicles.filter((v) => v.status === "available").length,
    borrowed: vehicles.filter((v) => v.status === "borrowed").length,
    maintenance: vehicles.filter((v) => v.status === "maintenance").length,
    dueToday: vehicles.filter((v) => v.status === "borrowed" && v.returnDate === today).length,
  };

  const filteredVehicles = vehicles.filter(
    (v) =>
      (v.name.toLowerCase().includes(search.toLowerCase()) || v.plate.toLowerCase().includes(search.toLowerCase())) &&
      (!filterStatus || v.status === filterStatus)
  );

  // Data statistik bulanan (dummy)
  const monthlyData = [12, 19, 15, 25, 22, 30];

  return (
    <LazyMotion features={domAnimation}>
      <div className={`min-h-screen transition-colors duration-300 ${darkMode ? "dark bg-gray-950" : "bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-50"}`}>
        {/* Sticky Header */}
        <motion.div
          initial={{ y: -80 }}
          animate={{ y: 0 }}
          transition={{ type: "spring", stiffness: 150, damping: 20 }}
          className="sticky top-0 z-50 bg-white/90 dark:bg-gray-900/90 backdrop-blur-md border-b border-gray-200 dark:border-gray-800"
        >
          <div className="max-w-7xl mx-auto px-5 py-3.5 flex items-center justify-between text-sm">
            <div className="flex items-center gap-5 font-medium">
              {[
                { label: "Armada", value: stats.total, icon: IconCar, color: "text-[#002D72] dark:text-[#00AEEF]" },
                { label: "Tersedia", value: stats.available, icon: IconCircleCheckFilled, color: "text-cyan-600 dark:text-cyan-400" },
                { label: "Dipinjam", value: stats.borrowed, icon: IconUsers, color: "text-orange-600 dark:text-orange-400" },
                { label: "Jatuh Tempo", value: stats.dueToday, icon: IconAlertTriangle, color: "text-[#FFC107]" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -15 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="flex items-center gap-1.5"
                >
                  <stat.icon className={`w-4.5 h-4.5 ${stat.color}`} />
                  <span className="text-gray-600 dark:text-gray-400">{stat.label}:</span>
                  <span className={`font-bold ${stat.color}`}>{stat.value}</span>
                </motion.div>
              ))}
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {darkMode ? <IconSun className="w-4.5 h-4.5 text-yellow-500" /> : <IconMoon className="w-4.5 h-4.5 text-gray-700" />}
            </button>
          </div>
        </motion.div>

        {/* HERO SECTION - ULTRA PREMIUM & RINGAN */}
        <motion.section
          style={{ opacity: heroOpacity, scale: heroScale }}
          className="relative min-h-screen flex items-center justify-center overflow-hidden px-5"
        >
          {/* Gradient Background */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#001F5B] via-[#002D72] to-[#00AEEF]/90" />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-5" />

          {/* 3D Floating Car SVG */}
          <motion.div
            animate={!reduced ? { y: [-20, -40, -20], rotate: [0, 3, -3, 0] } : {}}
            transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-1/4 -right-10 md:right-10 w-64 md:w-80 opacity-30 pointer-events-none"
          >
            <svg viewBox="0 0 300 150" fill="none" xmlns="http://www.w3.org/2000/svg" className="drop-shadow-2xl">
              <path d="M40 100 L60 80 Q80 60 110 60 L190 60 Q220 60 240 80 L260 100" stroke="white" strokeWidth="12" fill="none" />
              <circle cx="80" cy="110" r="18" fill="white" />
              <circle cx="220" cy="110" r="18" fill="white" />
              <path d="M100 70 L200 70 L190 85 L110 85 Z" fill="white" opacity="0.3" />
            </svg>
          </motion.div>

          {/* Glow Orbs */}
          <div className="absolute inset-0 pointer-events-none">
            <div className="absolute top-20 left-20 w-96 h-96 bg-[#00AEEF]/30 rounded-full blur-3xl animate-pulse" />
            <div className="absolute bottom-20 right-20 w-80 h-80 bg-[#FFC107]/20 rounded-full blur-3xl animate-pulse delay-700" />
          </div>

          <div className="relative z-10 max-w-5xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <p className="text-xs md:text-sm font-medium text-cyan-200 tracking-widest uppercase mb-4">
                Sistem Peminjaman Kendaraan Dinas
              </p>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-5 leading-tight">
                <motion.span
                  className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-white"
                  initial={{ y: 60, rotateX: -60 }}
                  animate={{ y: 0, rotateX: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  ITS
                </motion.span>{" "}
                <motion.span
                  className="inline-block bg-clip-text text-transparent bg-gradient-to-r from-[#00AEEF] to-[#FFC107]"
                  initial={{ y: 60, rotateX: -60 }}
                  animate={{ y: 0, rotateX: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  FLEET
                </motion.span>
              </h1>
              <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-light">
                Kelola armada dengan presisi, transparansi, dan teknologi terkini.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mt-10"
            >
              <motion.button
                whileHover={!reduced ? { scale: 1.05, y: -4, boxShadow: "0 20px 40px rgba(0,45,114,0.4)" } : {}}
                whileTap={{ scale: 0.95 }}
                className="group relative px-8 py-4 bg-white text-[#002D72] font-bold rounded-xl shadow-lg overflow-hidden"
              >
                <span className="relative z-10 flex items-center gap-2 justify-center">
                  <IconPlus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-500" />
                  Ajukan Peminjaman
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-[#002D72] to-[#00AEEF] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
              </motion.button>
              <motion.button
                whileHover={!reduced ? { scale: 1.05, y: -4 } : {}}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-white/10 backdrop-blur text-white font-bold rounded-xl border border-white/30 flex items-center gap-2 justify-center hover:bg-white/20 transition"
              >
                <IconHistory className="w-5 h-5" />
                Riwayat
              </motion.button>
            </motion.div>
          </div>

          {/* Scroll Indicator */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 w-7 h-12 border-2 border-white/40 rounded-full flex justify-center"
          >
            <motion.div
              animate={{ y: [0, 15, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              className="w-1 h-2 bg-white/60 rounded-full mt-2"
            />
          </motion.div>
        </motion.section>

        {/* STATISTIK PENGGUNAAN BULANAN */}
        <section className="py-20 px-5 bg-gradient-to-b from-transparent to-gray-50 dark:to-gray-900">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-center mb-12 flex items-center justify-center gap-3"
            >
              <IconTrendingUp className="w-10 h-10 text-[#002D72]" />
              Statistik Bulanan
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: "Total Peminjaman", value: 123, trend: "+12%", color: "bg-gradient-to-r from-[#002D72] to-[#00AEEF]" },
                { label: "Rata-rata Durasi", value: "3.2 hari", trend: "-0.5 hari", color: "bg-gradient-to-r from-orange-500 to-red-500" },
                { label: "Tepat Waktu", value: "94%", trend: "+2%", color: "bg-gradient-to-r from-emerald-500 to-teal-500" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700"
                >
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400">{item.label}</p>
                    <span className={`text-xs font-bold ${item.trend.startsWith("+") ? "text-emerald-600" : "text-red-600"}`}>
                      {item.trend}
                    </span>
                  </div>
                  <p className="text-3xl font-black text-gray-900 dark:text-white">{item.value}</p>
                  <div className="mt-3">
                    <MiniChart data={monthlyData} color={item.color} />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* FITUR UNGGULAN */}
        <section className="py-20 px-5">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-center mb-12"
            >
              Mengapa <span className="text-[#002D72]">ITS Fleet</span>?
            </motion.h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { icon: IconShieldCheck, title: "100% Aman", desc: "Enkripsi & otorisasi berlapis", color: "from-emerald-400 to-cyan-500" },
                { icon: IconHeadset, title: "24/7 Support", desc: "Tim siap bantu kapan saja", color: "from-blue-500 to-cyan-600" },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-100 dark:border-gray-700"
                >
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${item.color} p-2.5 mb-4`}>
                    <item.icon className="w-full h-full text-white" />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* DAFTAR KENDARAAN */}
        <section className="py-16 px-5">
          <div className="max-w-7xl mx-auto">
            <motion.h2
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-2"
            >
              <IconCar className="w-8 h-8 text-[#002D72]" />
              Daftar Kendaraan
            </motion.h2>

            <div className="flex flex-col sm:flex-row gap-3 mb-6">
              <div className="relative flex-1">
                <IconSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Cari nama atau plat..."
                  className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#002D72]"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {["all", "available", "borrowed", "maintenance"].map((key) => {
                  const filters = {
                    all: { label: "Semua", icon: IconCar, value: null },
                    available: { label: "Tersedia", icon: IconCircleCheckFilled, value: "available" },
                    borrowed: { label: "Dipinjam", icon: IconUsers, value: "borrowed" },
                    maintenance: { label: "Maintenance", icon: IconTools, value: "maintenance" },
                  };
                  const f = filters[key as keyof typeof filters];
                  return (
                    <button
                      key={key}
                      onClick={() => setFilterStatus(f.value)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center gap-1.5 transition ${
                        filterStatus === f.value
                          ? "bg-[#002D72] text-white"
                          : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300"
                      }`}
                    >
                      <f.icon className="w-3.5 h-3.5" />
                      {f.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              <AnimatePresence mode="popLayout">
                {filteredVehicles.map((v, i) => (
                  <motion.div
                    key={v.id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ delay: i * 0.05 }}
                    whileHover={{ y: -5 }}
                    className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700"
                  >
                    <div className="h-40 overflow-hidden">
                      <img
                        src={v.image}
                        alt={v.name}
                        width={600}
                        height={400}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-5">
                      <h3 className="font-bold text-lg">{v.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{v.plate} • {v.year}</p>
                      <div className="mt-3">
                        <StatusBadge status={v.status} borrower={v.borrower} returnDate={v.returnDate} />
                      </div>
                      {v.status === "available" && (
                        <motion.button
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}
                          className="mt-4 w-full py-2.5 bg-gradient-to-r from-[#002D72] to-[#00AEEF] text-white font-bold rounded-lg text-sm"
                        >
                          Pinjam Sekarang
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        </section>

        {/* FOOTER */}
        <footer className="py-8 border-t border-gray-200 dark:border-gray-800 text-center text-xs text-gray-600 dark:text-gray-400">
          <p>© 2025 Institut Teknologi Sepuluh Nopember</p>
          <p className="mt-1">Sistem Peminjaman Kendaraan • Bagian Umum & Transportasi</p>
        </footer>
      </div>
    </LazyMotion>
  );
}