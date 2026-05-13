import type { SubscriptionStatus } from '@/types/subscription.types';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const styles: Record<SubscriptionStatus, string> = {
  active: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400',
  cancelled: 'border-red-500/30 bg-red-500/10 text-red-700 dark:text-red-400',
  expired: 'border-amber-500/30 bg-amber-500/10 text-amber-800 dark:text-amber-300',
  paused: 'border-slate-500/30 bg-slate-500/10 text-slate-700 dark:text-slate-300',
};

const labels: Record<SubscriptionStatus, string> = {
  active: 'Active',
  cancelled: 'Cancelled',
  expired: 'Expired',
  paused: 'Paused',
};

export function StatusBadge({ status }: { status: SubscriptionStatus }) {
  return (
    <Badge variant="outline" className={cn('capitalize', styles[status])}>
      {labels[status]}
    </Badge>
  );
}
