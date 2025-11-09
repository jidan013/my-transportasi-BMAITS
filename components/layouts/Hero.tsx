// components/layout/Hero.tsx
"use client";

import { motion } from "framer-motion";
import { IconPlus, IconHistory } from "@tabler/icons-react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// === Konfigurasi Animasi Ringan ===
const heroVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const wordVariants = {
  hidden: { y: 80, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: { delay: i * 0.15, duration: 0.5 },
  }),
};

const buttonVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { delay: 0.6 } },
};

export default function Hero() {
  const reduced = useReducedMotion();

  // Daftar kata untuk animasi
  const words = ["Biro", "Manajemen", "Aset"];

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 py-12 overflow-hidden">
      {/* Gradient Background - Static */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#001F5B]/90 via-[#002D72] to-[#00AEEF]/80" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10" />

      {/* Blob Animasi - Hanya jika tidak reduced motion */}
      {!reduced && (
        <div className="absolute inset-0 pointer-events-none">
          <motion.div
            animate={{ scale: [1, 1.15, 1], x: [-10, 10, -10] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="absolute top-16 left-16 w-56 h-56 bg-[#00AEEF]/25 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ scale: [1.15, 1, 1.15], x: [10, -10, 10] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
            className="absolute bottom-16 right-16 w-44 h-44 bg-[#FFC107]/15 rounded-full blur-3xl"
          />
        </div>
      )}

      {/* Konten Utama */}
      <div className="relative z-10 max-w-7xl mx-auto text-center">
        <motion.div variants={heroVariants} initial="hidden" animate="visible">
          <p className="text-sm sm:text-base font-semibold text-cyan-200 tracking-widest uppercase mb-6">
            Sistem Peminjaman Kendaraan Dinas
          </p>

          {/* Judul dengan Animasi Kata */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
            {words.map((word, i) => (
              <motion.span
                key={i}
                custom={i}
                variants={reduced ? {} : wordVariants}
                initial="hidden"
                animate="visible"
                className="inline-block"
              >
                <span
                  className={`bg-clip-text text-transparent bg-gradient-to-r ${
                    i === 0
                      ? "from-white to-cyan-100"
                      : i === 1
                      ? "from-[#00AEEF] to-[#FFC107]"
                      : "from-[#FFC107] to-[#00AEEF]"
                  }`}
                >
                  {word}{" "}
                </span>
              </motion.span>
            ))}
          </h1>

          <p className="text-base sm:text-lg md:text-xl text-white/80 max-w-3xl mx-auto font-light mb-8">
            Platform modern untuk pengelolaan armada institusi dengan efisiensi, transparansi, dan kemudahan.
          </p>
        </motion.div>

        {/* Tombol */}
        <motion.div
          variants={buttonVariants}
          initial="hidden"
          animate="visible"
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <motion.button
            whileHover={!reduced ? { scale: 1.05, y: -3 } : {}}
            whileTap={{ scale: 0.95 }}
            className="group relative px-8 py-3 bg-white text-[#002D72] font-semibold text-base rounded-xl shadow-xl overflow-hidden transition-all"
            aria-label="Ajukan Peminjaman"
          >
            <span className="relative z-10 flex items-center gap-2">
              <IconPlus className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
              Ajukan Peminjaman
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#002D72] to-[#00AEEF] opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
          </motion.button>

          <motion.button
            whileHover={!reduced ? { scale: 1.05, y: -3 } : {}}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-3 bg-white/10 backdrop-blur-xl text-white font-semibold text-base rounded-xl border border-white/30 shadow-xl flex items-center gap-2 hover:bg-white/20 transition-all"
            aria-label="Lihat Riwayat"
          >
            <IconHistory className="w-5 h-5" />
            Lihat Riwayat
          </motion.button>
        </motion.div>
      </div>

      {/* Scroll Indicator - Hanya jika tidak reduced motion */}
      {!reduced && (
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 w-8 h-14 border-2 border-white/50 rounded-full flex justify-center"
          aria-hidden="true"
        >
          <motion.div
            animate={{ y: [0, 16, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            className="w-1.5 h-3 bg-white/70 rounded-full mt-2"
          />
        </motion.div>
      )}
    </section>
  );
}