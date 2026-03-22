import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth.config';
import { NextResponse } from 'next/server';

// Create a separate auth instance for middleware to avoid importing Node.js modules (mongoose, bcrypt)
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const { pathname } = nextUrl;
  const user = req.auth?.user;
  const role = user?.role as string | undefined;

  // Public routes that don't require authentication
  const publicRoutes = ['/', '/book', '/login'];
  // Also allow static files and images if not covered by matcher
  const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(route + '/'));

  if (isPublicRoute) {
    return NextResponse.next();
  }

  // Dashboard routes require authentication
  const isDashboardRoute = pathname.startsWith('/dashboard');

  if (isDashboardRoute) {
    if (!user) {
      return NextResponse.redirect(new URL('/login', nextUrl));
    }

    // Role-based access control
    if (pathname.startsWith('/dashboard/doctor') && role !== 'doctor') {
      return NextResponse.redirect(new URL('/dashboard', nextUrl));
    }
    if (pathname.startsWith('/dashboard/receptionist') && role !== 'receptionist') {
      return NextResponse.redirect(new URL('/dashboard', nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  // Matcher ignoring internals and static files
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
