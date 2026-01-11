"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { CheckCircle, XCircle, ArrowRight } from "lucide-react";

export default function ValidationPage() {
  const params = useSearchParams();
  const router = useRouter();

  const status = params.get("status");
  const message = params.get("message");

  const isSuccess = status === "success";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 text-center space-y-6">
        {isSuccess ? (
          <>
            <CheckCircle className="mx-auto text-green-600" size={64} />
            <h1 className="text-2xl font-bold text-slate-900">
              Login Berhasil
            </h1>
            <p className="text-slate-600 text-sm">
              Autentikasi administrator berhasil.  
              Anda akan diarahkan ke dashboard.
            </p>

            <button
              onClick={() => router.push("/adminbma/dashboard")}
              className="w-full bg-black text-white py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-slate-900 transition"
            >
              Ke Dashboard
              <ArrowRight size={18} />
            </button>
          </>
        ) : (
          <>
            <XCircle className="mx-auto text-red-600" size={64} />
            <h1 className="text-2xl font-bold text-slate-900">
              Login Gagal
            </h1>
            <p className="text-red-600 text-sm">
              {message ?? "Akses administrator ditolak"}
            </p>

            <button
              onClick={() => router.push("/adminbma/login")}
              className="w-full bg-black text-white py-3 rounded-xl hover:bg-slate-900 transition"
            >
              Kembali ke Login
            </button>
          </>
        )}
      </div>
    </div>
  );
}
