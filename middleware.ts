import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const cookieToken = req.cookies.get("token")?.value;

  if (pathname === "/adminbma/login") {
    if (cookieToken) {
      return NextResponse.redirect(new URL("/adminbma/dashboard", req.url));
    }
    return NextResponse.next();
  }

  // 2. Proteksi Route Admin
  if (pathname.startsWith("/adminbma")) {
    if (!cookieToken) {
      return NextResponse.redirect(new URL("/adminbma/login", req.url));
    }

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL;
      
      // Verifikasi token ke Backend Laravel
      const res = await fetch(`${apiUrl}/v1/adminbma/me`, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Authorization": `Bearer ${cookieToken}`, 
          "Cookie": `token=${cookieToken}` 
        },
        cache: "no-store",
      });

      if (!res.ok) {
        return NextResponse.redirect(new URL("/adminbma/login", req.url));
      }

      const user = await res.json();
      const userData = user.user ?? user;

      // 3. Cek Role Admin
      if (userData.role !== "admin") {
        return NextResponse.redirect(new URL("/", req.url));
      }

      return NextResponse.next();
    } catch (error) {
      // Jika Backend mati atau network error
      console.error("Middleware Auth Error:", error);
      return NextResponse.redirect(new URL("/adminbma/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/adminbma/:path*"],
};