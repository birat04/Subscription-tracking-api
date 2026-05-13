'use client';

import { useRouter } from 'next/navigation';
import { SubscriptionForm } from '@/components/subscriptions/SubscriptionForm';
import { useCreateSubscription } from '@/hooks/useSubscriptions';
import type { SubscriptionFormData } from '@/schemas/subscription.schema';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function NewSubscriptionPage() {
  const router = useRouter();
  const create = useCreateSubscription();

  async function handleSubmit(data: SubscriptionFormData) {
    await create.mutateAsync(data);
    router.push('/subscriptions');
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <p className="text-sm text-muted-foreground">Create</p>
        <h2 className="text-2xl font-semibold tracking-tight">New subscription</h2>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Details</CardTitle>
          <CardDescription>All amounts are stored in INR.</CardDescription>
        </CardHeader>
        <CardContent>
          <SubscriptionForm
            onSubmit={handleSubmit}
            submitLabel="Create subscription"
            isSubmitting={create.isPending}
          />
        </CardContent>
      </Card>
    </div>
  );
}
