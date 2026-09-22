import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { PageHeader } from 'src/components/page-header';
import { DetailSkeleton, ErrorState } from 'src/components/page-states';
import { InfoCard, InfoField, RecordFields } from 'src/components/record-fields';
import { StatusBadge } from 'src/components/status-badge';
import { useSnackbar } from 'src/components/snackbar';
import { bookingsApi, bkashApi } from 'src/lib/api';
import { getErrorMessage, pickNumber, pickString } from 'src/lib/utils';
import { fDateTime } from 'src/utils/format-time';

import { OfferExpiryText } from './offer-expiry-text';

const MAX_REFUNDS = 10;

function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}

function asList(value: unknown): Record<string, unknown>[] {
  return Array.isArray(value) ? value.filter((item) => item && typeof item === 'object') : [];
}

function money(value: unknown) {
  if (value === undefined || value === null || value === '') return '—';
  const amount = Number(value);
  if (Number.isNaN(amount)) return String(value);
  return `৳${amount.toLocaleString()}`;
}

export function BookingDetailView() {
  const { id = '' } = useParams();
  const { showSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [cancelOpen, setCancelOpen] = useState(false);
  const [reason, setReason] = useState('');
  const [refundAmount, setRefundAmount] = useState('');
  const [refundReason, setRefundReason] = useState('');
  const [timeoutHint, setTimeoutHint] = useState('');

  const bookingQuery = useQuery({
    queryKey: ['admin-booking', id],
    queryFn: async () => asRecord(await bookingsApi.get(id)),
    enabled: Boolean(id),
  });

  const booking = bookingQuery.data || {};
  const payment = asRecord(booking.payment);
  const paymentId = pickString(
    { ...booking, ...payment },
    ['paymentId', 'payment_id', 'bkash_payment_id', 'trxID', 'trx_id'],
    ''
  );
  const bookingId = pickString(booking, ['id'], id);
  const sku = pickString({ ...booking, ...payment }, ['sku', 'booking_number'], bookingId);

  const statusQuery = useQuery({
    queryKey: ['bkash-refund-status', bookingId, paymentId],
    queryFn: async () =>
      asRecord(
        await bkashApi.refundStatus({
          booking_id: bookingId,
          ...(paymentId && paymentId !== '—' ? { paymentId } : {}),
        })
      ),
    enabled: Boolean(bookingId),
  });

  const refundData = statusQuery.data || {};
  const bkash = asRecord(refundData.bkash);
  const refundTransactions = asList(bkash.refundTransactions);
  const localRefunds = asList(refundData.local);
  const history = refundTransactions.length ? refundTransactions : localRefunds;

  const remaining = pickNumber(refundData, ['remaining']) ?? pickNumber(bkash, ['remaining']);
  const originalAmount =
    pickNumber(bkash, ['originalTrxAmount']) ??
    pickNumber({ ...booking, ...payment }, ['amount', 'paid_amount', 'total_amount']);
  const refundedAmount =
    originalAmount != null && remaining != null ? Math.max(originalAmount - remaining, 0) : pickNumber(refundData, ['refunded']);

  const refundCount = history.length;
  const refundDisabled = (remaining != null && remaining <= 0) || refundCount >= MAX_REFUNDS;
  const cancelled = String(booking.status || '').startsWith('CANCELLED');

  const cancelMutation = useMutation({
    mutationFn: () => bookingsApi.cancel(bookingId, reason),
    onSuccess: (data) => {
      showSnackbar('Booking cancelled', 'success');
      setCancelOpen(false);
      setReason('');
      queryClient.invalidateQueries({ queryKey: ['admin-booking', id] });
      queryClient.invalidateQueries({ queryKey: ['admin-bookings'] });
      const result = asRecord(data);
      if (result.refund || result.cancellation_policy) {
        showSnackbar('Cancellation policy and refund details were returned by the API', 'info');
      }
    },
    onError: (error) => showSnackbar(getErrorMessage(error), 'error'),
  });

  const refundMutation = useMutation({
    mutationFn: () => {
      setTimeoutHint('');
      const payload: Record<string, unknown> = {
        booking_id: bookingId,
        sku,
        reason: refundReason || 'Admin refund',
      };
      if (paymentId && paymentId !== '—') payload.paymentId = paymentId;
      if (refundAmount.trim()) payload.refundAmount = Number(refundAmount).toFixed(2);
      return bkashApi.refund(payload);
    },
    onSuccess: (data) => {
      const result = asRecord(data);
      const status = pickString(asRecord(result.bkash), ['refundTransactionStatus'], '');
      if (status && status !== 'Completed') {
        showSnackbar(`Refund was not completed (${status}). Click Refund Status to refresh.`, 'warning');
      } else {
        showSnackbar('Refund completed', 'success');
      }
      setRefundAmount('');
      setRefundReason('');
      queryClient.invalidateQueries({ queryKey: ['bkash-refund-status', bookingId, paymentId] });
      queryClient.invalidateQueries({ queryKey: ['admin-booking', id] });
    },
    onError: (error) => {
      const axiosError = error as { code?: string; message?: string };
      if (axiosError.code === 'ECONNABORTED' || axiosError.message?.toLowerCase().includes('timeout')) {
        const message = 'The request timed out. Click Refund Status to check whether it completed.';
        setTimeoutHint(message);
        showSnackbar(message, 'error');
        return;
      }
      const message = getErrorMessage(error);
      showSnackbar(message, 'error');
    },
  });

  const cancelResult = useMemo(() => asRecord(cancelMutation.data), [cancelMutation.data]);

  const bookingStatus = pickString(booking, ['status'], '');
  const offerExpiresAt = pickString(booking, ['offer_expires_at'], '');
  const acceptTimeoutMinutes = pickNumber(booking, ['accept_timeout_minutes']);
  const isProviderAssigned = bookingStatus === 'PROVIDER_ASSIGNED';
  const isSearching = bookingStatus === 'SEARCHING_PROVIDER';

  if (bookingQuery.isLoading) {
    return (
      <DashboardContent maxWidth="xl">
        <DetailSkeleton />
      </DashboardContent>
    );
  }

  if (bookingQuery.error) {
    return (
      <DashboardContent maxWidth="xl">
        <PageHeader title="Booking details" />
        <ErrorState message={getErrorMessage(bookingQuery.error)} onRetry={() => bookingQuery.refetch()} />
      </DashboardContent>
    );
  }

  return (
    <DashboardContent maxWidth="xl">
      <PageHeader
        title={pickString(booking, ['booking_number', 'id'], 'Booking details')}
        action={
          !cancelled ? (
            <Button color="error" variant="contained" onClick={() => setCancelOpen(true)}>
              Cancel booking
            </Button>
          ) : null
        }
      />

      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, mb: 3 }}>
        <InfoCard title="Booking">
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
            <InfoField
              label="Status"
              value={
                <StatusBadge
                  value={bookingStatus}
                  label={isSearching ? 'Searching caregiver' : undefined}
                />
              }
            />
            <InfoField label="Customer" value={pickString(booking, ['customer_name', 'user_name', 'user_id'])} />
            <InfoField label="Caregiver" value={pickString(booking, ['caregiver_name', 'provider_name'])} />
            <InfoField label="Created" value={booking.created_at ? fDateTime(String(booking.created_at)) : '—'} />
            {isProviderAssigned && offerExpiresAt && offerExpiresAt !== '—' && (
              <Box sx={{ gridColumn: '1 / -1' }}>
                <InfoField
                  label="Offer window"
                  value={
                    <OfferExpiryText
                      expiresAt={offerExpiresAt}
                      timeoutMinutes={acceptTimeoutMinutes}
                    />
                  }
                />
              </Box>
            )}
            {isSearching && (
              <Box sx={{ gridColumn: '1 / -1' }}>
                <Typography variant="body2" color="info.main">
                  Searching caregiver — waiting for assignment or reassignment after reject/timeout.
                </Typography>
              </Box>
            )}
            {acceptTimeoutMinutes != null && isProviderAssigned && (
              <InfoField label="Accept timeout" value={`${acceptTimeoutMinutes} minutes`} />
            )}
            {booking.payout_frozen != null && (
              <InfoField
                label="Payout"
                value={
                  <StatusBadge
                    value={Boolean(booking.payout_frozen)}
                    label={booking.payout_frozen ? 'Frozen' : 'OK'}
                  />
                }
              />
            )}
          </Box>
        </InfoCard>

        <InfoCard
          title="Payment / refund"
          action={
            <Button size="small" variant="outlined" onClick={() => statusQuery.refetch()} disabled={statusQuery.isFetching}>
              {statusQuery.isFetching ? 'Refreshing...' : 'Refund Status'}
            </Button>
          }
        >
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr 1fr' } }}>
            <InfoField label="Paid" value={money(originalAmount)} />
            <InfoField label="Refunded" value={money(refundedAmount)} />
            <InfoField label="Remaining" value={money(remaining)} />
          </Box>
          {timeoutHint && (
            <Typography variant="body2" color="warning.main" sx={{ mt: 2 }}>
              {timeoutHint}
            </Typography>
          )}
        </InfoCard>
      </Box>

      <Card sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Refund
        </Typography>
        <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems={{ md: 'center' }}>
          <TextField
            label="Amount"
            placeholder="Leave empty to refund remaining"
            value={refundAmount}
            onChange={(event) => setRefundAmount(event.target.value)}
            disabled={refundDisabled}
            sx={{ minWidth: 220 }}
          />
          <TextField
            label="Reason"
            value={refundReason}
            onChange={(event) => setRefundReason(event.target.value)}
            disabled={refundDisabled}
            sx={{ flexGrow: 1 }}
          />
          <Button
            variant="contained"
            color="error"
            disabled={refundDisabled || refundMutation.isPending}
            startIcon={refundMutation.isPending ? <CircularProgress size={16} /> : null}
            onClick={() => refundMutation.mutate()}
          >
            Refund
          </Button>
        </Stack>
        {refundDisabled && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
            {remaining != null && remaining <= 0
              ? 'Nothing left to refund.'
              : 'Maximum of 10 refunds has been reached.'}
          </Typography>
        )}
      </Card>

      <Card sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
        <Typography variant="h6" sx={{ mb: 2 }}>
          Refund history
        </Typography>
        {history.length ? (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Refund Trx</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Completed</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.map((row, index) => (
                <TableRow key={pickString(row, ['refundTrxId', 'id'], String(index))}>
                  <TableCell>{pickString(row, ['refundTrxId', 'id'])}</TableCell>
                  <TableCell>
                    <StatusBadge value={pickString(row, ['refundTransactionStatus', 'status'], '')} />
                  </TableCell>
                  <TableCell>{money(row.refundAmount ?? row.amount)}</TableCell>
                  <TableCell>
                    {row.completedTime ? fDateTime(String(row.completedTime)) : pickString(row, ['created_at', 'completed_at'])}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Typography color="text.secondary">No refund transactions yet.</Typography>
        )}
      </Card>

      {Boolean(cancelResult.cancellation_policy || cancelResult.refund) && (
        <Box sx={{ mb: 3 }}>
          <RecordFields title="Last cancellation response" record={cancelResult} />
        </Box>
      )}

      <RecordFields title="Booking record" record={booking} />

      <ConfirmDialog
        open={cancelOpen}
        onClose={() => !cancelMutation.isPending && setCancelOpen(false)}
        title="Cancel booking"
        content={
          <TextField
            fullWidth
            multiline
            minRows={3}
            label="Reason"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            sx={{ mt: 1 }}
          />
        }
        action={
          <Button
            color="error"
            variant="contained"
            disabled={cancelMutation.isPending || !reason.trim()}
            startIcon={cancelMutation.isPending ? <CircularProgress size={16} /> : null}
            onClick={() => cancelMutation.mutate()}
          >
            Cancel booking
          </Button>
        }
      />
    </DashboardContent>
  );
}
