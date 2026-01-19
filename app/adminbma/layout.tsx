"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type SanctumTokenPayload = {
  id: number;
  name: string;
  role: "ADMIN" | "CLIENT";
  exp: number;
  iat: number;
  [key: string]: unknown;
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const checkAuth = async (): Promise<void> => {
      try {
        // 1. CEK localStorage token (sanctum SPA token)
        const token = localStorage.getItem("adminToken");
        
        if (!token) {
          router.replace("/adminbma/login");
          return;
        }

        // 2. DECODE JWT TOKEN (type-safe)
        const payload: SanctumTokenPayload = JSON.parse(
          decodeURIComponent(
            escape(atob(token.split(".")[1]))
          )
        );

        // 3. VALIDASI ROLE ADMIN
        if (payload.role !== "ADMIN") {
          localStorage.removeItem("adminToken");
          router.replace("/adminbma/dashboard");
          return;
        }

        // 4. CEK TOKEN EXPIRY
        if (payload.exp * 1000 < Date.now()) {
          localStorage.removeItem("adminToken");
          router.replace("/adminbma/login");
          return;
        }

        // 5. VERIFIKASI DENGAN SANCTUM API (CSRF protection)
        const response = await fetch("/sanctum/csrf-cookie", {
          credentials: "include", // Sanctum cookies
        });

        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          throw new Error("Sanctum CSRF validation failed");
        }

      } catch (error: unknown) {
        console.error("Auth check failed:", error);
        localStorage.removeItem("adminToken");
        router.replace("/adminbma/login");
      }
    };

    checkAuth();
  }, [router]);

  // Loading state saat check auth
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-black mx-auto mb-4"></div>
          <p className="text-sm text-slate-500">Verifying authentication...</p>
        </div>
      </div>
    );
  }

  // Belum authenticated
  if (!isAuthenticated) {
    return null; // Middleware/router akan handle redirect
  }

  return (
    <div className="w-full min-h-screen bg-gray-50">
      {children}
    </div>
  );
}
