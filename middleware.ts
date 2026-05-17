import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/jwt';

const PUBLIC_PATHS = [
  '/sign-in',
  '/sign-up',
  '/api/auth/sign-in',
  '/api/auth/sign-up',
  '/api/auth/sign-out',
  '/api/reminders',
];

const ADMIN_PATHS = ['/admin', '/api/admin'];

export async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  const token = req.cookies.get('token')?.value;

  if (!isPublic) {
    if (!token) return NextResponse.redirect(new URL('/sign-in', req.url));
    try {
      const payload = await verifyToken(token);
      
      // Check admin/host routes
      const isAdminPath = ADMIN_PATHS.some((p) => pathname.startsWith(p));
      if (isAdminPath && !['HOST', 'ADMIN'].includes(payload.role)) {
        return pathname.startsWith('/api/')
          ? NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
          : NextResponse.redirect(new URL('/', req.url));
      }
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
