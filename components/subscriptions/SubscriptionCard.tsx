import Link from 'next/link';
import type { Subscription } from '@/types/subscription.types';
import { formatDate, formatINR, toMonthly } from '@/lib/utils';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { StatusBadge } from '@/components/subscriptions/StatusBadge';
import { Button } from '@/components/ui/button';

export function SubscriptionCard({ subscription }: { subscription: Subscription }) {
  const monthly = toMonthly(subscription.price, subscription.billingCycle);

  return (
    <Card className="overflow-hidden border-border/80 transition-shadow hover:shadow-md">
      <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0 pb-2">
        <div>
          <Link href={`/subscriptions/${subscription.id}`} className="text-lg font-semibold hover:underline">
            {subscription.name}
          </Link>
          <p className="text-sm text-muted-foreground">
            {formatINR(subscription.price)} · ~{formatINR(Math.round(monthly))}/mo
          </p>
        </div>
        <StatusBadge status={subscription.status} />
      </CardHeader>
      <CardContent className="flex items-center justify-between gap-2 text-sm text-muted-foreground">
        <span>Renews {formatDate(subscription.renewalDate)}</span>
        <Button size="sm" variant="outline" asChild>
          <Link href={`/subscriptions/${subscription.id}`}>View</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
