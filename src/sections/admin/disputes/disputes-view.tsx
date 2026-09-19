import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { AdminListPage } from '../admin-list-page';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { StatusBadge } from 'src/components/status-badge';
import { useSnackbar } from 'src/components/snackbar';
import { disputesApi } from 'src/lib/api';
import { getErrorMessage, pickString } from 'src/lib/utils';
import { fDateTime } from 'src/utils/format-time';

const DISPUTE_STATUSES = ['OPEN', 'IN_REVIEW', 'RESOLVED', 'REJECTED'] as const;

export function DisputesView() {
  const { showSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [row, setRow] = useState<Record<string, unknown> | null>(null);
  const [status, setStatus] = useState<(typeof DISPUTE_STATUSES)[number]>('IN_REVIEW');
  const [resolution, setResolution] = useState('');

  const mutation = useMutation({
    mutationFn: async () => {
      if (!row) return;
      await disputesApi.update(pickString(row, ['id']), { status, resolution });
    },
    onSuccess: () => {
      showSnackbar('Dispute updated', 'success');
      setRow(null);
      setResolution('');
      queryClient.invalidateQueries({ queryKey: ['admin-disputes'] });
    },
    onError: (error) => showSnackbar(getErrorMessage(error), 'error'),
  });

  return (
    <>
      <AdminListPage
        title="Disputes"
        description="Review and resolve booking disputes"
        queryKey="admin-disputes"
        fetcher={disputesApi.list}
        emptyTitle="No disputes found"
        hideSearch
        filters={[
          {
            id: 'status',
            label: 'Status',
            options: DISPUTE_STATUSES.map((value) => ({ value, label: value.replace(/_/g, ' ') })),
          },
        ]}
        columns={[
          { id: 'id', label: 'Dispute', render: (item) => pickString(item, ['dispute_number', 'id']) },
          { id: 'booking', label: 'Booking', render: (item) => pickString(item, ['booking_number', 'booking_id']) },
          { id: 'raised_by', label: 'Raised by', render: (item) => pickString(item, ['raised_by_name', 'customer_name', 'user_name']) },
          { id: 'status', label: 'Status', render: (item) => <StatusBadge value={pickString(item, ['status'], '')} /> },
          { id: 'resolution', label: 'Resolution', render: (item) => pickString(item, ['resolution']) },
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
              setStatus((DISPUTE_STATUSES.find((value) => value === current) || 'IN_REVIEW') as (typeof DISPUTE_STATUSES)[number]);
              setResolution(pickString(item, ['resolution'], '') === '—' ? '' : pickString(item, ['resolution'], ''));
            },
          },
        ]}
      />

      <ConfirmDialog
        open={!!row}
        onClose={() => !mutation.isPending && setRow(null)}
        title="Update dispute"
        content={
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Typography>
              {pickString(row || {}, ['dispute_number', 'id'])}
            </Typography>
            <TextField select label="Status" value={status} onChange={(event) => setStatus(event.target.value as (typeof DISPUTE_STATUSES)[number])}>
              {DISPUTE_STATUSES.map((value) => (
                <MenuItem key={value} value={value}>
                  {value.replace(/_/g, ' ')}
                </MenuItem>
              ))}
            </TextField>
            <TextField
              label="Resolution"
              multiline
              minRows={3}
              value={resolution}
              onChange={(event) => setResolution(event.target.value)}
            />
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
