import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";


export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname === "/adminbma/login" || pathname.startsWith("/adminbma/login")) {
    return NextResponse.next();
  }

  const isAdminRoute = pathname.startsWith("/adminbma");
  if (!isAdminRoute) return NextResponse.next();

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  const cookieHeader = req.headers.get("cookie") ?? "";

  return fetch(`${apiUrl}/v1/adminbma/me`, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Cookie: cookieHeader,
    },
    credentials: "include",
    cache: "no-store",
  })
    .then(async (res) => {
      if (!res.ok) {
        //  Token tidak valid → kembali ke login
        return NextResponse.redirect(new URL("/adminbma/login", req.url));
      }

      const data = await res.json();
      const user = data.user ?? data;

      //  Bukan admin
      if (user.role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url));
      }

      // Auth OK → lanjut ke halaman admin
      return NextResponse.next();
    })
    .catch(() => {
      // Jika error fetch → redirect login
      return NextResponse.redirect(new URL("/adminbma/login", req.url));
    });
}

/**
 * Matcher → middleware HANYA untuk route adminbma
 */
export const config = {
  matcher: ["/adminbma/:path*"],
};