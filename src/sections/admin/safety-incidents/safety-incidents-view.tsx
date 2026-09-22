import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { AdminListPage } from '../admin-list-page';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { StatusBadge } from 'src/components/status-badge';
import { useSnackbar } from 'src/components/snackbar';
import { safetyIncidentsApi } from 'src/lib/api';
import { getErrorMessage, pickString } from 'src/lib/utils';
import { fDateTime } from 'src/utils/format-time';

const INCIDENT_STATUSES = ['OPEN', 'IN_REVIEW', 'RESOLVED', 'DISMISSED'] as const;

export function SafetyIncidentsView() {
  const { showSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [row, setRow] = useState<Record<string, unknown> | null>(null);
  const [status, setStatus] = useState<(typeof INCIDENT_STATUSES)[number]>('IN_REVIEW');
  const [note, setNote] = useState('');
  const [unfreezePayout, setUnfreezePayout] = useState(false);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!row) return;
      const body: Record<string, unknown> = { status };
      if (note.trim()) body.note = note.trim();
      if (unfreezePayout && (status === 'RESOLVED' || status === 'DISMISSED')) {
        body.unfreeze_payout = true;
      }
      await safetyIncidentsApi.update(pickString(row, ['id']), body);
    },
    onSuccess: () => {
      showSnackbar('Safety incident updated', 'success');
      setRow(null);
      setNote('');
      setUnfreezePayout(false);
      queryClient.invalidateQueries({ queryKey: ['admin-safety-incidents'] });
    },
    onError: (error) => showSnackbar(getErrorMessage(error), 'error'),
  });

  return (
    <>
      <AdminListPage
        title="Safety incidents"
        description="Investigate safety reports and manage payout freezes"
        queryKey="admin-safety-incidents"
        fetcher={safetyIncidentsApi.list}
        emptyTitle="No safety incidents found"
        hideSearch
        filters={[
          {
            id: 'status',
            label: 'Status',
            options: INCIDENT_STATUSES.map((value) => ({
              value,
              label: value.replace(/_/g, ' '),
            })),
          },
        ]}
        columns={[
          {
            id: 'id',
            label: 'Incident',
            render: (item) => pickString(item, ['id']),
          },
          {
            id: 'booking',
            label: 'Booking',
            render: (item) => pickString(item, ['booking_number', 'booking_id']),
          },
          {
            id: 'reporter',
            label: 'Reporter',
            render: (item) => pickString(item, ['reporter_name', 'reported_by']),
          },
          {
            id: 'status',
            label: 'Status',
            render: (item) => <StatusBadge value={pickString(item, ['status'], '')} />,
          },
          {
            id: 'payout_frozen',
            label: 'Payout',
            render: (item) => (
              <StatusBadge
                value={Boolean(item.payout_frozen)}
                label={item.payout_frozen ? 'Frozen' : 'OK'}
              />
            ),
          },
          {
            id: 'note',
            label: 'Note',
            render: (item) => pickString(item, ['note', 'admin_note']),
          },
          {
            id: 'created_at',
            label: 'Created',
            render: (item) => {
              const value = pickString(item, ['created_at'], '');
              return value && value !== '—' ? fDateTime(value) : '—';
            },
          },
        ]}
        actions={[
          {
            label: 'Update',
            icon: 'solar:pen-bold',
            onClick: (item) => {
              setRow(item);
              const current = pickString(item, ['status'], 'OPEN');
              setStatus(
                (INCIDENT_STATUSES.find((value) => value === current) ||
                  'IN_REVIEW') as (typeof INCIDENT_STATUSES)[number]
              );
              const existingNote = pickString(item, ['admin_note', 'note'], '');
              setNote(existingNote === '—' ? '' : existingNote);
              setUnfreezePayout(false);
            },
          },
        ]}
      />

      <ConfirmDialog
        open={!!row}
        onClose={() => !mutation.isPending && setRow(null)}
        title="Update safety incident"
        content={
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Typography>{pickString(row || {}, ['booking_number', 'id'])}</Typography>
            <TextField
              select
              label="Status"
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as (typeof INCIDENT_STATUSES)[number])
              }
            >
              {INCIDENT_STATUSES.map((value) => (
                <MenuItem key={value} value={value}>
                  {value.replace(/_/g, ' ')}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Admin note"
              multiline
              minRows={3}
              value={note}
              onChange={(event) => setNote(event.target.value)}
            />
            {(status === 'RESOLVED' || status === 'DISMISSED') && (
              <FormControlLabel
                control={
                  <Switch
                    checked={unfreezePayout}
                    onChange={(event) => setUnfreezePayout(event.target.checked)}
                  />
                }
                label="Unfreeze payout on this booking"
              />
            )}
          </Stack>
        }
        action={
          <Button
            variant="contained"
            disabled={mutation.isPending}
            startIcon={mutation.isPending ? <CircularProgress size={16} /> : null}
            onClick={() => mutation.mutate()}
          >
            Save
          </Button>
        }
      />
    </>
  );
}
