'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useSubscriptions } from '@/hooks/useSubscriptions';
import { SubscriptionTable } from '@/components/subscriptions/SubscriptionTable';
import { Button } from '@/components/ui/button';

export default function SubscriptionsPage() {
  const [page, setPage] = useState(1);
  const limit = 10;
  const { data, isLoading } = useSubscriptions(page, limit);

  return (
    <div className="mx-auto flex max-w-5xl flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Library</p>
          <h2 className="text-2xl font-semibold tracking-tight">Subscriptions</h2>
        </div>
        <Button asChild>
          <Link href="/subscriptions/new">New subscription</Link>
        </Button>
      </div>

      <SubscriptionTable
        subscriptions={data?.subscriptions ?? []}
        page={data?.page ?? page}
        pages={data?.pages ?? 1}
        onPageChange={setPage}
        isLoading={isLoading}
      />
    </div>
  );
}
