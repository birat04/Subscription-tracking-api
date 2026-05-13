import { ok } from '@/lib/api-response';

export async function POST() {
  const res = ok({ message: 'Signed out' });
  res.cookies.set('token', '', { maxAge: 0, path: '/' });
  return res;
}
