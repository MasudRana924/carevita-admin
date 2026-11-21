import { useQuery } from '@tanstack/react-query';

import { adminPaymentsService } from 'src/api/admin-services';
import { getAccessToken } from 'src/lib/auth/storage';

import { READY_TO_PAY_SUMMARY_QUERY_KEY } from './payment-utils';

const READY_TO_PAY_POLL_MS = 60_000;

/** Unfiltered payout summary (`meta.summary`) for the sidebar badge and dashboard card. */
export function useReadyToPaySummary() {
  return useQuery({
    queryKey: READY_TO_PAY_SUMMARY_QUERY_KEY,
    queryFn: async () => {
      const response = await adminPaymentsService.getPayments({
        payout_status: 'READY_FOR_PAYOUT',
        page: 1,
        limit: 1,
      });
      return response.summary;
    },
    enabled: !!getAccessToken(),
    staleTime: 30_000,
    refetchInterval: READY_TO_PAY_POLL_MS,
    refetchIntervalInBackground: false,
    refetchOnWindowFocus: true,
    retry: false,
  });
}
