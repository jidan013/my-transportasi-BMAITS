"use client";

import { useEffect, useState } from "react";
import { IconSun, IconMoon } from "@tabler/icons-react";

export default function DarkModeToggle() {
  const [darkMode, setDarkMode] = useState(false);

  // 🔹 Inisialisasi mode dari localStorage
  useEffect(() => {
    const saved = localStorage.getItem("its-dark-mode");
    const isDark = saved ? JSON.parse(saved) : false;
    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  // 🔹 Simpan preferensi & update DOM
  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
    localStorage.setItem("its-dark-mode", JSON.stringify(darkMode));
  }, [darkMode]);

  return (
    <button
      onClick={() => setDarkMode((prev) => !prev)}
      className={`
        group relative p-3 rounded-2xl overflow-hidden 
        transition-all duration-500 shadow-lg border
        focus:outline-none focus:ring-4 focus:ring-[#00AEEF]/30
        ${darkMode
          ? "bg-gradient-to-br from-[#002D72] to-[#00AEEF] border-[#00AEEF]/40"
          : "bg-white border-gray-200 dark:bg-gray-800 dark:border-gray-700"
        }
      `}
      aria-label={darkMode ? "Aktifkan mode terang" : "Aktifkan mode gelap"}
    >
      {/* Glow Background */}
      {darkMode && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#00AEEF]/20 to-[#002D72]/30 blur-xl -z-10" />
      )}

      {/* Icon */}
      <div className="relative w-6 h-6 flex items-center justify-center">
        <IconSun
          className={`absolute w-5 h-5 text-[#FFC107] transition-all duration-500 ${
            darkMode
              ? "opacity-100 scale-100 rotate-0"
              : "opacity-0 scale-0 -rotate-180"
          }`}
        />
        <IconMoon
          className={`absolute w-5 h-5 transition-all duration-500 ${
            darkMode
              ? "opacity-0 scale-0 rotate-180 text-[#00AEEF]"
              : "opacity-100 scale-100 rotate-0 text-[#002D72] dark:text-[#00AEEF]"
          }`}
        />
      </div>

      {/* Hover Ripple */}
      <span
        className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
          darkMode ? "bg-[#00AEEF]/20" : "bg-gray-200/30"
        }`}
      />
    </button>
  );
}
