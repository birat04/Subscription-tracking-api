import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';
import { subscriptionSchema } from '@/schemas/subscription.schema';
import { ok, created, err, unauthorized, serverError } from '@/lib/api-response';
import type { Prisma } from '@prisma/client';

function zodFirstMessage(e: { issues: { message: string }[] }) {
  return e.issues[0]?.message ?? 'Invalid input';
}

export async function GET(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return unauthorized();

    const { searchParams } = req.nextUrl;
    const page = Math.max(1, Number(searchParams.get('page') ?? 1));
    const limit = Math.min(50, Math.max(1, Number(searchParams.get('limit') ?? 10)));
    const skip = (page - 1) * limit;

    const where: Prisma.SubscriptionWhereInput = { userId: session.userId };

    const [subscriptions, total] = await Promise.all([
      prisma.subscription.findMany({
        where,
        orderBy: { renewalDate: 'asc' },
        skip,
        take: limit,
      }),
      prisma.subscription.count({ where }),
    ]);

    return ok({ subscriptions, total, page, pages: Math.ceil(total / limit) });
  } catch {
    return serverError();
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session) return unauthorized();

    const body = await req.json();
    const parsed = subscriptionSchema.safeParse(body);
    if (!parsed.success) return err(zodFirstMessage(parsed.error), 400);

    const subscription = await prisma.subscription.create({
      data: {
        userId: session.userId,
        name: parsed.data.name,
        price: parsed.data.price,
        currency: parsed.data.currency,
        billingCycle: parsed.data.billingCycle,
        category: parsed.data.category,
        startDate: new Date(parsed.data.startDate),
        renewalDate: new Date(parsed.data.renewalDate),
        description: parsed.data.description ?? null,
      },
    });

    return created({ subscription });
  } catch {
    return serverError();
  }
}
