import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/jwt';
import { signInSchema } from '@/schemas/auth.schema';
import { ok, err, serverError } from '@/lib/api-response';

function zodFirstMessage(e: { issues: { message: string }[] }) {
  return e.issues[0]?.message ?? 'Invalid input';
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = signInSchema.safeParse(body);
    if (!parsed.success) return err(zodFirstMessage(parsed.error), 400);

    const { email, password } = parsed.data;

    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true, name: true, email: true, password: true },
    });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return err('Invalid email or password', 401);
    }

    const token = await signToken({ userId: user.id, email });
    const res = ok({ user: { id: user.id, name: user.name, email: user.email } });
    res.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    return res;
  } catch {
    return serverError();
  }
}
