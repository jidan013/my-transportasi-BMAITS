import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const ADMIN_ROUTES = [
  "/adminbma/dashboard",
  "/laporan",
  "/permintaan",
];

function isAdminRoute(pathname: string): boolean {
  return ADMIN_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ⛔ Bukan route admin → lewat
  if (!isAdminRoute(pathname)) {
    return NextResponse.next();
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  if (!apiUrl) {
    return NextResponse.redirect(new URL("/adminbma/login", req.url));
  }

  const cookie = req.headers.get("cookie");

  try {
    const res = await fetch(`${apiUrl}/v1/adminbma/me`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Cookie: cookie ?? "",
      },
      cache: "no-store",
    });

    // ❌ Belum login / session invalid
    if (res.status === 401) {
      return NextResponse.redirect(
        new URL("/adminbma/login", req.url)
      );
    }

    // ⚠️ Error lain (timeout, 500, dll) → jangan paksa logout
    if (!res.ok) {
      return NextResponse.next();
    }

    const user = await res.json();

    // ❌ Login tapi bukan admin
    if (user?.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    // ✅ Login & admin
    return NextResponse.next();
  } catch {
    // ❗ Network error → JANGAN logout
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