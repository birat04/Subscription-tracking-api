import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';
import { arcjetClient } from '@/lib/arcjet';

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

  if (pathname.startsWith('/api/')) {
    if (arcjetClient) {
      const decision = await arcjetClient.protect(req, { requested: 1 });
      if (decision.isDenied()) {
        return NextResponse.json({ success: false, message: 'Blocked' }, { status: 403 });
      }
    }
    return NextResponse.next();
  }

  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  const token = req.cookies.get('token')?.value;

  if (!isPublic) {
    if (!token) return NextResponse.redirect(new URL('/sign-in', req.url));
    try {
      await verifyToken(token);
    } catch {
      const res = NextResponse.redirect(new URL('/sign-in', req.url));
      res.cookies.delete('token');
      return res;
    }
  }

  if (token && isPublic && !pathname.startsWith('/api/')) {
    try {
      await verifyToken(token);
      return NextResponse.redirect(new URL('/', req.url));
    } catch {
      const res = NextResponse.next();
      res.cookies.delete('token');
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
