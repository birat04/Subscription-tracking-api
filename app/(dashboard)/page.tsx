import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { StatsRow } from '@/components/dashboard/StatsRow';
import { SpendChart } from '@/components/dashboard/SpendChart';
import { CategoryBreakdown } from '@/components/dashboard/CategoryBreakdown';
import { UpcomingRenewals } from '@/components/dashboard/UpcomingRenewals';

export default function DashboardPage() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Overview</p>
          <h2 className="text-2xl font-semibold tracking-tight">Your subscription health</h2>
        </div>
        <Button asChild>
          <Link href="/subscriptions/new">Add subscription</Link>
        </Button>
      </div>

      <StatsRow />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SpendChart />
        </div>
        <CategoryBreakdown />
      </div>

      <UpcomingRenewals />
    </div>
  );
}
