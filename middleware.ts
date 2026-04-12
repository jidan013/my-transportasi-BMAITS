import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  // Hanya protect laporan & permintaan saja
  const isAdminOnly =
    pathname.startsWith("/adminbma/dashboard/permintaan") ||
    pathname.startsWith("/adminbma/dashboard/laporan");

  // Belum login & coba akses fitur admin → redirect login
  if (isAdminOnly && !token) {
    return NextResponse.redirect(new URL("/adminbma/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/adminbma/dashboard/:path*"],
};