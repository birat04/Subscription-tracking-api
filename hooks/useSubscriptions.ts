'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { subscriptionService } from '@/services/subscription.service';
import { toast } from 'sonner';
import type { Subscription } from '@/types/subscription.types';

export type SubscriptionsListData = {
  success: boolean;
  subscriptions?: Subscription[];
  total?: number;
  page?: number;
  pages?: number;
  message?: string;
};

export const KEYS = {
  all: ['subscriptions'] as const,
  list: (page: number, limit: number) => ['subscriptions', 'list', page, limit] as const,
  detail: (id: string) => ['subscriptions', id] as const,
};

export function useSubscriptions(page = 1, limit = 10) {
  return useQuery({
    queryKey: KEYS.list(page, limit),
    queryFn: async (): Promise<SubscriptionsListData> => {
      const res = (await subscriptionService.getAll(page, limit)) as SubscriptionsListData;
      if (!res.success) throw new Error(res.message ?? 'Failed to load subscriptions');
      return res;
    },
  });
}

export function useSubscription(id: string) {
  return useQuery({
    queryKey: KEYS.detail(id),
    queryFn: async () => {
      const res = (await subscriptionService.getById(id)) as {
        success: boolean;
        subscription?: Subscription;
        message?: string;
      };
      if (!res.success || !res.subscription) throw new Error(res.message ?? 'Not found');
      return res.subscription;
    },
    enabled: !!id,
  });
}

async function assertSuccess<T extends { success?: boolean; message?: string }>(res: T) {
  if (res && 'success' in res && res.success === false) {
    throw new Error(res.message ?? 'Request failed');
  }
  return res;
}

export function useCreateSubscription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: unknown) =>
      assertSuccess((await subscriptionService.create(data)) as { success: boolean; message?: string }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: KEYS.all });
      toast.success('Subscription added!');
    },
    onError: () => toast.error('Failed to create subscription'),
  });
}

export function useUpdateSubscription(id: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (data: unknown) =>
      assertSuccess(
        (await subscriptionService.update(id, data)) as { success: boolean; message?: string }
      ),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: KEYS.all });
      void qc.invalidateQueries({ queryKey: KEYS.detail(id) });
      toast.success('Subscription updated');
    },
    onError: () => toast.error('Failed to update'),
  });
}

export function useDeleteSubscription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) =>
      assertSuccess((await subscriptionService.delete(id)) as { success: boolean; message?: string }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: KEYS.all });
      toast.success('Subscription removed');
    },
    onError: () => toast.error('Failed to delete'),
  });
}

export function useCancelSubscription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) =>
      assertSuccess((await subscriptionService.cancel(id)) as { success: boolean; message?: string }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: KEYS.all });
      toast.success('Subscription cancelled');
    },
  });
}

export function useRenewSubscription() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) =>
      assertSuccess((await subscriptionService.renew(id)) as { success: boolean; message?: string }),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: KEYS.all });
      toast.success('Renewed!');
    },
  });
}
