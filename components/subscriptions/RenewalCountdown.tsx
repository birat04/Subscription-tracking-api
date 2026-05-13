'use client';

import dayjs from 'dayjs';
import { formatDate } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

export function RenewalCountdown({ renewalDate }: { renewalDate: string | Date }) {
  const days = dayjs(renewalDate).diff(dayjs(), 'day');
  const label =
    days < 0 ? `${Math.abs(days)}d overdue` : days === 0 ? 'Renews today' : `In ${days} day${days === 1 ? '' : 's'}`;

  return (
    <Card className="border-violet-500/20 bg-gradient-to-br from-violet-500/5 to-transparent">
      <CardContent className="flex flex-col gap-1 py-5">
        <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">Next renewal</p>
        <p className="text-2xl font-semibold tracking-tight">{formatDate(renewalDate)}</p>
        <p className="text-sm text-violet-700 dark:text-violet-300">{label}</p>
      </CardContent>
    </Card>
  );
}
