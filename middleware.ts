import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";



export function middleware(request: NextRequest) {
    if (request.nextUrl.pathname === "/laporan") {
        return NextResponse.redirect(new URL("/adminbma/login", request.url));
    }
}


export const config = {
    matcher: "/laporan",
};