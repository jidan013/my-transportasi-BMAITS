"use client";

import { useState, useEffect } from "react";

/**
 * Hook untuk mendeteksi preferensi 'reduced motion' pengguna.
 * Mengembalikan true jika pengguna memilih mengurangi animasi.
 * Aman digunakan di Next.js (tidak error saat SSR).
 */
export const useReducedMotion = () => {
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    // Cegah error "window is not defined" saat server render
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");

    // Update state saat mount
    setPrefersReducedMotion(mediaQuery.matches);

    // Update ketika user ubah preferensi
    const handler = (event: MediaQueryListEvent) =>
      setPrefersReducedMotion(event.matches);

    mediaQuery.addEventListener("change", handler);

    return () => {
      mediaQuery.removeEventListener("change", handler);
    };
  }, []);

  return prefersReducedMotion;
};
