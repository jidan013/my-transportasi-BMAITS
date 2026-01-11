import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/* =====================
   CONFIG
===================== */
const ADMIN_ROUTES = [
  "/permintaan",
  "/laporan",
  "/adminbma/dashboard",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Cek hanya route admin
  const isAdminRoute = ADMIN_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (!isAdminRoute) {
    return NextResponse.next();
  }

  try {
    // Call backend untuk cek user
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/adminbma/me`,
      {
        headers: {
          Cookie: req.headers.get("cookie") || "",
        },
        credentials: "include",
      }
    );

    // Kalau tidak login
    if (!res.ok) {
      return NextResponse.redirect(
        new URL("/adminbma/login", req.url)
      );
    }

    const user = await res.json();

    // Kalau bukan admin
    if (user.role !== "admin") {
      return NextResponse.redirect(
        new URL("/unauthorized", req.url)
      );
    }

    return NextResponse.next();

  } catch {
    return NextResponse.redirect(
      new URL("/adminbma/login", req.url)
    );
  }
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
