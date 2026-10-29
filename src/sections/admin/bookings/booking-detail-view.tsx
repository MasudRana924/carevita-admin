import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';

import { DashboardContent } from 'src/layouts/dashboard';
import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { PageHeader } from 'src/components/page-header';
import { DetailSkeleton, ErrorState } from 'src/components/page-states';
import { RecordFields } from 'src/components/record-fields';
import { DetailRow, InfoTile, ProfileHero, SectionCard, StatTile } from 'src/components/detail-ui';
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
      <DashboardContent>
        <DetailSkeleton />
      </DashboardContent>
    );
  }

  const bookingNumber = pickString(booking, ['booking_number', 'id'], 'Booking details');
  const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Bookings', href: '/bookings' },
    { title: bookingNumber },
  ];

  if (bookingQuery.error) {
    return (
      <DashboardContent>
        <PageHeader title="Booking details" breadcrumbs={breadcrumbs} />
        <ErrorState message={getErrorMessage(bookingQuery.error)} onRetry={() => bookingQuery.refetch()} />
      </DashboardContent>
    );
  }

  const customer = pickString(booking, ['customer_name', 'user_name', 'user_id']);
  const caregiver = pickString(booking, ['caregiver_name', 'provider_name']);
  const bookingDate = pickString(booking, ['booking_date', 'scheduled_at'], '');

  return (
    <DashboardContent>
      <PageHeader title="Booking details" breadcrumbs={breadcrumbs} />

      <Stack spacing={3}>
        <ProfileHero
          avatarIcon="solar:clipboard-list-bold-duotone"
          name={bookingNumber}
          subtitle={booking.created_at ? `Created ${fDateTime(String(booking.created_at))}` : undefined}
          badges={
            <>
              <StatusBadge value={bookingStatus} label={isSearching ? 'Searching caregiver' : undefined} />
              {booking.payout_frozen != null && (
                <StatusBadge
                  value={!booking.payout_frozen}
                  label={booking.payout_frozen ? 'Payout frozen' : 'Payout OK'}
                />
              )}
            </>
          }
          actions={
            !cancelled ? (
              <Button
                color="error"
                variant="contained"
                startIcon={<Iconify icon="solar:close-circle-bold" />}
                onClick={() => setCancelOpen(true)}
              >
                Cancel booking
              </Button>
            ) : null
          }
          tiles={
            <>
              <InfoTile icon="solar:user-rounded-bold-duotone" label="Customer" value={customer} />
              <InfoTile icon="solar:hand-heart-bold-duotone" label="Caregiver" value={caregiver} />
              <InfoTile
                icon="solar:calendar-bold-duotone"
                label="Booking date"
                value={bookingDate && bookingDate !== '—' ? fDateTime(bookingDate) : '—'}
              />
              <InfoTile icon="solar:hashtag-bold-duotone" label="Booking ID" value={bookingId} />
            </>
          }
        />

        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' } }}>
          <StatTile icon="solar:wallet-money-bold-duotone" color="primary" label="Paid" value={money(originalAmount)} />
          <StatTile icon="solar:undo-left-round-bold" color="warning" label="Refunded" value={money(refundedAmount)} />
          <StatTile icon="solar:safe-square-bold-duotone" color="success" label="Remaining" value={money(remaining)} />
        </Box>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, lg: 8 }}>
            <Stack spacing={3}>
              <SectionCard
                icon="solar:clipboard-text-bold-duotone"
                color="primary"
                title="Booking"
                subtitle="Assignment and payout status"
              >
                <Stack spacing={1.75}>
                  <DetailRow
                    label="Status"
                    value={<StatusBadge value={bookingStatus} label={isSearching ? 'Searching caregiver' : undefined} />}
                  />
                  <DetailRow label="Customer" value={customer} />
                  <DetailRow label="Caregiver" value={caregiver} />
                  <DetailRow label="Created" value={booking.created_at ? fDateTime(String(booking.created_at)) : '—'} />
                  {acceptTimeoutMinutes != null && isProviderAssigned && (
                    <DetailRow label="Accept timeout" value={`${acceptTimeoutMinutes} minutes`} />
                  )}
                  {booking.payout_frozen != null && (
                    <DetailRow
                      label="Payout"
                      value={
                        <StatusBadge
                          value={Boolean(booking.payout_frozen)}
                          label={booking.payout_frozen ? 'Frozen' : 'OK'}
                        />
                      }
                    />
                  )}
                </Stack>
                {isProviderAssigned && offerExpiresAt && offerExpiresAt !== '—' && (
                  <Box sx={{ mt: 2, p: 1.5, borderRadius: 1.5, bgcolor: 'warning.lighter' }}>
                    <Typography variant="caption" sx={{ color: 'warning.darker', fontWeight: 600 }}>
                      Offer window
                    </Typography>
                    <OfferExpiryText expiresAt={offerExpiresAt} timeoutMinutes={acceptTimeoutMinutes} />
                  </Box>
                )}
                {isSearching && (
                  <Stack
                    direction="row"
                    spacing={1.5}
                    alignItems="center"
                    sx={{ mt: 2, p: 1.5, borderRadius: 1.5, bgcolor: 'info.lighter', color: 'info.darker' }}
                  >
                    <Iconify icon="solar:magnifer-linear" width={20} />
                    <Typography variant="body2">
                      Searching caregiver — waiting for assignment or reassignment after reject/timeout.
                    </Typography>
                  </Stack>
                )}
              </SectionCard>

              <SectionCard
                icon="solar:history-bold-duotone"
                color="warning"
                title="Refund history"
                count={history.length}
                noPadding
              >
                {history.length ? (
                  <Table>
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
                        <TableRow key={pickString(row, ['refundTrxId', 'id'], String(index))} hover>
                          <TableCell sx={{ fontFamily: 'monospace' }}>{pickString(row, ['refundTrxId', 'id'])}</TableCell>
                          <TableCell>
                            <StatusBadge value={pickString(row, ['refundTransactionStatus', 'status'], '')} />
                          </TableCell>
                          <TableCell sx={{ fontWeight: 600 }}>{money(row.refundAmount ?? row.amount)}</TableCell>
                          <TableCell>
                            {row.completedTime
                              ? fDateTime(String(row.completedTime))
                              : pickString(row, ['created_at', 'completed_at'])}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <Stack alignItems="center" spacing={1} sx={{ py: 5, color: 'text.secondary' }}>
                    <Iconify icon="solar:bill-list-bold-duotone" width={36} sx={{ opacity: 0.6 }} />
                    <Typography variant="body2">No refund transactions yet.</Typography>
                  </Stack>
                )}
              </SectionCard>

              {Boolean(cancelResult.cancellation_policy || cancelResult.refund) && (
                <RecordFields title="Last cancellation response" record={cancelResult} />
              )}

              <RecordFields title="Booking record" record={booking} />
            </Stack>
          </Grid>

          <Grid size={{ xs: 12, lg: 4 }}>
            <Stack spacing={3} sx={{ position: { lg: 'sticky' }, top: { lg: 88 } }}>
              <SectionCard
                icon="solar:hand-money-bold-duotone"
                color="error"
                title="Issue refund"
                subtitle="bKash refund for this booking"
                action={
                  <Tooltip title="Refresh refund status">
                    <span>
                      <IconButton onClick={() => statusQuery.refetch()} disabled={statusQuery.isFetching}>
                        {statusQuery.isFetching ? (
                          <CircularProgress size={18} />
                        ) : (
                          <Iconify icon="solar:restart-bold" width={20} />
                        )}
                      </IconButton>
                    </span>
                  </Tooltip>
                }
              >
                <Stack spacing={2}>
                  <TextField
                    fullWidth
                    label="Amount"
                    placeholder="Leave empty to refund remaining"
                    value={refundAmount}
                    onChange={(event) => setRefundAmount(event.target.value)}
                    disabled={refundDisabled}
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <Typography sx={{ color: 'text.disabled', fontWeight: 600 }}>৳</Typography>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                  <TextField
                    fullWidth
                    multiline
                    minRows={2}
                    label="Reason"
                    value={refundReason}
                    onChange={(event) => setRefundReason(event.target.value)}
                    disabled={refundDisabled}
                  />
                  <Button
                    fullWidth
                    size="large"
                    variant="contained"
                    color="error"
                    disabled={refundDisabled || refundMutation.isPending}
                    startIcon={
                      refundMutation.isPending ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : (
                        <Iconify icon="solar:undo-left-round-bold" />
                      )
                    }
                    onClick={() => refundMutation.mutate()}
                  >
                    Refund
                  </Button>
                  <Typography variant="caption" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                    {refundCount} of {MAX_REFUNDS} refunds used
                  </Typography>
                </Stack>

                {refundDisabled && (
                  <Typography
                    variant="body2"
                    sx={{ mt: 2, p: 1.5, borderRadius: 1, bgcolor: 'background.neutral', color: 'text.secondary' }}
                  >
                    {remaining != null && remaining <= 0
                      ? 'Nothing left to refund.'
                      : 'Maximum of 10 refunds has been reached.'}
                  </Typography>
                )}
                {timeoutHint && (
                  <Typography
                    variant="body2"
                    sx={{ mt: 2, p: 1.5, borderRadius: 1, bgcolor: 'warning.lighter', color: 'warning.darker' }}
                  >
                    {timeoutHint}
                  </Typography>
                )}
              </SectionCard>
            </Stack>
          </Grid>
        </Grid>
      </Stack>

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
