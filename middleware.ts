import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Semua route khusus Admin
const PROTECTED_ADMIN_ROUTES = ["/adminbma"];

// Cek route apakah termasuk area admin
function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_ADMIN_ROUTES.some((route) => pathname.startsWith(route));
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Jika bukan route admin → langsung lanjut
  if (!isProtectedRoute(pathname)) {
    return NextResponse.next();
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  // Ambil semua cookie (laravel_session + XSRF-TOKEN)
  const cookieHeader = req.headers.get("cookie") ?? "";

  try {
    // Verifikasi cookie ke backend Sanctum
    const res = await fetch(`${apiUrl}/v1/adminbma/me`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Cookie: cookieHeader, // ← Kirim cookie ke Laravel
      },
      credentials: "include",
      cache: "no-store",
    });

    // Jika gagal → redirect login
    if (!res.ok) {
      return NextResponse.redirect(new URL("/adminbma/login", req.url));
    }

    const data = await res.json();
    const user = data.user ?? data;

    // Jika user bukan admin → tendang ke halaman utama
    if (user.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  } catch (err) {
    return NextResponse.redirect(new URL("/adminbma/login", req.url));
  }
}

// Matcher untuk route admin saja
export const config = {
  matcher: ["/adminbma/:path*"],
};