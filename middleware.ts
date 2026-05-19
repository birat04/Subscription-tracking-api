import { NextRequest, NextResponse } from 'next/server';

const PUBLIC_PATHS = [
  '/sign-in',
  '/sign-up',
  '/api/auth/sign-in',
  '/api/auth/sign-up',
  '/api/auth/sign-out',
  '/api/reminders',
];
export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  const token = req.cookies.get('token')?.value;

  // Lightweight gating: only require a token for protected routes.
  // Detailed role checks and token validation happen in server route handlers.
  if (!isPublic) {
    if (!token) return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  if (token && isPublic && !pathname.startsWith('/api/')) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/',
    '/settings',
    '/subscriptions/:path*',
    '/dashboard/:path*',
    '/admin/:path*',
    '/api/subscriptions/:path*',
  ],
};
