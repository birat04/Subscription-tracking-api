'use client';

import { useSubscriptions } from '@/hooks/useSubscriptions';
import { toMonthly, formatINR } from '@/lib/utils';
import dayjs from 'dayjs';

export function StatsRow() {
  const { data } = useSubscriptions(1, 100);
  const subs = data?.subscriptions ?? [];

  const monthlyTotal = subs
    .filter((s) => s.status === 'active')
    .reduce((acc, s) => acc + toMonthly(s.price, s.billingCycle), 0);

  const active = subs.filter((s) => s.status === 'active').length;
  const upcoming = subs.filter(
    (s) => s.status === 'active' && dayjs(s.renewalDate).diff(dayjs(), 'day') <= 7 && dayjs(s.renewalDate).diff(dayjs(), 'day') >= 0
  ).length;
  const cancelled = subs.filter((s) => s.status === 'cancelled').length;

  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      <StatCard label="Monthly spend" value={formatINR(monthlyTotal)} color="purple" />
      <StatCard label="Active" value={String(active)} color="green" />
      <StatCard label="Renewing in 7d" value={String(upcoming)} color="amber" />
      <StatCard label="Cancelled" value={String(cancelled)} color="red" />
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  const colors: Record<string, string> = {
    purple: 'border-l-violet-500',
    green: 'border-l-emerald-500',
    amber: 'border-l-amber-400',
    red: 'border-l-red-400',
  };
  return (
    <div
      className={`rounded-xl border border-border bg-card p-5 border-l-4 ${colors[color] ?? 'border-l-muted'}`}
    >
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="text-2xl font-bold tracking-tight">{value}</p>
    </div>
  );
}
