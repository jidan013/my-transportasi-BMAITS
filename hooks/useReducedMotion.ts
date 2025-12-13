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
    // Cegah error saat SSR
    if (typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    
    // Set initial state
    setPrefersReducedMotion(mediaQuery.matches);
    
    // Handler dengan proper typing
    const handler = (event: MediaQueryListEvent) => {
      setPrefersReducedMotion(event.matches);
    };
    
    // Add listener (modern browsers support addEventListener)
    mediaQuery.addEventListener("change", handler);

    // Cleanup
    return () => {
      mediaQuery.removeEventListener("change", handler);
    };
  }, []);

  return prefersReducedMotion;
};
