"use client";

import { JSX, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import axios from "axios";

import { adminLogin } from "@/lib/services/auth";
import type { LoginPayload } from "@/types/auth";

export default function AdminLoginPage(): JSX.Element {
  const router = useRouter();

  const [formData, setFormData] = useState<LoginPayload>({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleChange =
    (field: keyof LoginPayload) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: e.target.value }));
      if (error) setError("");
    };

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ): Promise<void> => {
    e.preventDefault();
    setLoading(true);

    try {
      await adminLogin(formData);
      router.push("/adminbma/dashboard");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message ??
            "Login gagal. Akses administrator ditolak."
        );
      } else {
        setError("Terjadi kesalahan sistem.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 px-4">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl border border-slate-200 p-8 space-y-6">
        {/* HEADER */}
        <div className="text-center space-y-1">
          <h1 className="text-2xl font-bold text-slate-900">
            Admin Panel
          </h1>
          <p className="text-sm text-slate-600">
            Masuk menggunakan akun administrator
          </p>
        </div>

        {/* FORM */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="text-sm text-red-700 bg-red-50 border border-red-200 p-3 rounded-xl">
              {error}
            </div>
          )}

          {/* EMAIL */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">
              Email
            </label>
            <input
              type="email"
              required
              disabled={loading}
              value={formData.email}
              onChange={handleChange("email")}
              placeholder="admin@its.ac.id"
              className="w-full px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-black transition"
            />
          </div>

          {/* PASSWORD */}
          <div className="space-y-1">
            <label className="text-sm font-medium text-slate-700">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                required
                disabled={loading}
                value={formData.password}
                onChange={handleChange("password")}
                placeholder="••••••••"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 pr-12 focus:outline-none focus:ring-2 focus:ring-black transition"
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute inset-y-0 right-3 flex items-center text-slate-500 hover:text-slate-700"
                aria-label="Toggle password visibility"
              >
                {showPassword ? (
                  <EyeOff size={18} />
                ) : (
                  <Eye size={18} />
                )}
              </button>
            </div>
          </div>

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-xl flex justify-center items-center gap-2 hover:bg-slate-900 transition disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2 className="animate-spin" size={18} />
                Memproses
              </>
            ) : (
              "Masuk Admin"
            )}
          </button>
        </form>

        {/* FOOTER */}
        <p className="text-xs text-center text-slate-500">
          Akses terbatas untuk administrator berwenang
        </p>
      </div>
    </div>
  );
}
