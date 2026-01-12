'use client';
import Footer from "@/components/layouts/Footer";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#002244] via-[#003366] to-[#00509e] flex flex-col relative overflow-hidden">
      {/* Animated ITS Pattern Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.1),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.05),transparent_50%)]"></div>
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(-45deg,transparent_48%,rgba(255,255,255,0.025)_50%,transparent_52%)] animate-shift" />
        <div className="absolute top-0 left-0 w-full h-full bg-[linear-gradient(45deg,transparent_48%,rgba(255,255,255,0.025)_50%,transparent_52%)] animate-shift" style={{animationDelay: '2s'}} />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-8 relative z-10">
        <div className="max-w-lg w-full mx-auto text-center">
          {/* ITS Floating Logo Effect */}
          <div className="mx-auto w-32 h-32 mb-8 bg-gradient-to-br from-[#003366]/90 to-[#00509e]/90 backdrop-blur-sm rounded-3xl flex items-center justify-center shadow-2xl border-4 border-white/20 group hover:scale-110 hover:border-white/40 transition-all duration-700 hover:shadow-[#003366]/50">
            <svg className="w-20 h-20 text-white/95 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          {/* Status Code - ITS Style */}
          <div className="mb-8">
            <div className="inline-flex items-center px-6 py-3 bg-white/10 backdrop-blur-sm rounded-2xl border border-white/20 mb-4">
              <h1 className="text-5xl md:text-6xl font-black bg-gradient-to-r from-white via-yellow-100 to-yellow-200 bg-clip-text text-transparent drop-shadow-2xl tracking-tight">
                404
              </h1>
            </div>
          </div>

          {/* ITS Title */}
          <h2 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-white via-yellow-50 to-yellow-200 bg-clip-text text-transparent mb-8 leading-tight drop-shadow-2xl">
            HALAMAN HILANG
          </h2>

          {/* Messages */}
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 border border-white/20 mb-10 shadow-xl">
            <p className="text-2xl font-bold text-white/95 mb-6 leading-relaxed">
              Maaf, halaman yang dicari 
              <span className="block text-3xl bg-gradient-to-r from-yellow-300 to-yellow-400 bg-clip-text text-transparent drop-shadow-lg">
                tidak ditemukan
              </span>
            </p>
            <p className="text-lg text-white/80 mb-8 leading-relaxed">
              Mungkin URL salah ketik atau halaman telah dipindahkan oleh sistem ITS.
            </p>
            
            {/* Search Effect */}
            <div className="flex items-center justify-center gap-3 text-white/70 mb-8 p-4 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10">
              <div className="w-6 h-6 border-2 border-white/50 rounded-full flex items-center justify-center animate-pulse">
                <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
              </div>
              <span className="text-sm font-medium">Sistem sedang mencari...</span>
            </div>
          </div>

          {/* ITS Action Buttons */}
          <div className="flex flex-col lg:flex-row gap-4 justify-center items-center mb-12">
            <button
              onClick={() => window.history.back()}
              className="group relative px-10 py-5 bg-white/10 backdrop-blur-sm text-white font-bold text-xl rounded-2xl shadow-2xl hover:shadow-white/20 hover:shadow-2xl border border-white/20 hover:border-white/40 transition-all duration-500 hover:-translate-y-2 hover:bg-white/20 flex items-center gap-3"
            >
              <svg className="w-6 h-6 group-hover:-translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Kembali
            </button>
            
            <Link
              href="/"
              className="group relative px-10 py-5 bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 hover:from-yellow-500 hover:via-yellow-600 hover:to-yellow-700 text-gray-900 font-black text-xl rounded-2xl shadow-2xl hover:shadow-yellow-500/25 hover:shadow-2xl border-2 border-yellow-400/50 hover:border-yellow-500/80 transition-all duration-500 hover:-translate-y-2 transform hover:scale-[1.02] flex items-center gap-3"
            >
              <svg className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              Beranda
            </Link>
          </div>
        </div>
      </div>

      {/* Footer - Fixed Position */}
      <div className="relative z-20">
        <Footer />
      </div>

      <style jsx>{`
        @keyframes shift {
          0%, 100% { transform: translateZ(0) translateX(0); }
          50% { transform: translateZ(0) translateX(-100px); }
        }
        .animate-shift {
          animation: shift 20s infinite linear;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
      `}</style>
    </div>
  );   
}
