'use client';

import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";

export default function Hero() {
  const words = ["Biro", "Manajemen", "Aset"] as const;

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden px-4 py-16 md:py-20">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#001f5b] via-[#002d72] to-[#00aeef]/90" />
      <div
        className="absolute inset-0 opacity-10 mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')",
          backgroundSize: "300px",
        }}
      />

      
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-10 left-10 w-80 h-80 bg-cyan-400/20 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "0s" }}
        />
        <div
          className="absolute bottom-10 right-10 w-72 h-72 bg-amber-400/15 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "4s" }}
        />
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto text-center">
        {/* Subtitle */}
        <p className="text-sm md:text-base font-semibold text-cyan-200 tracking-widest uppercase mb-6 animate-fade-up">
          Sistem Peminjaman Kendaraan Dinas
        </p>

        {/* Animated Title */}
        <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-7xl font-extrabold text-white mb-8 leading-tight">
          {words.map((word, i) => (
            <span
              key={word}
              className="inline-block mx-2 animate-fade-up"
              style={{ animationDelay: `${150 + i * 150}ms` }}
            >
              <span
                className="bg-clip-text text-transparent bg-gradient-to-r"
                style={{
                  backgroundImage:
                    i === 0
                      ? "linear-gradient(90deg, #ffffff, #e0f2fe)"
                      : i === 1
                      ? "linear-gradient(90deg, #00aeef, #ffc107)"
                      : "linear-gradient(90deg, #ffc107, #7dd3fc)",
                }}
              >
                {word}
              </span>
            </span>
          ))}
        </h1>

        {/* Description */}
        <p className="text-lg md:text-xl text-white/80 max-w-3xl mx-auto font-light mb-12 animate-fade-up animation-delay-500">
          Ajukan peminjaman kendaraan dinas dengan mudah, cepat, dan transparan.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center animate-fade-up animation-delay-700">
          <Link
            href="/jadwal"
            className="group relative inline-flex items-center gap-3 px-9 py-4 bg-white text-[#001f5b] font-bold text-lg rounded-2xl shadow-2xl hover:shadow-cyan-500/25 transition-all duration-300 hover:-translate-y-1 active:scale-95"
          >
            <IconPlus className="w-6 h-6 transition-transform duration-500 group-hover:rotate-90" />
            <span>Ajukan Peminjaman</span>

            {/* Hover Effect Overlay */}
            <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-cyan-400 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />
          </Link>
        </div>

        {/* Scroll Hint */}
        <p className="mt-16 text-white/60 text-sm animate-pulse">
          Gulir ke bawah untuk tampilan selanjutnya →
        </p>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-8 h-14 border-2 border-white/40 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-white/60 rounded-full mt-3 animate-bounce" />
        </div>
      </div>

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(5deg); }
        }
        @keyframes fade-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-float {
          animation: float 12s ease-in-out infinite;
        }
        .animate-fade-up {
          animation:global(&) {
            animation: fade-up 0.8s ease-out forwards;
          }
        }
        .animation-delay-500 {
          animation-delay: 500ms;
        }
        .animation-delay-700 {
          animation-delay: 700ms;
        }
      `}</style>
    </section>
  );
}