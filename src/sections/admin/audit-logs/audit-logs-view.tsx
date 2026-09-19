import { AdminListPage } from '../admin-list-page';
import { auditLogsApi } from 'src/lib/api';
import { pickString } from 'src/lib/utils';
import { fDateTime } from 'src/utils/format-time';

export function AuditLogsView() {
  return (
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
        { id: 'actor_name', label: 'Actor', render: (row) => pickString(row, ['actor_name', 'admin_name', 'user_name']) },
        { id: 'action', label: 'Action', render: (row) => pickString(row, ['action']) },
        { id: 'entity_type', label: 'Entity type', render: (row) => pickString(row, ['entity_type']) },
        { id: 'entity_id', label: 'Entity ID', render: (row) => pickString(row, ['entity_id']) },
        {
          id: 'meta',
          label: 'Meta',
          render: (row) => {
            const meta = row.meta;
            if (meta == null || meta === '') return '—';
            return typeof meta === 'string' ? meta : JSON.stringify(meta);
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
  );
}
