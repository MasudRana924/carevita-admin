import { useState } from 'react';
import { AdminListPage } from '../admin-list-page';
import { auditLogsApi } from 'src/lib/api';
import { pickString } from 'src/lib/utils';
import { fDateTime } from 'src/utils/format-time';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

export function AuditLogsView() {
  const [selectedMeta, setSelectedMeta] = useState<string | null>(null);

  const truncateMeta = (meta: unknown) => {
    if (meta == null || meta === '') return '—';
    const metaStr = typeof meta === 'string' ? meta : JSON.stringify(meta);
    if (metaStr.length <= 50) return metaStr;
    return metaStr.substring(0, 50) + '...';
  };

  return (
    <>
      <AdminListPage
        title="Audit log"
        description="Admin actions across users, bookings, payments, and wallets"
        queryKey="admin-audit-logs"
        fetcher={auditLogsApi.list}
        emptyTitle="No audit log entries"
        hideSearch
        filters={[
          { id: 'entity_type', label: 'Entity type', type: 'text' },
          { id: 'entity_id', label: 'Entity ID', type: 'text' },
        ]}
        columns={[
          { id: 'actor_name', label: 'Actor', width: 200, render: (row) => pickString(row, ['actor_name', 'admin_name', 'user_name']) },
          { id: 'action', label: 'Action', render: (row) => pickString(row, ['action']) },
          { id: 'entity_type', label: 'Entity type', render: (row) => pickString(row, ['entity_type']) },
          { id: 'entity_id', label: 'Entity ID', render: (row) => pickString(row, ['entity_id']) },
          {
            id: 'meta',
            label: 'Meta',
            render: (row) => {
              const meta = row.meta;
              const metaStr = typeof meta === 'string' ? meta : JSON.stringify(meta);
              if (meta == null || meta === '') return '—';
              return (
                <Box
                  component="span"
                  sx={{ cursor: 'pointer', color: 'primary.main', '&:hover': { textDecoration: 'underline' } }}
                  onClick={() => setSelectedMeta(metaStr)}
                >
                  {truncateMeta(meta)}
                </Box>
              );
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
      />

      <Dialog open={!!selectedMeta} onClose={() => setSelectedMeta(null)} maxWidth="md" fullWidth>
        <DialogTitle>Meta Details</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
            {selectedMeta}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedMeta(null)}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
