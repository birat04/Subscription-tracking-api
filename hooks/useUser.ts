'use client';

import { useQuery } from '@tanstack/react-query';
import { authService } from '@/services/auth.service';
import type { UserPublic } from '@/types/auth.types';

export const USER_KEY = ['me'] as const;

export function useUser() {
  return useQuery({
    queryKey: USER_KEY,
    queryFn: async (): Promise<UserPublic | null> => {
      const res = (await authService.me()) as {
        success: boolean;
        user?: UserPublic;
      };
      if (!res.success || !res.user) return null;
      return res.user;
    },
  });
}
