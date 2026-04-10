import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("token")?.value;

  // Allow login page
  if (pathname === "/adminbma/login") {
    if (token) return NextResponse.redirect(new URL("/adminbma/dashboard", req.url));
    return NextResponse.next();
  }

  // Protect admin routes - COOKIE ONLY
  if (pathname.startsWith("/adminbma") && pathname !== "/adminbma/login") {
    if (!token) {
      return NextResponse.redirect(new URL("/adminbma/login", req.url));
    }
    
    return NextResponse.next();
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/adminbma/:path*"],
};