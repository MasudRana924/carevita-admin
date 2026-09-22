import { AdminListPage } from '../admin-list-page';
import { StatusBadge } from 'src/components/status-badge';
import { withdrawalsApi } from 'src/lib/api';
import { pickString } from 'src/lib/utils';
import { fDateTime } from 'src/utils/format-time';

export function WithdrawalsView() {
  return (
    <AdminListPage
      title="Withdrawals"
      description="Approve or reject caregiver wallet withdrawals. Approval debits the caregiver wallet and sends to the bKash number."
      queryKey="admin-withdrawals"
      fetcher={withdrawalsApi.list}
      emptyTitle="No withdrawal requests"
      hideSearch
      filters={[
        {
          id: 'status',
          label: 'Status',
          options: ['PENDING', 'PROCESSING', 'COMPLETED', 'REJECTED', 'APPROVED'].map((value) => ({
            value,
            label: value,
          })),
        },
      ]}
      columns={[
        { id: 'caregiver_name', label: 'Caregiver', render: (row) => pickString(row, ['caregiver_name', 'provider_name', 'name']) },
        { id: 'bkash_number', label: 'bKash number', render: (row) => pickString(row, ['bkash_number', 'bkash', 'payment_account']) },
        {
          id: 'amount',
          label: 'Amount',
          render: (row) => {
            const amount = pickString(row, ['amount'], '0');
            return amount === '—' ? '—' : `৳${amount}`;
          },
        },
        { id: 'status', label: 'Status', render: (row) => <StatusBadge value={pickString(row, ['status'], '')} /> },
        {
          id: 'created_at',
          label: 'Requested',
          render: (row) => {
            const value = pickString(row, ['created_at', 'requested_at'], '');
            return value && value !== '—' ? fDateTime(value) : '—';
          },
        },
      ]}
      actions={[
        ({ confirm }) => ({
          label: 'Approve',
          icon: 'eva:checkmark-fill',
          color: 'success',
          hidden: (row) => !['PENDING', 'PROCESSING', 'pending', 'processing'].includes(String(row.status || '')),
          onClick: (row) =>
            confirm(row, {
              title: 'Approve withdrawal',
              content: `Debit the caregiver wallet and send ৳${pickString(row, ['amount'], '0')} to ${pickString(row, ['bkash_number'])}?`,
              confirmLabel: 'Approve',
              color: 'success',
              prompt: { label: 'Note (optional)' },
              run: (_, extra) => withdrawalsApi.approve(pickString(row, ['id']), extra?.note ? { note: extra.note } : {}),
              successMessage: 'Withdrawal approved',
            }),
        }),
        ({ confirm }) => ({
          label: 'Reject',
          icon: 'eva:close-fill',
          color: 'error',
          hidden: (row) => !['PENDING', 'PROCESSING', 'pending', 'processing'].includes(String(row.status || '')),
          onClick: (row) =>
            confirm(row, {
              title: 'Reject withdrawal',
              content: `Reject this withdrawal for ${pickString(row, ['caregiver_name'])}?`,
              confirmLabel: 'Reject',
              prompt: { label: 'Note (optional)' },
              run: (_, extra) => withdrawalsApi.reject(pickString(row, ['id']), extra?.note ? { note: extra.note } : {}),
              successMessage: 'Withdrawal rejected',
            }),
        }),
      ]}
    />
  );
}
