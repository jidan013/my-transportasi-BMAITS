import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_ROUTES = ["/adminbma/dashboard", "/laporan", "/permintaan"];

function isAdminRoute(pathname: string): boolean {
  return ADMIN_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!isAdminRoute(pathname)) {
    return NextResponse.next();
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  if (!apiUrl) {
    console.error("NEXT_PUBLIC_API_URL not defined");
    return NextResponse.redirect(new URL("/adminbma/login", req.url));
  }

  try {
    const res = await fetch(`${apiUrl}/v1/adminbma/me`, {
      method: "GET",
      credentials: "include", 
      headers: {
        Accept: "application/json",
      },
      cache: "no-store",
    });

    // ❌ Belum login / cookie invalid
    if (res.status === 401) {
      return NextResponse.redirect(
        new URL("/adminbma/login", req.url)
      );
    }

    if (!res.ok) {
      // error lain → jangan paksa logout
      console.error("Auth check failed:", res.status);
      return NextResponse.next();
    }

    const user = await res.json();

    // ❌ Bukan admin
    if (user?.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // ✅ Aman
    return NextResponse.next();
  } catch (err) {
    // ❗ network error → JANGAN logout paksa
    console.error("Middleware network error:", err);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    "/adminbma/dashboard/:path*",
    "/laporan/:path*",
    "/permintaan/:path*",
  ],
};