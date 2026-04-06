"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { loginAdmin, getAdminMe } from "@/lib/services/auth-service";
import type { LoginResponse, LoginPayload } from "@/types/auth";
import type { AxiosError } from "axios";

export default function AdminLoginPage() {
  const router = useRouter();

  const [credentials, setCredentials] = useState<LoginPayload>({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // CEK TOKEN AWAL
  useEffect(() => {
    let mounted = true;

    const verify = async () => {
      try {
        await getAdminMe();
        if (mounted) router.replace("/adminbma/dashboard");
      } catch {
        // tetap di halaman login
      }
    };

    verify();

    return () => {
      mounted = false;
    };
  }, [router]);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCredentials((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null);
  };

  const getErrorMessage = (err: AxiosError | Error): string => {
    if ("response" in err) {
      return (
        (err.response?.data as { message?: string })?.message ||
        "Login gagal. Cek email & password."
      );
    }
    return err.message || "Terjadi kesalahan.";
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res: LoginResponse = await loginAdmin(credentials);

      // SIMPAN TOKEN DI COOKIE
      document.cookie = `token=${res.access_token}; Path=/; SameSite=Lax; Max-Age=86400`;

      setSuccess(true);

      setTimeout(() => {
        router.push("/adminbma/dashboard");
      }, 800);
    } catch (err) {
      const errorMsg = getErrorMessage(err as AxiosError);
      setError(errorMsg);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
        
        <div className="text-center">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="text-sm text-slate-500">Login administrator</p>
        </div>

        {error && (
          <div className="p-3 bg-red-100 rounded-xl text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="email"
            type="email"
            value={credentials.email}
            onChange={handleChange}
            placeholder="admin@its.ac.id"
            required
            disabled={loading || success}
            className="w-full px-4 py-3 border rounded-xl disabled:bg-gray-100"
          />

          <div className="relative">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              value={credentials.password}
              onChange={handleChange}
              placeholder="••••••••"
              required
              disabled={loading || success}
              className="w-full px-4 py-3 border rounded-xl pr-12 disabled:bg-gray-100"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading || success}
              className="absolute inset-y-0 right-3 text-slate-500"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full bg-black text-white py-3 rounded-xl flex justify-center items-center gap-2 disabled:opacity-50"
          >
            {loading && <Loader2 className="animate-spin" size={18} />}
            {success ? "✓ Login berhasil!" : "Masuk Admin"}
          </button>
        </form>

        {success && (
          <div className="p-3 bg-green-100 rounded-xl">
            <p className="text-green-700 text-sm text-center">
              Mengalihkan ke dashboard...
            </p>
          </div>
        )}
      </div>
    </div>
  );
}