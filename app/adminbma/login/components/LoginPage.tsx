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
        const token = localStorage.getItem("admin_token");
        if (token) {
          await getAdminMe();
          if (isMounted) {
            router.replace("/adminbma/dashboard");
          }
        }
      } catch {
        // Not authenticated, stay on login page
      }
    };

    checkAuth();
    return () => { isMounted = false; };
  }, [router]);

  const handleEmailChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setCredentials(prev => ({ ...prev, email: e.target.value }));
    if (error) setError(null);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setCredentials(prev => ({ ...prev, password: e.target.value }));
    if (error) setError(null);
  };

  const togglePassword = (): void => {
    setShowPassword(prev => !prev);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const res: LoginResponse = await loginAdmin(credentials);
      
      console.log("Login response:", res); // Debug log
      
      // CEK access_token, BUKAN res.success
      if (res.access_token) {
        // Simpan token ke localStorage
        localStorage.setItem("admin_token", res.access_token);
        localStorage.setItem("admin_user", JSON.stringify(res.user));
        
        console.log("💾 Token saved:", res.access_token);
        
        setSuccess(true);
        
        // Redirect ke dashboard
        setTimeout(() => {
          console.log("🚀 Redirecting to dashboard...");
          router.push("/adminbma/dashboard");
        }, 1500);
      } else {
        throw new Error("Token tidak ditemukan dalam response");
      }
      
    } catch (err: any) {
      console.error("❌ Login error:", err);
      
      let message = "Login gagal. Periksa email dan password.";
      
      if (err.response?.data?.message) {
        message = err.response.data.message;
      } else if (err.message) {
        message = err.message;
      }
      
      setError(message);
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
            disabled={loading || success}
            value={credentials.email}
            onChange={handleEmailChange}
            placeholder="admin@its.ac.id"
            className="w-full px-4 py-3 border rounded-xl disabled:bg-gray-100"
          />

          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              required
              disabled={loading || success}
              value={credentials.password}
              onChange={handlePasswordChange}
              placeholder="••••••••"
              className="w-full px-4 py-3 border rounded-xl pr-12 disabled:bg-gray-100"
            />
            <button
              type="button"
              onClick={togglePassword}
              disabled={loading || success}
              className="absolute inset-y-0 right-3 text-slate-500 disabled:opacity-50"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading || success}
            className="w-full bg-black text-white py-3 rounded-xl flex justify-center items-center gap-2 disabled:opacity-50 hover:bg-gray-900 transition-colors"
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
