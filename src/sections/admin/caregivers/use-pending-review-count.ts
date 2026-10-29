import { useQuery } from '@tanstack/react-query';

import { adminCaregiversService } from 'src/api/admin-services';
import { getAccessToken } from 'src/lib/auth/storage';

import { PENDING_REVIEW_COUNT_QUERY_KEY } from './verification-utils';

const PENDING_REVIEW_POLL_MS = 60_000;

/** Number of caregivers that are PENDING with an approved Didit session (from meta.pagination.total). */
export function usePendingReviewCount() {
  const query = useQuery({
    queryKey: PENDING_REVIEW_COUNT_QUERY_KEY,
    queryFn: async () => {
      const response = await adminCaregiversService.getCaregivers({ pending_review: true, page: 1, limit: 1 });
      return response.meta.total;
    },
    enabled: !!getAccessToken(),
    staleTime: 30_000,
    refetchInterval: PENDING_REVIEW_POLL_MS,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    retry: false,
  });

  return { count: query.data ?? 0, ...query };
}
