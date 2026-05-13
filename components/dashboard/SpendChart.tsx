'use client';

import { useSubscriptions } from '@/hooks/useSubscriptions';
import { toMonthly, formatINR } from '@/lib/utils';
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export function SpendChart() {
  const { data, isLoading } = useSubscriptions(1, 100);
  const subs = (data?.subscriptions ?? []).filter((s) => s.status === 'active');

  const chartData = subs.map((s) => ({
    name: s.name.length > 14 ? `${s.name.slice(0, 14)}…` : s.name,
    monthly: Math.round(toMonthly(s.price, s.billingCycle)),
  }));

  return (
    <Card className="h-[380px]">
      <CardHeader>
        <CardTitle>Monthly equivalent</CardTitle>
        <CardDescription>Active subscriptions normalized to INR / month</CardDescription>
      </CardHeader>
      <CardContent className="h-[280px] min-h-0">
        {isLoading ? (
          <p className="text-sm text-muted-foreground">Loading chart…</p>
        ) : chartData.length === 0 ? (
          <p className="text-sm text-muted-foreground">Add subscriptions to see your spend curve.</p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ left: 0, right: 8, top: 8, bottom: 0 }}>
              <defs>
                <linearGradient id="fillSpend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis dataKey="name" tick={{ fontSize: 11 }} interval={0} angle={-20} textAnchor="end" height={70} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `₹${v}`} width={48} />
              <Tooltip
                formatter={(value: number) => [formatINR(value), 'Monthly']}
                contentStyle={{ borderRadius: 8 }}
              />
              <Area type="monotone" dataKey="monthly" stroke="#7c3aed" fill="url(#fillSpend)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}
