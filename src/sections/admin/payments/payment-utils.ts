import type { LabelColor } from 'src/components/label';
import type { PayoutStatus } from 'src/api/admin-types';

import { fDateTime } from 'src/utils/format-time';

/** Root key for every payments query; invalidating it refreshes lists, summary, sidebar badge and dashboard card. */
export const PAYMENTS_QUERY_KEY = ['admin-payments'] as const;
export const PAYMENTS_LIST_QUERY_KEY = [...PAYMENTS_QUERY_KEY, 'list'] as const;
export const READY_TO_PAY_SUMMARY_QUERY_KEY = [...PAYMENTS_QUERY_KEY, 'ready-summary'] as const;
export const paymentDetailQueryKey = (id: string) => [...PAYMENTS_QUERY_KEY, 'detail', id] as const;

const BDT_FORMATTER = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatBDT(value?: number | string | null) {
  if (value === null || value === undefined || value === '') return '—';
  const amount = Number(value);
  if (Number.isNaN(amount)) return '—';
  return `৳${BDT_FORMATTER.format(amount)}`;
}

export function fDateTimeOrDash(value?: string | null) {
  return value ? fDateTime(value) : '—';
}

export const PAYOUT_STATUS_META: Record<PayoutStatus, { label: string; color: LabelColor }> = {
  AWAITING_SERVICE_END: { label: 'Service in progress', color: 'default' },
  READY_FOR_PAYOUT: { label: 'Ready to pay', color: 'warning' },
  PAID_TO_CAREGIVER: { label: 'Paid', color: 'success' },
  NOT_PAYABLE: { label: 'Not payable', color: 'default' },
};

export type PaymentsTab = 'ready' | 'in_progress' | 'paid' | 'not_payable' | 'all';

export const PAYMENT_TABS: { value: PaymentsTab; label: string; payoutStatus?: PayoutStatus }[] = [
  { value: 'ready', label: 'Ready to pay', payoutStatus: 'READY_FOR_PAYOUT' },
  { value: 'in_progress', label: 'Service in progress', payoutStatus: 'AWAITING_SERVICE_END' },
  { value: 'paid', label: 'Paid', payoutStatus: 'PAID_TO_CAREGIVER' },
  { value: 'not_payable', label: 'Not payable', payoutStatus: 'NOT_PAYABLE' },
  { value: 'all', label: 'All' },
];

export const DEFAULT_PAYMENTS_TAB: PaymentsTab = 'ready';

/** Empty value = API default (successful payments: COMPLETED, PARTIAL_REFUND, REFUNDED). */
export const PAYMENT_STATUS_OPTIONS = [
  { value: '', label: 'Successful (default)' },
  { value: 'COMPLETED', label: 'Completed' },
  { value: 'PARTIAL_REFUND', label: 'Partial refund' },
  { value: 'REFUNDED', label: 'Refunded' },
  { value: 'FAILED', label: 'Failed' },
  { value: 'CREATED', label: 'Created (unpaid)' },
  { value: 'ALL', label: 'All attempts' },
];

export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100];
export const DEFAULT_PAGE_SIZE = 20;

export const TRX_ID_MAX_LENGTH = 100;
export const PAYOUT_NOTE_MAX_LENGTH = 500;

export function getHttpStatus(error: unknown) {
  return (error as { response?: { status?: number } })?.response?.status;
}
