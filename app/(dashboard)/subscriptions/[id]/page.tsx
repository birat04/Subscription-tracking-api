'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  useSubscription,
  useCancelSubscription,
  useRenewSubscription,
  useDeleteSubscription,
} from '@/hooks/useSubscriptions';
import { formatDate, formatINR, toMonthly } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { StatusBadge } from '@/components/subscriptions/StatusBadge';
import { RenewalCountdown } from '@/components/subscriptions/RenewalCountdown';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

export default function SubscriptionDetailPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';
  const router = useRouter();
  const { data: sub, isLoading, isError } = useSubscription(id);
  const cancel = useCancelSubscription();
  const renew = useRenewSubscription();
  const del = useDeleteSubscription();

  if (!id) return null;

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }

  if (isError || !sub) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-destructive">Subscription not found.</p>
        <Button variant="outline" asChild>
          <Link href="/subscriptions">Back to list</Link>
        </Button>
      </div>
    );
  }

  const monthly = toMonthly(sub.price, sub.billingCycle);

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-muted-foreground">Subscription</p>
          <div className="flex flex-wrap items-center gap-2">
            <h2 className="text-2xl font-semibold tracking-tight">{sub.name}</h2>
            <StatusBadge status={sub.status} />
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link href={`/subscriptions/${sub.id}/edit`}>Edit</Link>
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" disabled={del.isPending}>
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete subscription?</AlertDialogTitle>
                <AlertDialogDescription>
                  This removes {sub.name} from your list. You can add it again later.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={async () => {
                    await del.mutateAsync(sub.id);
                    router.push('/subscriptions');
                    router.refresh();
                  }}
                >
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <RenewalCountdown renewalDate={sub.renewalDate} />
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Billing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>
              <span className="font-medium text-foreground">Price:</span> {formatINR(sub.price)} ({sub.currency})
            </p>
            <p>
              <span className="font-medium text-foreground">Cycle:</span>{' '}
              <span className="capitalize">{sub.billingCycle}</span>
            </p>
            <p>
              <span className="font-medium text-foreground">~Monthly:</span> {formatINR(Math.round(monthly))}
            </p>
            <p>
              <span className="font-medium text-foreground">Category:</span>{' '}
              <span className="capitalize">{sub.category}</span>
            </p>
            <p>
              <span className="font-medium text-foreground">Started:</span> {formatDate(sub.startDate)}
            </p>
          </CardContent>
        </Card>
      </div>

      {sub.description ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Notes</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground whitespace-pre-wrap">{sub.description}</CardContent>
        </Card>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <Button variant="secondary" disabled={cancel.isPending} onClick={() => cancel.mutate(sub.id)}>
          Mark cancelled
        </Button>
        <Button disabled={renew.isPending} onClick={() => renew.mutate(sub.id)}>
          Renew / bump cycle
        </Button>
        <Button variant="ghost" asChild>
          <Link href="/subscriptions">Back</Link>
        </Button>
      </div>
    </div>
  );
}
