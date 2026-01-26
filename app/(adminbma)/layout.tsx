"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

type TokenPayload = {
  id: number;
  role: "ADMIN" | "CLIENT";
  exp: number;
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");

    if (!token) {
      router.push("/adminbma/login");
      return;
    }

    try {
      // Manual JWT decode (Sanctum SPA token)
      const payloadBase64 = token.split(".")[1];
      const payloadJson = decodeURIComponent(
        escape(atob(payloadBase64))
      );
      const decoded: TokenPayload = JSON.parse(payloadJson);

      // Role protection
      if (decoded.role !== "ADMIN") {
        localStorage.removeItem("adminToken");
        router.push("/");
        return;
      }

      // Token expiry check
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("adminToken");
        router.push("/adminbma/login");
        return;
      }

    } catch (error: unknown) {
      console.error("Token validation failed:", error);
      localStorage.removeItem("adminToken");
      router.push("/adminbma/login");
    }
  }, [router]);

  return <div className="w-full">{children}</div>;
}
