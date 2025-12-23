"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode }    from "jwt-decode";

type Token = {
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
      const decoded = jwtDecode<Token>(token);

      // 🔒 proteksi role
      if (decoded.role !== "ADMIN") {
        router.push("/");
      }

      // ⏰ token expired
      if (decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem("adminToken");
        router.push("/adminbma/login");
      }
    } catch (error) {
      localStorage.removeItem("adminToken");
      router.push("/adminbma/login");
    }
  }, [router]);

  return <div className="w-full">
    {children}
  </div>
}
