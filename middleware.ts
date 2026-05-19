import { NextRequest, NextResponse } from 'next/server';

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

  async function fetchSession() {
    try {
      const url = new URL('/api/auth/me', req.url);
      const resp = await fetch(url.toString(), {
        headers: { cookie: req.headers.get('cookie') || '' },
        cache: 'no-store',
      });
      if (!resp.ok) return null;
      const body = await resp.json();
      return body?.user ?? null;
    } catch {
      return null;
    }
  }

  if (!isPublic) {
    if (!token) return NextResponse.redirect(new URL('/sign-in', req.url));

    const user = await fetchSession();
    if (!user) {
      const res = NextResponse.redirect(new URL('/sign-in', req.url));
      res.cookies.delete('token');
      return res;
    }

    const isAdminPath = ADMIN_PATHS.some((p) => pathname.startsWith(p));
    if (isAdminPath && !['HOST', 'ADMIN'].includes(user.role)) {
      return pathname.startsWith('/api/')
        ? NextResponse.json({ success: false, message: 'Forbidden' }, { status: 403 })
        : NextResponse.redirect(new URL('/', req.url));
    }
  }

  if (token && isPublic && !pathname.startsWith('/api/')) {
    const user = await fetchSession();
    if (user) return NextResponse.redirect(new URL('/', req.url));
    const res = NextResponse.next();
    res.cookies.delete('token');
    return res;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
