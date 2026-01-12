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
function isAdminRoute(pathname: string) {
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

  if (!isAdminRoute(pathname)) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;

  // belum login
  if (!token) {
    return NextResponse.redirect(
      new URL("/adminbma/login", req.url)
    );
  }

  const role = getRoleFromToken(token);

  // bukan admin
  if (role !== "admin") {
    return NextResponse.redirect(
      new URL("/unauthorized", req.url)
    );
  }

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
