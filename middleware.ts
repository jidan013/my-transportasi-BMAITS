import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/* =====================
   ADMIN ROUTES
===================== */
const ADMIN_ROUTES = [
  "/permintaan",
  "/laporan",
  "/adminbma/dashboard",
];

/* =====================
   HELPERS
===================== */
function isAdminRoute(pathname: string): boolean {
  return ADMIN_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + "/")
  );
}

function getRoleFromToken(token: string): string | null {
  try {
    const payload = JSON.parse(
      Buffer.from(token.split(".")[1], "base64").toString()
    );
    return payload?.role ?? null;
  } catch {
    return null;
  }
}

/* =====================
   MIDDLEWARE
===================== */
export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Hanya jaga route admin
  if (!isAdminRoute(pathname)) {
    return NextResponse.next();
  }

  // Ambil token dari cookies (sesuaikan nama cookie yang dipakai backend)
  const token =
    req.cookies.get("token")?.value ||
    req.cookies.get("access_token")?.value ||
    req.cookies.get("auth_token")?.value;

  // Tidak ada token → redirect ke "/"
  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  const role = getRoleFromToken(token);

  // Role bukan admin → redirect ke "/"
  if (role !== "admin") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Lolos semua cek → lanjut
  return NextResponse.next();
}

/* =====================
   MATCHER
===================== */
export const config = {
  matcher: [
    "/permintaan/:path*",
    "/laporan/:path*",
    "/adminbma/dashboard/:path*",
  ],
};
