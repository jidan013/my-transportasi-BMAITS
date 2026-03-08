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

  if (!isAdminRoute(pathname)) {
    return NextResponse.next();
  }

  const token = req.cookies.get("admin_token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/adminbma/login", req.url));
  }

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  try {
    const res = await fetch(`${apiUrl}/v1/adminbma/me`, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    if (res.status === 401) {
      return NextResponse.redirect(new URL("/adminbma/login", req.url));
    }

    if (!res.ok) {
      return NextResponse.next();
    }

    const user = await res.json();

    if (user?.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();

  } catch {
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