'use client';

import { useSubscriptions } from '@/hooks/useSubscriptions';
import { toMonthly, formatINR } from '@/lib/utils';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const labels: Record<string, string> = {
  entertainment: 'Entertainment',
  productivity: 'Productivity',
  health: 'Health',
  finance: 'Finance',
  education: 'Education',
  other: 'Other',
};

export function CategoryBreakdown() {
  const { data, isLoading } = useSubscriptions(1, 100);
  const subs = (data?.subscriptions ?? []).filter((s) => s.status === 'active');

  const totals = subs.reduce<Record<string, number>>((acc, s) => {
    const m = toMonthly(s.price, s.billingCycle);
    acc[s.category] = (acc[s.category] ?? 0) + m;
    return acc;
  }, {});

  const rows = Object.entries(totals).sort((a, b) => b[1] - a[1]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>By category</CardTitle>
        <CardDescription>Monthly INR by group</CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : rows.length === 0 ? (
          <p className="text-sm text-muted-foreground">No active subscriptions yet.</p>
        ) : (
          rows.map(([key, value]) => (
            <div key={key} className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{labels[key] ?? key}</span>
              <span className="font-semibold">{formatINR(Math.round(value))}</span>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
