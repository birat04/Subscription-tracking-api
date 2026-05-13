'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import dayjs from 'dayjs';
import { SubscriptionForm } from '@/components/subscriptions/SubscriptionForm';
import { useSubscription, useUpdateSubscription } from '@/hooks/useSubscriptions';
import type { SubscriptionFormData } from '@/schemas/subscription.schema';
import type { Subscription } from '@/types/subscription.types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

function toFormDefaults(sub: Subscription): Partial<SubscriptionFormData> {
  return {
    name: sub.name,
    price: sub.price,
    currency: 'INR',
    billingCycle: sub.billingCycle,
    category: sub.category,
    startDate: dayjs(sub.startDate).format('YYYY-MM-DD'),
    renewalDate: dayjs(sub.renewalDate).format('YYYY-MM-DD'),
    description: sub.description ?? '',
  };
}

export default function EditSubscriptionPage() {
  const params = useParams();
  const id = typeof params.id === 'string' ? params.id : '';
  const router = useRouter();
  const { data: sub, isLoading, isError } = useSubscription(id);
  const update = useUpdateSubscription(id);

  async function handleSubmit(data: SubscriptionFormData) {
    await update.mutateAsync(data);
    router.push(`/subscriptions/${id}`);
    router.refresh();
  }

  if (!id) return null;

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading…</p>;
  }

  if (isError || !sub) {
    return (
      <div className="space-y-4">
        <p className="text-sm text-destructive">Subscription not found.</p>
        <Button variant="outline" asChild>
          <Link href="/subscriptions">Back</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-sm text-muted-foreground">Edit</p>
          <h2 className="text-2xl font-semibold tracking-tight">{sub.name}</h2>
        </div>
        <Button variant="ghost" asChild>
          <Link href={`/subscriptions/${id}`}>Cancel</Link>
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
          <CardDescription>Update fields — amounts stay in INR.</CardDescription>
        </CardHeader>
        <CardContent>
          <SubscriptionForm
            key={sub.id}
            defaultValues={toFormDefaults(sub)}
            onSubmit={handleSubmit}
            submitLabel="Save changes"
            isSubmitting={update.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}
