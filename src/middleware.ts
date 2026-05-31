import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession = request.cookies.has('admin_session');

  // 1. Intercept Admin API scope and return 401 if unauthorized
  if (pathname.startsWith('/api/admin')) {
    if (!hasSession) {
      return NextResponse.json(
        { error: 'Unauthorized. Active admin session required.' },
        { status: 401 }
      );
    }
    return NextResponse.next();
  }

  // 2. Intercept Admin page scope and redirect to login if unauthorized
  if (pathname.startsWith('/admin')) {
    if (!hasSession) {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// Configuration to only intercept matching admin pages and API endpoints.
// This naturally exempts public routes (/), the new login page (/login),
// and the auth API routes (/api/auth/*) to prevent redirect loops.
export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
  ],
};
