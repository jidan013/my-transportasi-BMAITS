"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";

/* =====================
   TYPE
===================== */
interface LoginFormData {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  redirectTo?: string;
}

/* =====================
   DUMMY ADMIN (DEV ONLY)
===================== */
const DUMMY_ADMIN = {
  email: "admin@its.ac.id",
  password: "admin123",
  token: "dummy-admin-token",
};

/* =====================
   COMPONENT
===================== */
export default function AdminLoginPage() {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const router = useRouter();

  const handleInputChange = useCallback(
    (field: keyof LoginFormData) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({ ...prev, [field]: e.target.value }));
        if (error) setError("");
      },
    [error]
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      /* ===== DUMMY LOGIN ===== */
      if (
        formData.email === DUMMY_ADMIN.email &&
        formData.password === DUMMY_ADMIN.password
      ) {
        localStorage.setItem("adminToken", DUMMY_ADMIN.token);
        router.push("/adminbma/dashboard");
        return;
      }

      /* ===== API LOGIN ===== */
      const res = await fetch("/api/auth/admin-login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Login gagal. Akses admin ditolak.");
      }

      const data: LoginResponse = await res.json();
      localStorage.setItem("adminToken", data.token);

      router.push(data.redirectTo || "/adminbma/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Terjadi kesalahan");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-200 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-xl shadow-xl rounded-2xl border border-slate-200/50 p-8 space-y-6">
        <div className="text-center space-y-2">
          <div className="w-16 h-16 mx-auto bg-gradient-to-r from-black to-slate-800 rounded-2xl flex items-center justify-center shadow-lg">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
          </div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Admin Panel
          </h1>
          <p className="text-sm text-slate-600">
            Masukkan kredensial admin
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-800 text-sm">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Email Admin
            </label>
            <input
              type="email"
              required
              disabled={isLoading}
              value={formData.email}
              onChange={handleInputChange("email")}
              placeholder="admin@its.ac.id"
              className="w-full px-4 py-3 border rounded-xl"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">
              Kata Sandi
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                disabled={isLoading}
                value={formData.password}
                onChange={handleInputChange("password")}
                placeholder="••••••••"
                className="w-full px-4 py-3 border rounded-xl pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-black text-white py-3 rounded-xl flex justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="animate-spin" /> Memproses
              </>
            ) : (
              "Masuk Admin"
            )}
          </button>
        </form>

        <p className="text-xs text-center text-slate-500">
          Khusus administrator berwenang
        </p>
      </div>
    </div>
  );
}
