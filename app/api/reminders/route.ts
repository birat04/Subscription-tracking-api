import { NextRequest, NextResponse } from 'next/server';
import { Receiver } from '@upstash/qstash';
import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';
import dayjs from 'dayjs';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 587),
  secure: Number(process.env.SMTP_PORT) === 465,
  auth:
    process.env.SMTP_USER && process.env.SMTP_PASS
      ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
      : undefined,
});

async function verifyQStash(req: NextRequest, body: string) {
  const current = process.env.QSTASH_CURRENT_SIGNING_KEY;
  const next = process.env.QSTASH_NEXT_SIGNING_KEY;
  if (!current || !next) return false;
  const receiver = new Receiver({
    currentSigningKey: current,
    nextSigningKey: next,
  });
  const signature = req.headers.get('upstash-signature');
  if (!signature) return false;
  try {
    return await receiver.verify({ signature, body });
  } catch {
    return false;
  }
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const valid = await verifyQStash(req, body);
  if (!valid) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
  }

  const in7days = dayjs().add(7, 'day').toDate();
  const today = new Date();

  const upcoming = await prisma.subscription.findMany({
    where: {
      status: 'active',
      renewalDate: { gte: today, lte: in7days },
    },
    include: {
      user: { select: { name: true, email: true } },
    },
  });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';

  for (const sub of upcoming) {
    const user = sub.user;
    if (!user?.email) continue;
    const days = dayjs(sub.renewalDate).diff(dayjs(), 'day');
    await transporter.sendMail({
      from: `SubTrack <${process.env.SMTP_USER}>`,
      to: user.email,
      subject: `Reminder: ${sub.name} renews in ${days} day${days !== 1 ? 's' : ''}`,
      html: `
        <p>Hi ${user.name},</p>
        <p>Your <strong>${sub.name}</strong> subscription (₹${sub.price.toLocaleString('en-IN')}) renews on <strong>${dayjs(sub.renewalDate).format('DD MMM YYYY')}</strong>.</p>
        <p><a href="${appUrl}/subscriptions">View your subscriptions</a></p>
      `,
    });
  }

  return NextResponse.json({ sent: upcoming.length });
}
