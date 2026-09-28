import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

import { adminConversationsService } from 'src/api/admin-services';
import { getAccessToken } from 'src/lib/auth/storage';

import { UNREAD_SUMMARY_POLL_MS, UNREAD_SUMMARY_QUERY_KEY } from './utils';

export function useUnreadSummary() {
  return useQuery({
    queryKey: UNREAD_SUMMARY_QUERY_KEY,
    queryFn: adminConversationsService.getUnreadSummary,
    enabled: !!getAccessToken(),
    staleTime: 0,
    refetchInterval: UNREAD_SUMMARY_POLL_MS,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    retry: false,
  });
}

export function useRefreshUnreadSummary() {
  const queryClient = useQueryClient();
  return useCallback(() => {
    queryClient.invalidateQueries({ queryKey: UNREAD_SUMMARY_QUERY_KEY });
  }, [queryClient]);
}
