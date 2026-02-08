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

  // Bukan route admin → lanjut
  if (!isAdminRoute(pathname)) {
    return NextResponse.next();
  }

  try {
    const apiUrl = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      console.error("API_URL not defined");
      return NextResponse.redirect(
        new URL("/adminbma/login", req.url)
      );
    }

    const res = await fetch(`${apiUrl}/v1/adminbma/me`, {
      method: "GET",
      headers: {
        Cookie: req.headers.get("cookie") ?? "",
        Accept: "application/json",
      },
      credentials: "include",
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.redirect(
        new URL("/adminbma/login", req.url)
      );
    }

    const user = await res.json();

    if (user?.role !== "admin") {
      return NextResponse.redirect(
        new URL("/", req.url)
      );
    }

  
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware auth error:", error);

    return NextResponse.redirect(
      new URL("/adminbma/login", req.url)
    );
  }
}

export const config = {
  matcher: [
    "/adminbma/dashboard/:path*",
    "/laporan/:path*",
    "/permintaan/:path*",
  ],
};