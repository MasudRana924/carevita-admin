import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import Checkbox from '@mui/material/Checkbox';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';

import { Iconify } from 'src/components/iconify';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSnackbar } from 'src/components/snackbar';
import { adminPaymentsService } from 'src/api/admin-services';
import { getErrorMessage } from 'src/lib/utils';

import type { AdminPayment, AdminPaymentDetail, PaymentsResponse } from 'src/api/admin-types';

import {
  PAYMENTS_LIST_QUERY_KEY,
  PAYMENTS_QUERY_KEY,
  PAYOUT_NOTE_MAX_LENGTH,
  TRX_ID_MAX_LENGTH,
  fDateTimeOrDash,
  formatBDT,
  getHttpStatus,
  paymentDetailQueryKey,
} from './payment-utils';

// ----------------------------------------------------------------------

function useCopyToClipboard() {
  const { showSnackbar } = useSnackbar();
  return (text: string, label: string) => {
    navigator.clipboard
      ?.writeText(text)
      .then(() => showSnackbar(`${label} copied`, 'success'))
      .catch(() => showSnackbar(`Could not copy ${label.toLowerCase()}`, 'error'));
  };
}

function CopyButton({ text, label }: { text: string; label: string }) {
  const copy = useCopyToClipboard();
  return (
    <Tooltip title={`Copy ${label.toLowerCase()}`}>
      <IconButton
        size="small"
        onClick={() => copy(text, label)}
        aria-label={`Copy ${label.toLowerCase()}`}
      >
        <Iconify icon="solar:copy-linear" width={18} />
      </IconButton>
    </Tooltip>
  );
}

function BreakdownRow({
  label,
  value,
  strong,
}: {
  label: string;
  value: React.ReactNode;
  strong?: boolean;
}) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
      <Typography
        variant={strong ? 'subtitle1' : 'body2'}
        sx={{ color: strong ? 'text.primary' : 'text.secondary' }}
      >
        {label}
      </Typography>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>{value}</Box>
    </Stack>
  );
}

// ----------------------------------------------------------------------

type SendPaymentDialogProps = {
  payment: AdminPayment | null;
  onClose: () => void;
  onPaid?: (updated: AdminPayment) => void;
};

export function SendPaymentDialog({ payment, onClose, onPaid }: SendPaymentDialogProps) {
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  const [trxId, setTrxId] = useState('');
  const [note, setNote] = useState('');
  const [confirmed, setConfirmed] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setTrxId('');
    setNote('');
    setConfirmed(false);
    setError(null);
  }, [payment?.id]);

  const caregiverName = payment?.caregiver_name || 'the caregiver';
  const amountToSend = formatBDT(payment?.caregiver_amount);

  const refreshPayments = () => {
    queryClient.invalidateQueries({ queryKey: PAYMENTS_QUERY_KEY });
    queryClient.invalidateQueries({ queryKey: ['admin-dashboard'] });
  };

  const mutation = useMutation({
    mutationFn: (target: AdminPayment) =>
      adminPaymentsService.transfer(target.id, {
        trx_id: trxId.trim(),
        note: note.trim() || undefined,
      }),
    onSuccess: ({ data }, target) => {
      const updated = { ...target, ...data };
      showSnackbar(
        `Payment recorded. ${target.caregiver_name || 'The caregiver'} has been notified.`,
        'success'
      );
      queryClient.setQueriesData<PaymentsResponse>({ queryKey: PAYMENTS_LIST_QUERY_KEY }, (old) =>
        old
          ? {
              ...old,
              data: old.data.map((row) => (row.id === updated.id ? { ...row, ...updated } : row)),
            }
          : old
      );
      queryClient.setQueryData<AdminPaymentDetail>(paymentDetailQueryKey(updated.id), (old) =>
        old ? { ...old, ...updated } : old
      );
      refreshPayments();
      onClose();
      onPaid?.(updated);
    },
    onError: (err) => {
      const status = getHttpStatus(err);
      refreshPayments();
      if (status === 404) {
        showSnackbar('Payment not found', 'error');
        onClose();
        return;
      }
      setError(getErrorMessage(err));
    },
  });

  const busy = mutation.isPending;
  const canSubmit = !!payment && confirmed && trxId.trim().length > 0 && !busy;

  const handleSubmit = () => {
    if (!payment || !canSubmit) return;
    setError(null);
    mutation.mutate(payment);
  };

  return (
    <ConfirmDialog
      open={!!payment}
      onClose={() => !busy && onClose()}
      title="Send payment to caregiver"
      content={
        payment && (
          <Stack spacing={2.5} sx={{ pt: 1 }}>
            <Box sx={{ p: 2, borderRadius: 1.5, bgcolor: 'background.neutral' }}>
              <Typography variant="h5">{payment.caregiver_name || '—'}</Typography>
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <Typography variant="h6" sx={{ fontFamily: 'monospace', letterSpacing: 0.5 }}>
                  {payment.caregiver_phone || '—'}
                </Typography>
                {payment.caregiver_phone && (
                  <CopyButton text={payment.caregiver_phone} label="Phone number" />
                )}
              </Stack>
              <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
                Send the amount to this caregiver&apos;s bKash / bank first, then confirm here.
              </Typography>
            </Box>

            <Stack spacing={0.75}>
              <BreakdownRow
                label="Booking"
                value={<Typography variant="body2">{payment.booking_number || '—'}</Typography>}
              />
              <BreakdownRow
                label="Service ended at"
                value={
                  <Typography variant="body2">
                    {fDateTimeOrDash(payment.payout_ready_at)}
                  </Typography>
                }
              />
            </Stack>

            <Divider sx={{ borderStyle: 'dashed' }} />

            <Stack spacing={1}>
              <BreakdownRow
                label="Total paid by user"
                value={<Typography variant="body2">{formatBDT(payment.amount)}</Typography>}
              />
              <BreakdownRow
                label="Platform charge"
                value={<Typography variant="body2">− {formatBDT(payment.platform_fee)}</Typography>}
              />
              <BreakdownRow
                strong
                label="Amount to send"
                value={
                  <>
                    <Typography variant="h4" sx={{ color: 'success.dark' }}>
                      {amountToSend}
                    </Typography>
                    {payment.caregiver_amount != null && (
                      <CopyButton text={String(payment.caregiver_amount)} label="Amount" />
                    )}
                  </>
                }
              />
            </Stack>

            <TextField
              required
              fullWidth
              autoFocus
              label="Transaction ID"
              placeholder="e.g. BKA9PAYOUT01"
              value={trxId}
              onChange={(event) => setTrxId(event.target.value)}
              disabled={busy}
              slotProps={{ htmlInput: { maxLength: TRX_ID_MAX_LENGTH } }}
              helperText="bKash / bank transaction ID of the transfer you already made. Each ID can be used once."
            />
            <TextField
              fullWidth
              multiline
              minRows={2}
              label="Note (optional)"
              placeholder="Sent to 018XXXXXXXX via bKash"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              disabled={busy}
              slotProps={{ htmlInput: { maxLength: PAYOUT_NOTE_MAX_LENGTH } }}
              helperText={`${note.length}/${PAYOUT_NOTE_MAX_LENGTH}`}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={confirmed}
                  onChange={(event) => setConfirmed(event.target.checked)}
                  disabled={busy}
                />
              }
              label={`I have already sent ${amountToSend} to ${caregiverName}`}
            />

            {error && <Alert severity="error">{error}</Alert>}
          </Stack>
        )
      }
      action={
        <Button
          variant="contained"
          color="success"
          disabled={!canSubmit}
          startIcon={busy ? <CircularProgress size={16} color="inherit" /> : null}
          onClick={handleSubmit}
        >
          {busy ? 'Recording…' : 'Confirm payment'}
        </Button>
      }
    />
  );
}
