'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/auth.service';
import { USER_KEY } from '@/hooks/useUser';
import { KEYS } from '@/hooks/useSubscriptions';

export function useSignOut() {
  const router = useRouter();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: authService.signOut,
    onSuccess: async () => {
      qc.removeQueries({ queryKey: USER_KEY });
      qc.removeQueries({ queryKey: KEYS.all });
      router.push('/sign-in');
      router.refresh();
    },
  });
}
