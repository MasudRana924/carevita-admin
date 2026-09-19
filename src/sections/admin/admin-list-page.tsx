import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';
import { DataTable, type DataTableAction, type DataTableColumn, type DataTableFilter } from 'src/components/data-table';
import { PageHeader } from 'src/components/page-header';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSnackbar } from 'src/components/snackbar';
import { useResourceList } from 'src/hooks/use-resource-list';
import { getErrorMessage, getRecordId } from 'src/lib/utils';

type ConfirmConfig<T> = {
  title: string;
  content: string;
  confirmLabel?: string;
  color?: 'error' | 'primary' | 'warning' | 'success';
  prompt?: { label: string; required?: boolean };
  run: (row: T, extra?: { note?: string }) => Promise<unknown>;
  successMessage: string;
};

type Props<T extends Record<string, unknown>> = {
  title: string;
  description?: string;
  queryKey: string;
  fetcher: (params: Record<string, string | number | boolean | undefined>) => Promise<{ items: T[] }>;
  columns: DataTableColumn<T>[];
  filters?: DataTableFilter[];
  actions?: Array<DataTableAction<T> | ((helpers: { confirm: (row: T, config: ConfirmConfig<T>) => void }) => DataTableAction<T>)>;
  emptyTitle: string;
  searchPlaceholder?: string;
  extraToolbar?: React.ReactNode;
  clientSearchKeys?: string[];
  hideSearch?: boolean;
};

export function AdminListPage<T extends Record<string, unknown>>({
  title,
  description,
  queryKey,
  fetcher,
  columns,
  filters,
  actions = [],
  emptyTitle,
  searchPlaceholder,
  extraToolbar,
  clientSearchKeys,
  hideSearch,
}: Props<T>) {
  const list = useResourceList<T>(queryKey, fetcher);
  const { showSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [confirm, setConfirm] = useState<{ row: T; config: ConfirmConfig<T> } | null>(null);
  const [note, setNote] = useState('');

  const mutation = useMutation({
    mutationFn: async () => {
      if (!confirm) return;
      if (confirm.config.prompt?.required && !note.trim()) {
        throw new Error(`${confirm.config.prompt.label} is required`);
      }
      await confirm.config.run(confirm.row, { note: note.trim() || undefined });
    },
    onSuccess: () => {
      if (confirm) showSnackbar(confirm.config.successMessage, 'success');
      setConfirm(null);
      setNote('');
      queryClient.invalidateQueries({ queryKey: [queryKey] });
    },
    onError: (error) => {
      showSnackbar(getErrorMessage(error), 'error');
    },
  });

  const resolvedActions = actions.map((action) =>
    typeof action === 'function'
      ? action({
          confirm: (row, config) => {
            setNote('');
            setConfirm({ row, config });
          },
        })
      : action
  );

  return (
    <DashboardContent maxWidth="xl">
      <PageHeader title={title} description={description} action={extraToolbar} />
      <DataTable
        columns={columns}
        rows={list.items}
        loading={list.isLoading}
        error={list.errorMessage}
        onRetry={() => list.refetch()}
        searchValue={hideSearch ? undefined : list.search}
        onSearchChange={hideSearch ? undefined : list.setSearch}
        searchPlaceholder={searchPlaceholder}
        filters={filters}
        filterValues={list.filters}
        onFilterChange={list.setFilter}
        page={list.page}
        rowsPerPage={list.rowsPerPage}
        onPageChange={list.setPage}
        onRowsPerPageChange={list.setRowsPerPage}
        serverMode
        totalCount={list.totalCount}
        hasNextPage={list.hasNextPage}
        getRowId={(row) => getRecordId(row)}
        actions={resolvedActions}
        emptyTitle={emptyTitle}
        clientSearchKeys={clientSearchKeys}
      />

      <ConfirmDialog
        open={!!confirm}
        onClose={() => !mutation.isPending && setConfirm(null)}
        title={confirm?.config.title}
        content={
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Typography>{confirm?.config.content}</Typography>
            {confirm?.config.prompt && (
              <TextField
                fullWidth
                multiline
                minRows={2}
                label={confirm.config.prompt.label}
                value={note}
                onChange={(event) => setNote(event.target.value)}
              />
            )}
          </Stack>
        }
        action={
          <Button
            variant="contained"
            color={confirm?.config.color || 'error'}
            disabled={mutation.isPending}
            startIcon={mutation.isPending ? <CircularProgress size={16} /> : null}
            onClick={() => mutation.mutate()}
          >
            {confirm?.config.confirmLabel || 'Confirm'}
          </Button>
        }
      />
    </DashboardContent>
  );
}
