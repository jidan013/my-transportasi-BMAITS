"use client";
import React, { useState, FormEvent, ChangeEvent, MouseEvent } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { loginAdmin, saveAuth } from "@/lib/services/auth-service";
import type { LoginPayload } from "@/types/auth";
import axios, { AxiosError } from "axios";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const router = useRouter();
  const [credentials, setCredentials] = useState<LoginPayload>({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setCredentials((prev: LoginPayload) => ({ ...prev, [name]: value }));
    if (error) setError(null);
  };

  const togglePasswordVisibility = (e: MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault();
    setShowPassword((prev: boolean) => !prev);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
  e.preventDefault();
  if (loading) return;

  setLoading(true);
  setError(null);

  
  const toastId = toast.loading("Sedang masuk...", {
    description: "Mohon tunggu sebentar.",
  });

  try {
    const response = await loginAdmin(credentials);
    saveAuth(response.access_token);

    
    toast.success("Login berhasil", {
      id: toastId,
      description: "Selamat datang di Admin BMA!",
    });

    window.location.replace("/adminbma/dashboard");

  } catch (err: unknown) {
    if (axios.isAxiosError(err)) {
      const axiosError = err as AxiosError<{ message?: string }>;
      const message: string = axiosError.response?.data?.message || "Login gagal. Cek email & password.";
      setError(message);

     
      toast.error("Login gagal", {
        id: toastId,
        description: message,
      });
    } else {
      setError("Terjadi kesalahan koneksi ke server.");
      toast.error("Koneksi gagal", {
        id: toastId,
        description: "Tidak dapat terhubung ke server.",
      });
    }
  } finally {
    setLoading(false);
  }
};

  return (
  <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">

    {/* LOGO + TITLE */}
    <div className="text-center mb-8">
      <h1 className="mt-4 text-2xl font-bold text-gray-900">Intitut Teknologi Sepuluh Nopember</h1>
      <p className="text-sm text-gray-500">Biro Manajemen Aset</p>
    </div>

    {/* CARD */}
    <div className="w-full max-w-md bg-white border border-gray-200 rounded-2xl shadow-sm p-8 space-y-6">

      <div>
        <h2 className="text-xl font-semibold text-gray-900">Administrator Login</h2>
        <p className="text-sm text-gray-500 mt-1">
          Please enter your credentials to access the portal.
        </p>
      </div>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">

        {/* EMAIL */}
        <div>
          <label className="text-xs font-semibold text-gray-500 uppercase">
            Email or Username
          </label>
          <input
            name="email"
            type="email"
            placeholder="e.g. example@its.ac.id"
            value={credentials.email}
            onChange={handleChange}
            disabled={loading}
            className="mt-1 w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none"
          />
        </div>

        {/* PASSWORD */}
        <div>
          <div className="flex justify-between text-xs font-semibold text-gray-500 uppercase">
            <span>Password</span>
            <span className="text-blue-600 cursor-pointer hover:underline">
              Forgot Password?
            </span>
          </div>

          <div className="relative mt-1">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="••••••••"
              value={credentials.password}
              onChange={handleChange}
              disabled={loading}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-600 outline-none pr-10"
            />

            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-3 flex items-center text-gray-400"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {/* REMEMBER */}
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <input type="checkbox" className="rounded border-gray-300" />
          <span>Keep me logged in</span>
        </div>

        {/* BUTTON */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-700 hover:bg-blue-800 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition"
        >
          {loading ? (
            <>
              <Loader2 className="animate-spin w-4 h-4" />
              Logging in...
            </>
          ) : (
            "Log in"
          )}
        </button>
      </form>

      {/* FOOTER */}
      <div className="pt-4 border-t text-center text-xs text-gray-400 space-y-1">
        <p>🔒 Secure Institutional Access</p>
        <div className="flex justify-center gap-4">
          <span className="hover:underline cursor-pointer">Support</span>
          <span className="hover:underline cursor-pointer">Privacy Policy</span>
          <span className="hover:underline cursor-pointer">Terms</span>
        </div>
      </div>
    </div>

    {/* COPYRIGHT */}
    <p className="mt-6 text-xs text-gray-400 text-center">
      © 2024 Institut Teknologi Sepuluh Nopember <br />
      DIGITAL TRANSFORMATION OFFICE
    </p>

  </div>
);
}