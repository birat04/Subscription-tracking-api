'use client';

import Link from 'next/link';
import dayjs from 'dayjs';
import { useSubscriptions, useRenewSubscription } from '@/hooks/useSubscriptions';
import { formatDate, formatINR } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/subscriptions/StatusBadge';

export function UpcomingRenewals() {
  const { data, isLoading } = useSubscriptions(1, 100);
  const renew = useRenewSubscription();
  const subs = (data?.subscriptions ?? [])
    .filter((s) => s.status === 'active')
    .filter((s) => dayjs(s.renewalDate).diff(dayjs(), 'day') <= 30)
    .sort((a, b) => new Date(a.renewalDate).getTime() - new Date(b.renewalDate).getTime());

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle>Upcoming renewals</CardTitle>
          <CardDescription>Next 30 days, soonest first</CardDescription>
        </div>
        <Button variant="outline" size="sm" asChild>
          <Link href="/subscriptions">View all</Link>
        </Button>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : subs.length === 0 ? (
          <p className="text-sm text-muted-foreground">Nothing renewing in the next month.</p>
        ) : (
          subs.map((s) => {
            const days = dayjs(s.renewalDate).diff(dayjs(), 'day');
            return (
              <div
                key={s.id}
                className="flex flex-col gap-3 rounded-lg border border-border/80 bg-muted/20 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Link href={`/subscriptions/${s.id}`} className="font-semibold hover:underline">
                      {s.name}
                    </Link>
                    <StatusBadge status={s.status} />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {formatINR(s.price)} · renews {formatDate(s.renewalDate)}{' '}
                    <span className="text-foreground">
                      ({days === 0 ? 'today' : `${days}d`})
                    </span>
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="secondary" asChild>
                    <Link href={`/subscriptions/${s.id}`}>Open</Link>
                  </Button>
                  <Button
                    size="sm"
                    disabled={renew.isPending}
                    onClick={() => renew.mutate(s.id)}
                  >
                    Renew
                  </Button>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
