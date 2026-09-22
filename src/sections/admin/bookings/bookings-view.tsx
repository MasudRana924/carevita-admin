import { useNavigate } from 'react-router-dom';

import Stack from '@mui/material/Stack';

import { AdminListPage } from '../admin-list-page';
import { StatusBadge } from 'src/components/status-badge';
import { bookingsApi } from 'src/lib/api';
import { pickNumber, pickString } from 'src/lib/utils';
import { fDate, fDateTime } from 'src/utils/format-time';

import { OfferExpiryText } from './offer-expiry-text';

export const BOOKING_STATUSES = [
  'SEARCHING_PROVIDER',
  'PROVIDER_ASSIGNED',
  'PROVIDER_ACCEPTED',
  'PAYMENT_PAID',
  'SERVICE_IN_PROGRESS',
  'SERVICE_COMPLETED',
  'CANCELLED_BY_USER',
  'CANCELLED_BY_PROVIDER',
  'CANCELLED_BY_ADMIN',
];

export function BookingsView() {
  const navigate = useNavigate();

  return (
    <AdminListPage
      title="Bookings"
      description="Users select a caregiver directly. If the offer expires or is rejected, the booking returns to searching."
      queryKey="admin-bookings"
      fetcher={bookingsApi.list}
      emptyTitle="No bookings found"
      hideSearch
      filters={[
        {
          id: 'status',
          label: 'Status',
          options: BOOKING_STATUSES.map((value) => ({
            value,
            label:
              value === 'SEARCHING_PROVIDER'
                ? 'Searching caregiver'
                : value.replace(/_/g, ' '),
          })),
        },
        { id: 'date_from', label: 'From', type: 'date' },
        { id: 'date_to', label: 'To', type: 'date' },
      ]}
      columns={[
        { id: 'id', label: 'Booking', render: (row) => pickString(row, ['booking_number', 'id']) },
        {
          id: 'customer',
          label: 'Customer',
          render: (row) => pickString(row, ['customer_name', 'user_name', 'user_id']),
        },
        {
          id: 'caregiver',
          label: 'Caregiver',
          render: (row) => pickString(row, ['caregiver_name', 'provider_name']),
        },
        {
          id: 'status',
          label: 'Status',
          render: (row) => {
            const status = pickString(row, ['status'], '');
            const offerExpiresAt = pickString(row, ['offer_expires_at'], '');
            const timeoutMinutes = pickNumber(row, ['accept_timeout_minutes']);

            return (
              <Stack spacing={0.5} sx={{ minWidth: 180 }}>
                <StatusBadge
                  value={status}
                  label={status === 'SEARCHING_PROVIDER' ? 'Searching caregiver' : undefined}
                />
                {status === 'PROVIDER_ASSIGNED' && offerExpiresAt && offerExpiresAt !== '—' ? (
                  <OfferExpiryText expiresAt={offerExpiresAt} timeoutMinutes={timeoutMinutes} />
                ) : null}
              </Stack>
            );
          },
        },
        {
          id: 'booking_date',
          label: 'Date',
          render: (row) => {
            const value = pickString(row, ['booking_date', 'scheduled_at', 'created_at'], '');
            return value && value !== '—' ? fDate(value) : '—';
          },
        },
        {
          id: 'created_at',
          label: 'Created',
          render: (row) => {
            const value = pickString(row, ['created_at'], '');
            return value && value !== '—' ? fDateTime(value) : '—';
          },
        },
      ]}
      actions={[
        {
          label: 'View',
          icon: 'eva:eye-fill',
          onClick: (row) => navigate(`/bookings/${pickString(row, ['id'])}`),
        },
        ({ confirm }) => ({
          label: 'Cancel',
          icon: 'eva:close-fill',
          color: 'error',
          hidden: (row) => String(row.status || '').startsWith('CANCELLED'),
          onClick: (row) =>
            confirm(row, {
              title: 'Cancel booking',
              content: 'This will cancel the booking as admin. Enter a reason.',
              confirmLabel: 'Cancel booking',
              prompt: { label: 'Reason', required: true },
              run: (_, extra) => bookingsApi.cancel(pickString(row, ['id']), extra?.note || ''),
              successMessage: 'Booking cancelled',
            }),
        }),
      ]}
    />
  );
}
