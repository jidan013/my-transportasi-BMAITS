"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { loginAdmin, getAdminMe } from "@/lib/services/auth-service";
import type {  LoginResponse } from "@/types/auth";

export default function AdminLoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/adminbma/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async (): Promise<void> => {
      try {
        await getAdminMe();
        router.replace(redirect);
      } catch {
      }
    };
    checkAuth();
  }, [router, redirect]);

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const res: LoginResponse = await loginAdmin({
        email,
        password,
      });

      if (!res.success) {
        throw new Error(res.message || "Login gagal");
      }

      setSuccess(true);

      
      setTimeout(() => {
        router.replace(redirect);
        router.refresh(); 
      }, 1500);

    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Login admin gagal"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Admin Panel</h1>
          <p className="text-sm text-slate-500">
            Login administrator
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-100 rounded-xl text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="admin@its.ac.id"
            className="w-full px-4 py-3 border rounded-xl"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 border rounded-xl pr-12"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-3 text-slate-500"
            >
              {showPassword ? <EyeOff /> : <Eye />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full bg-black text-white py-3 rounded-xl flex justify-center gap-2"
          >
            {loading && <Loader2 className="animate-spin" size={18} />}
            {success ? "Login berhasil" : "Masuk Admin"}
          </button>
        </form>

        {success && (
          <p className="text-green-600 text-sm text-center">
            Mengalihkan ke dashboard...
          </p>
        )}
      </div>
    </div>
  );
}
