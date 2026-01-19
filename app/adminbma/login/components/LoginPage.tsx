"use client";

import { useState, useEffect, FormEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { loginAdmin, getAdminMe } from "@/lib/services/auth-service";
import type { LoginResponse, LoginPayload } from "@/types/auth";

export default function AdminLoginPage() {
  const router = useRouter();

  const [credentials, setCredentials] = useState<LoginPayload>({
    email: "",
    password: ""
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [success, setSuccess] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const checkAuth = async (): Promise<void> => {
      try {
        await getAdminMe();
        if (isMounted) {
          router.replace("/adminbma/dashboard");
        }
      } catch {
      }
    };

    checkAuth();
    return () => { isMounted = false; };
  }, [router]);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setCredentials(prev => ({ ...prev, email: e.target.value }));
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setCredentials(prev => ({ ...prev, password: e.target.value }));
  };

  const togglePassword = (): void => {
    setShowPassword(prev => !prev);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(null);

    try {
      const res: LoginResponse = await loginAdmin(credentials);
      if (!res.success) throw new Error(res.message ?? "Login gagal");
      
      setSuccess(true);
      setTimeout(() => {
        router.replace("/adminbma/dashboard"); // ✅ Hardcode - no useSearchParams
        router.refresh();
      }, 1500);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Login admin gagal");
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
          <div className="p-3 bg-red-100 rounded-xl text-sm text-red-700" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <input
            id="email"
            type="email"
            name="email"
            required
            value={credentials.email}
            onChange={handleEmailChange}
            placeholder="admin@its.ac.id"
            className="w-full px-4 py-3 border rounded-xl"
          />

          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              required
              value={credentials.password}
              onChange={handlePasswordChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 border rounded-xl pr-12"
            />
            <button
              type="button"
              onClick={togglePassword}
              className="absolute inset-y-0 right-3 text-slate-500"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full bg-black text-white py-3 rounded-xl flex justify-center gap-2 disabled:opacity-50"
          >
            {loading && <Loader2 className="animate-spin" size={18} />}
            {success ? "Login berhasil" : "Masuk Admin"}
          </button>
        </form>

        {success && (
          <p className="text-green-600 text-sm text-center">Mengalihkan ke dashboard...</p>
        )}
      </div>
    </div>
  );
}
