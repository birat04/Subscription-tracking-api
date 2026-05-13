'use client';

import Link from 'next/link';
import type { Subscription } from '@/types/subscription.types';
import { formatDate, formatINR } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { StatusBadge } from '@/components/subscriptions/StatusBadge';
import { Button } from '@/components/ui/button';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

type Props = {
  subscriptions: Subscription[];
  page: number;
  pages: number;
  onPageChange: (p: number) => void;
  isLoading?: boolean;
};

export function SubscriptionTable({ subscriptions, page, pages, onPageChange, isLoading }: Props) {
  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading subscriptions…</p>;
  }

  if (subscriptions.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">
        No subscriptions yet.{' '}
        <Link href="/subscriptions/new" className="font-medium text-foreground underline-offset-4 hover:underline">
          Create your first
        </Link>
        .
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="overflow-hidden rounded-xl border border-border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Cycle</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Renewal</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {subscriptions.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">{s.name}</TableCell>
                <TableCell>{formatINR(s.price)}</TableCell>
                <TableCell className="capitalize">{s.billingCycle}</TableCell>
                <TableCell className="capitalize">{s.category}</TableCell>
                <TableCell>
                  <StatusBadge status={s.status} />
                </TableCell>
                <TableCell>{formatDate(s.renewalDate)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`/subscriptions/${s.id}`}>View</Link>
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {pages > 1 && (
        <Pagination>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                href="#"
                className={page <= 1 ? 'pointer-events-none opacity-40' : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  if (page > 1) onPageChange(page - 1);
                }}
              />
            </PaginationItem>
            <PaginationItem>
              <span className="px-3 text-sm text-muted-foreground">
                Page {page} of {pages}
              </span>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext
                href="#"
                className={page >= pages ? 'pointer-events-none opacity-40' : undefined}
                onClick={(e) => {
                  e.preventDefault();
                  if (page < pages) onPageChange(page + 1);
                }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
