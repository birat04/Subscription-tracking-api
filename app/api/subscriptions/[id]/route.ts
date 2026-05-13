import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { subscriptionSchema } from '@/schemas/subscription.schema';
import { ok, err, unauthorized, notFound, serverError } from '@/lib/api-response';
import type { Prisma } from '@prisma/client';

type Ctx = { params: Promise<{ id: string }> };

function zodFirstMessage(e: { issues: { message: string }[] }) {
  return e.issues[0]?.message ?? 'Invalid input';
}

export async function GET(_req: NextRequest, { params }: Ctx) {
  try {
    const session = await getSession();
    if (!session) return unauthorized();
    const { id } = await params;
    const sub = await prisma.subscription.findFirst({
      where: { id, userId: session.userId },
    });
    if (!sub) return notFound();
    return ok({ subscription: sub });
  } catch {
    return serverError();
  }
}

export async function PUT(req: NextRequest, { params }: Ctx) {
  try {
    const session = await getSession();
    if (!session) return unauthorized();
    const body = await req.json();
    const parsed = subscriptionSchema.partial().safeParse(body);
    if (!parsed.success) return err(zodFirstMessage(parsed.error), 400);
    const { id } = await params;

    const owned = await prisma.subscription.findFirst({
      where: { id, userId: session.userId },
    });
    if (!owned) return notFound();

    const d = parsed.data;
    const data: Prisma.SubscriptionUpdateInput = {};
    if (d.name !== undefined) data.name = d.name;
    if (d.price !== undefined) data.price = d.price;
    if (d.currency !== undefined) data.currency = d.currency;
    if (d.billingCycle !== undefined) data.billingCycle = d.billingCycle;
    if (d.category !== undefined) data.category = d.category;
    if (d.startDate !== undefined) data.startDate = new Date(d.startDate);
    if (d.renewalDate !== undefined) data.renewalDate = new Date(d.renewalDate);
    if (d.description !== undefined) data.description = d.description ?? null;

    if (Object.keys(data).length === 0) {
      return err('No fields to update', 400);
    }

    const sub = await prisma.subscription.update({
      where: { id },
      data,
    });
    return ok({ subscription: sub });
  } catch {
    return serverError();
  }
}

export async function DELETE(_req: NextRequest, { params }: Ctx) {
  try {
    const session = await getSession();
    if (!session) return unauthorized();
    const { id } = await params;
    const result = await prisma.subscription.deleteMany({
      where: { id, userId: session.userId },
    });
    if (result.count === 0) return notFound();
    return ok({ message: 'Subscription deleted' });
  } catch {
    return serverError();
  }
}
