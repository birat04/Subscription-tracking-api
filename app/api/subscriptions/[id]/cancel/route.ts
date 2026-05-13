import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { ok, unauthorized, notFound, serverError } from '@/lib/api-response';

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return unauthorized();
    const { id } = await params;

    const owned = await prisma.subscription.findFirst({
      where: { id, userId: session.userId },
    });
    if (!owned) return notFound();

    const sub = await prisma.subscription.update({
      where: { id },
      data: { status: 'cancelled' },
    });
    return ok({ subscription: sub });
  } catch {
    return serverError();
  }
}
