import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Next.js Turbopack 16.2.1 valid proxy override middleware
export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define protected routes
  const isProtectedRoute = path.startsWith('/profile') || path.startsWith('/checkout') || path.startsWith('/seat-selection');
  
  // Requires the backend to have set the httpOnly auth_session cookie
  const hasSession = request.cookies.get('auth_session');

  if (isProtectedRoute && !hasSession) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

// Ensure the proxy executes for sensitive paths
export const config = {
  matcher: ['/profile/:path*', '/checkout/:path*', '/seat-selection/:path*'],
};
