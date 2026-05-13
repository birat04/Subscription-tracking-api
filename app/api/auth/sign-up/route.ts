import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/jwt';
import { signUpSchema } from '@/schemas/auth.schema';
import { created, err, serverError } from '@/lib/api-response';

function zodFirstMessage(e: { issues: { message: string }[] }) {
  return e.issues[0]?.message ?? 'Invalid input';
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = signUpSchema.safeParse(body);
    if (!parsed.success) return err(zodFirstMessage(parsed.error), 400);

    const { name, email, password } = parsed.data;

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists) return err('Email already in use', 409);

    const hashed = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name, email, password: hashed },
      select: { id: true, name: true, email: true },
    });

    const token = await signToken({ userId: user.id, email });

    const res = created({ user });
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
