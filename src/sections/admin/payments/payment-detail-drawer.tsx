import { useQuery } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import Skeleton from '@mui/material/Skeleton';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { RouterLink } from 'src/routes/components';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { ErrorState } from 'src/components/page-states';
import { StatusBadge } from 'src/components/status-badge';
import { adminPaymentsService } from 'src/api/admin-services';
import { getErrorMessage } from 'src/lib/utils';

import type { AdminPayment, AdminPaymentDetail } from 'src/api/admin-types';

import { PayoutStatusBadge } from './payout-status-badge';
import { fDateTimeOrDash, formatBDT, paymentDetailQueryKey } from './payment-utils';

// ----------------------------------------------------------------------

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <Box>
      <Typography variant="overline" sx={{ color: 'text.secondary', display: 'block', mb: 1 }}>
        {title}
      </Typography>
      <Stack spacing={1}>{children}</Stack>
    </Box>
  );
}

function Row({ label, value }: { label: string; value?: React.ReactNode }) {
  const empty = value === undefined || value === null || value === '';
  return (
    <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="flex-start">
      <Typography variant="body2" sx={{ color: 'text.secondary', flexShrink: 0 }}>
        {label}
      </Typography>
      <Box sx={{ textAlign: 'right', minWidth: 0, wordBreak: 'break-word', typography: 'body2' }}>
        {empty ? '—' : value}
      </Box>
    </Stack>
  );
}

function Person({ name, phone }: { name?: string | null; phone?: string | null }) {
  return (
    <>
      <Typography variant="subtitle2" component="span" sx={{ display: 'block' }}>
        {name || '—'}
      </Typography>
      {phone && (
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {phone}
        </Typography>
      )}
    </>
  );
}

// ----------------------------------------------------------------------

type PaymentDetailDrawerProps = {
  paymentId: string | null;
  initialRow?: AdminPayment;
  onClose: () => void;
  onSendPayment: (payment: AdminPayment) => void;
};

export function PaymentDetailDrawer({
  paymentId,
  initialRow,
  onClose,
  onSendPayment,
}: PaymentDetailDrawerProps) {
  const query = useQuery({
    queryKey: paymentDetailQueryKey(paymentId || ''),
    queryFn: () => adminPaymentsService.getPayment(paymentId!),
    enabled: !!paymentId,
    placeholderData: initialRow ? (initialRow as AdminPaymentDetail) : undefined,
    staleTime: 0,
  });

  const payment = query.data;
  const refunds = payment?.refunds;
  const canSend = payment?.payout_status === 'READY_FOR_PAYOUT' && !payment.payout_frozen;

  return (
    <Drawer
      anchor="right"
      open={!!paymentId}
      onClose={onClose}
      slotProps={{ paper: { sx: { width: { xs: 1, sm: 480 } } } }}
    >
      <Stack direction="row" alignItems="center" spacing={1} sx={{ px: 2.5, py: 2 }}>
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography variant="h6" noWrap>
            Payment {payment?.booking_number ? `· ${payment.booking_number}` : ''}
          </Typography>
          {payment && (
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              Created {fDateTimeOrDash(payment.created_at)}
            </Typography>
          )}
        </Box>
        <IconButton onClick={onClose} aria-label="Close payment details">
          <Iconify icon="solar:close-circle-bold" />
        </IconButton>
      </Stack>
      <Divider />

      <Box sx={{ p: 2.5, overflowY: 'auto', flexGrow: 1 }}>
        {query.isLoading && !payment ? (
          <Stack spacing={1.5}>
            {Array.from({ length: 10 }).map((_, index) => (
              <Skeleton key={index} variant="rounded" height={28} />
            ))}
          </Stack>
        ) : query.error && !payment ? (
          <ErrorState message={getErrorMessage(query.error)} onRetry={() => query.refetch()} />
        ) : payment ? (
          <Stack spacing={3}>
            {query.error && (
              <Alert severity="warning">
                Could not refresh details: {getErrorMessage(query.error)}
              </Alert>
            )}

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              <StatusBadge value={payment.status} />
              <PayoutStatusBadge status={payment.payout_status} />
              {payment.payout_frozen && (
                <Label color="error" variant="soft">
                  Frozen
                </Label>
              )}
            </Stack>

            {payment.payout_status === 'READY_FOR_PAYOUT' && payment.payout_frozen && (
              <Alert severity="error">
                Payout is frozen by a safety incident. Resolve it in{' '}
                <Link
                  component={RouterLink}
                  href="/safety-incidents"
                  color="inherit"
                  underline="always"
                >
                  Safety incidents
                </Link>{' '}
                first.
              </Alert>
            )}

            {canSend && (
              <Button
                fullWidth
                size="large"
                variant="contained"
                startIcon={<Iconify icon="solar:hand-money-bold-duotone" />}
                onClick={() => onSendPayment(payment)}
              >
                Send payment · {formatBDT(payment.caregiver_amount)}
              </Button>
            )}

            <Section title="Booking">
              <Row
                label="Booking #"
                value={
                  payment.booking_id ? (
                    <Link
                      component={RouterLink}
                      href={`/bookings/${payment.booking_id}`}
                      underline="hover"
                    >
                      {payment.booking_number || payment.booking_id}
                    </Link>
                  ) : (
                    payment.booking_number
                  )
                }
              />
              <Row
                label="Booking status"
                value={payment.booking_status && <StatusBadge value={payment.booking_status} />}
              />
              <Row
                label="User"
                value={<Person name={payment.user_name} phone={payment.user_phone} />}
              />
              <Row
                label="Caregiver"
                value={<Person name={payment.caregiver_name} phone={payment.caregiver_phone} />}
              />
            </Section>

            <Divider sx={{ borderStyle: 'dashed' }} />

            <Section title="Amounts">
              <Row label="Paid by user" value={formatBDT(payment.amount)} />
              {Number(payment.refunded_amount) > 0 && (
                <Row
                  label="Refunded"
                  value={
                    <Typography variant="body2" sx={{ color: 'error.main' }}>
                      {formatBDT(payment.refunded_amount)}
                    </Typography>
                  }
                />
              )}
              <Row label="Platform fee" value={formatBDT(payment.platform_fee)} />
              <Row
                label="Caregiver amount"
                value={
                  <Typography variant="subtitle1">{formatBDT(payment.caregiver_amount)}</Typography>
                }
              />
            </Section>

            <Divider sx={{ borderStyle: 'dashed' }} />

            <Section title="User payment">
              <Row label="Method" value={payment.payment_method} />
              <Row label="bKash trxID" value={payment.trx_id} />
              <Row label="bKash payment ID" value={payment.bkash_payment_id} />
              <Row label="Merchant invoice" value={payment.merchant_invoice} />
              <Row label="Paid at" value={fDateTimeOrDash(payment.paid_at)} />
            </Section>

            <Divider sx={{ borderStyle: 'dashed' }} />

            <Section title="Caregiver payout">
              <Row label="Service ended at" value={fDateTimeOrDash(payment.payout_ready_at)} />
              <Row label="Paid out at" value={fDateTimeOrDash(payment.paid_out_at)} />
              <Row label="Paid out by" value={payment.paid_out_by_name} />
              <Row label="Payout trxID" value={payment.payout_trx_id} />
              <Row label="Payout note" value={payment.payout_note} />
            </Section>

            <Divider sx={{ borderStyle: 'dashed' }} />

            <Section title={`Refunds (${refunds?.length ?? 0})`}>
              {query.isPlaceholderData ? (
                <Skeleton variant="rounded" height={48} />
              ) : refunds?.length ? (
                refunds.map((refund) => (
                  <Box
                    key={refund.id}
                    sx={{ p: 1.5, borderRadius: 1, border: '1px solid', borderColor: 'divider' }}
                  >
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      spacing={1}
                    >
                      <Typography variant="subtitle2">{formatBDT(refund.refund_amount)}</Typography>
                      <StatusBadge value={refund.status} />
                    </Stack>
                    {refund.reason && (
                      <Typography variant="body2" sx={{ mt: 0.5 }}>
                        {refund.reason}
                      </Typography>
                    )}
                    <Typography
                      variant="caption"
                      sx={{ color: 'text.secondary', display: 'block', mt: 0.5 }}
                    >
                      {fDateTimeOrDash(refund.created_at)}
                      {refund.refund_trx_id ? ` · ${refund.refund_trx_id}` : ''}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  No refunds.
                </Typography>
              )}
            </Section>
          </Stack>
        ) : null}
      </Box>
    </Drawer>
  );
}
