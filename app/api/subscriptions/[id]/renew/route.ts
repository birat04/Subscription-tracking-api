import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { ok, unauthorized, notFound, serverError } from '@/lib/api-response';
import dayjs from 'dayjs';

function nextRenewal(current: Date, cycle: string): Date {
  const d = dayjs(current);
  if (cycle === 'monthly') return d.add(1, 'month').toDate();
  if (cycle === 'yearly') return d.add(1, 'year').toDate();
  if (cycle === 'weekly') return d.add(1, 'week').toDate();
  return d.add(1, 'month').toDate();
}

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getSession();
    if (!session) return unauthorized();
    const { id } = await params;

    const sub = await prisma.subscription.findFirst({
      where: { id, userId: session.userId },
    });
    if (!sub) return notFound();

    const updated = await prisma.subscription.update({
      where: { id },
      data: {
        renewalDate: nextRenewal(sub.renewalDate, sub.billingCycle),
        status: 'active',
      },
    });
    return ok({ subscription: updated });
  } catch {
    return serverError();
  }
}
