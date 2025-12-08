import { IconPlus, IconHistory } from "@tabler/icons-react";

export default function Hero() {
  const words = ["Biro", "Manajemen", "Aset"];

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 py-12 overflow-hidden">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#001F5B]/90 via-[#002D72] to-[#00AEEF]/80" />
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: "url('https://grainy-gradients.vercel.app/noise.svg')",
          backgroundSize: "200px",
        }}
      />

      {/* Blob Animasi (GPU + will-change) */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          data-aos="fade"
          data-aos-delay="300"
          className="absolute top-16 left-16 w-64 h-64 bg-[#00AEEF]/20 rounded-full"
          style={{
            filter: "blur(70px)",
            willChange: "transform",
            transform: "translateZ(0)",
            animation: "float 8s ease-in-out infinite",
          }}
        />
        <div
          data-aos="fade"
          data-aos-delay="500"
          className="absolute bottom-16 right-16 w-56 h-56 bg-[#FFC107]/15 rounded-full"
          style={{
            filter: "blur(60px)",
            willChange: "transform",
            transform: "translateZ(0)",
            animation: "float2 9s ease-in-out infinite",
          }}
        />
      </div>

      {/* Konten Utama */}
      <div className="relative z-10 max-w-7xl mx-auto text-center">
        {/* Subtitle */}
        <p
          data-aos="fade-up"
          data-aos-delay="100"
          className="text-sm sm:text-base font-semibold text-cyan-200 tracking-widest uppercase mb-6"
        >
          Sistem Peminjaman Kendaraan Dinas
        </p>

        {/* Judul */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
          {words.map((word, i) => (
            <span
              key={word}
              data-aos="fade-up"
              data-aos-delay={150 + i * 100}
              className="inline-block mx-1"
            >
              <span
                className="bg-clip-text text-transparent bg-gradient-to-r"
                style={{
                  backgroundImage: `linear-gradient(90deg, ${
                    i === 0
                      ? "#ffffff, #cffafe"
                      : i === 1
                      ? "#00AEEF, #FFC107"
                      : "#FFC107, #00AEEF"
                  })`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                {word}
              </span>
            </span>
          ))}
        </h1>

        {/* Deskripsi */}
        <p
          data-aos="fade-up"
          data-aos-delay="500"
          className="text-base sm:text-lg md:text-xl text-white/80 max-w-3xl mx-auto font-light mb-10"
        >
          Ajukan peminjaman kendaraan dinas dengan mudah dan cepat.
        </p>

        {/* Tombol */}
        <div
          data-aos="fade-up"
          data-aos-delay="600"
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <button
            className="group relative px-8 py-3 bg-white text-[#002D72] font-semibold text-base rounded-xl shadow-lg overflow-hidden transition-transform duration-200 active:scale-95"
            style={{ transform: "translateZ(0)" }}
            aria-label="Ajukan Peminjaman"
          >
            <span className="relative z-10 flex items-center gap-2">
              <IconPlus className="w-5 h-5 transition-transform duration-300 group-hover:rotate-90" />
              Ajukan Peminjaman
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-[#002D72] to-[#00AEEF] scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-300" />
          </button>

          <button
            className="px-8 py-3 bg-white/10 backdrop-blur-sm text-white font-semibold text-base rounded-xl border border-white/20 flex items-center gap-2 hover:bg-white/15 transition-colors duration-200"
            style={{ transform: "translateZ(0)" }}
            aria-label="Lihat Riwayat"
          >
            <IconHistory className="w-5 h-5" />
            Lihat Riwayat
          </button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div
        data-aos="fade"
        data-aos-delay="800"
        className="absolute bottom-8 left-1/2 -translate-x-1/2 w-8 h-12 border-2 border-white/40 rounded-full flex justify-center"
        style={{ animation: "bounce 1.8s ease-in-out infinite" }}
      >
        <div
          className="w-1 h-2 bg-white/60 rounded-full mt-2"
          style={{ animation: "bounceInner 1.8s ease-in-out infinite" }}
        />
      </div>
    </section>
  );
}