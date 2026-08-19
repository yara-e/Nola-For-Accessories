import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;
  const { pathname } = request.nextUrl;

  // 1. Redirect root /admin to /admin/products (or /admin/dashboard)
  if (pathname === '/admin') {
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
    return NextResponse.redirect(new URL('/admin/products', request.url));
  }

  // 2. Protect all /admin routes except /admin/login
  if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // 3. If already logged in, redirect away from /admin/login to /admin/products
  if (pathname === '/admin/login' && token) {
    return NextResponse.redirect(new URL('/admin/products', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin', '/admin/:path*'],
};