import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface AdminUser {
  role: 'admin';
  name: string;
  email: string;
}

async function validateAdminToken(token: string): Promise<AdminUser | null> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) return null;
    
    const user = await response.json();
    return user.role === 'admin' ? user : null;
  } catch {
    return null;
  }
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;

  // Skip untuk static files & API
  if (request.nextUrl.pathname.startsWith('/api') ||
      request.nextUrl.pathname.startsWith('/_next') ||
      request.nextUrl.pathname.includes('favicon.ico')) {
    return NextResponse.next();
  }

  const pathname = request.nextUrl.pathname;
  
  // Admin-only paths (WAJIB LOGIN ADMIN)
  const adminOnlyPaths = ['/laporan', '/permintaan'];
  const isAdminOnlyPath = adminOnlyPaths.some(path => 
    pathname === path || pathname.startsWith(path + '/')
  );

  // Public paths (tanpa login OK)
  const publicPaths = ['/', '/jadwal', '/form', '/status', '/sop', '/foto', '/jenis-kendaraan', '/biaya', '/kontak'];
  const isPublicPath = publicPaths.some(path => 
    pathname === path || pathname.startsWith(path + '/')
  );

  // 1. Admin-only paths → WAJIB login admin
  if (isAdminOnlyPath) {
    if (!token) {
      return NextResponse.redirect(new URL('/adminbma/login?redirect=' + encodeURIComponent(pathname), request.url));
    }

    const user = await validateAdminToken(token);
    if (!user) {
      const response = NextResponse.redirect(new URL('/adminbma/login?redirect=' + encodeURIComponent(pathname), request.url));
      response.cookies.delete('admin_token');
      return response;
    }

    // Pass admin info ke client
    const response = NextResponse.next();
    response.headers.set('x-admin-auth', 'true');
    response.headers.set('x-admin-name', user.name);
    response.headers.set('x-admin-email', user.email);
    return response;
  }

  // 2. Public paths → bebas akses
  if (isPublicPath || !pathname || pathname === '/adminbma/login') {
    return NextResponse.next();
  }

  // 3. Default → allow
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
