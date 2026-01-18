"use client";

import { useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, CheckCircle } from "lucide-react";

import { loginAdmin } from "@/lib/services/auth-service";
import type { LoginPayload, LoginResponse, Admin } from "@/types/auth";

interface FormState {
  email: string;
  password: string;
}

export default function AdminLoginPage() {
  const router = useRouter();

  const [formData, setFormData] = useState<FormState>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = useCallback(
    (field: keyof FormState) =>
      (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData((prev) => ({
          ...prev,
          [field]: e.target.value,
        }));
        if (error) setError(null); // Clear error on input
      },
    [error]
  );

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res: LoginResponse = await loginAdmin(formData);

      if (res.access_token) {
        localStorage.setItem("admin_token", res.access_token);
        localStorage.setItem("admin_user", JSON.stringify(res.user));
        
        setSuccess(true);
        
        setTimeout(() => {
          router.push("/adminbma/dashboard");
        }, 1500);
      } else {
        throw new Error("Token tidak ditemukan");
      }
      
      if (!res.success) {
        throw new Error(res.message || "Email atau password salah");
      }

      if (!res.user || res.user.role !== "admin") {
        throw new Error("Akun bukan administrator");
      }

      setSuccess(true);
      
      setTimeout(() => {
        router.push("/adminbma/dashboard");
        router.refresh(); // Force refresh untuk update session
      }, 2000);

    } catch (err: unknown) {
      let message = "Login gagal. Akses administrator ditolak.";

      if (err instanceof Error) {
        message = err.message;
      }

      setError(message);
      
      // Redirect dengan error query param yang benar
      // router.push(`/adminbma/login?error=${encodeURIComponent(message)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
        {/* HEADER */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-slate-900">Admin Panel</h1>
          <p className="text-sm text-slate-600">
            Masuk menggunakan akun administrator
          </p>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* EMAIL */}
          <input
            type="email"
            required
            autoComplete="username"
            disabled={loading || success}
            value={formData.email}
            onChange={handleChange("email")}
            placeholder="example@its.ac.id"
            className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:ring-2 focus:ring-black outline-none disabled:bg-slate-100 transition-colors"
            aria-invalid={!!error}
            aria-describedby={error ? "error-message" : undefined}
          />

          {/* PASSWORD */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
              disabled={loading || success}
              value={formData.password}
              onChange={handleChange("password")}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 pr-12 focus:ring-2 focus:ring-black outline-none disabled:bg-slate-100 transition-colors"
              aria-invalid={!!error}
              aria-describedby={error ? "error-message" : undefined}
            />
            <button
              type="button"
              disabled={loading || success}
              onClick={() => setShowPassword((v) => !v)}
              className="absolute inset-y-0 right-3 flex items-center text-slate-500 hover:text-slate-700 disabled:opacity-50 transition-colors"
              aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading || success}
            className="w-full bg-black text-white py-3 rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed hover:bg-black/90"
          >
            {loading && !success && (
              <>
                <Loader2 className="animate-spin" size={18} />
                Memproses...
              </>
            )}
            {success && (
              <>
                <CheckCircle size={18} />
                Login Berhasil!
              </>
            )}
            {!loading && !success && "Masuk Admin"}
          </button>
        </form>

        {/* SUCCESS MESSAGE */}
        {success && !error && (
          <p className="text-sm text-green-600 text-center animate-pulse">
            Login berhasil, mengalihkan ke dashboard...
          </p>
        )}

        {/* FOOTER */}
        <p className="text-xs text-center text-slate-500">
          Akses terbatas untuk administrator berwenang
        </p>
      </div>
    </div>
  );
}
