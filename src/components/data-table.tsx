import { useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import IconButton from '@mui/material/IconButton';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import Tooltip from '@mui/material/Tooltip';

import { TableHeadCustom } from 'src/components/table';
import { EmptyState, ErrorState, TableSkeleton } from 'src/components/page-states';
import { LucideIcon } from 'src/components/lucide-icons';

export type DataTableColumn<T> = {
  id: string;
  label: string;
  minWidth?: number;
  align?: 'left' | 'right' | 'center';
  sortable?: boolean;
  render?: (row: T) => React.ReactNode;
  getValue?: (row: T) => unknown;
};

export type DataTableFilter = {
  id: string;
  label: string;
  type?: 'select' | 'date' | 'text';
  options?: { value: string; label: string }[];
};

export type DataTableAction<T> = {
  label: string;
  icon?: string;
  color?: 'inherit' | 'primary' | 'error' | 'success' | 'warning' | 'info';
  onClick: (row: T) => void;
  hidden?: (row: T) => boolean;
};

type Props<T> = {
  columns: DataTableColumn<T>[];
  rows: T[];
  loading?: boolean;
  error?: string | null;
  onRetry?: () => void;
  searchPlaceholder?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  filters?: DataTableFilter[];
  filterValues?: Record<string, string>;
  onFilterChange?: (id: string, value: string) => void;
  extraToolbar?: React.ReactNode;
  page: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
  serverMode?: boolean;
  totalCount?: number;
  hasNextPage?: boolean;
  getRowId: (row: T) => string;
  actions?: DataTableAction<T>[];
  emptyTitle: string;
  emptyDescription?: string;
  clientSearchKeys?: Array<keyof T | string>;
};

function getNested(row: Record<string, unknown>, path: string) {
  return path.split('.').reduce<unknown>((acc, key) => {
    if (acc && typeof acc === 'object') return (acc as Record<string, unknown>)[key];
    return undefined;
  }, row);
}

export function DataTable<T extends Record<string, unknown>>({
  columns,
  rows,
  loading,
  error,
  onRetry,
  searchPlaceholder = 'Search...',
  searchValue = '',
  onSearchChange,
  filters = [],
  filterValues = {},
  onFilterChange,
  extraToolbar,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  serverMode,
  totalCount,
  hasNextPage,
  getRowId,
  actions = [],
  emptyTitle,
  emptyDescription,
  clientSearchKeys,
}: Props<T>) {
  const [orderBy, setOrderBy] = useState(columns[0]?.id || '');
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

  const searched = useMemo(() => {
    if (serverMode || !searchValue) return rows;
    const q = searchValue.toLowerCase();
    return rows.filter((row) => {
      const keys = clientSearchKeys?.length ? clientSearchKeys : columns.map((col) => col.id);
      return keys.some((key) => String(getNested(row, String(key)) ?? '').toLowerCase().includes(q));
    });
  }, [rows, searchValue, serverMode, clientSearchKeys, columns]);

  const sorted = useMemo(() => {
    const copy = [...searched];
    copy.sort((a, b) => {
      const column = columns.find((item) => item.id === orderBy);
      const av = column?.getValue ? column.getValue(a) : getNested(a, orderBy);
      const bv = column?.getValue ? column.getValue(b) : getNested(b, orderBy);
      const as = av == null ? '' : String(av);
      const bs = bv == null ? '' : String(bv);
      if (as < bs) return order === 'asc' ? -1 : 1;
      if (as > bs) return order === 'asc' ? 1 : -1;
      return 0;
    });
    return copy;
  }, [searched, columns, orderBy, order]);

  const paged = serverMode
    ? sorted
    : sorted.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const count = serverMode
    ? hasNextPage
      ? page * rowsPerPage + paged.length + 1
      : page * rowsPerPage + paged.length
    : sorted.length;

  const headLabel = [
    ...columns.map((column) => ({
      id: column.id,
      label: column.label,
      align: column.align,
      minWidth: column.minWidth,
    })),
    ...(actions.length ? [{ id: 'actions', label: 'Actions', align: 'right' }] : []),
  ];

  return (
    <Card
      sx={{
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: 'none',
      }}
    > <Stack
        spacing={2}
        direction={{ xs: 'column', md: 'row' }}
        sx={{ p: 2.5 }}
        alignItems={{ md: 'center' }}
      >
        {onSearchChange && (
          <TextField
            value={searchValue}
            onChange={(event) => onSearchChange(event.target.value)}
            placeholder={searchPlaceholder}
            size="small"
            sx={{ minWidth: { md: 280 } }}
          />
        )}
        {filters.map((filter) =>
          filter.type === 'date' ? (
            <TextField
              key={filter.id}
              type="date"
              size="small"
              label={filter.label}
              value={filterValues[filter.id] || ''}
              onChange={(event) => onFilterChange?.(filter.id, event.target.value)}
              sx={{ minWidth: 180 }}
              InputLabelProps={{ shrink: true }}
            />
          ) : filter.type === 'text' ? (
            <TextField
              key={filter.id}
              size="small"
              label={filter.label}
              value={filterValues[filter.id] || ''}
              onChange={(event) => onFilterChange?.(filter.id, event.target.value)}
              sx={{ minWidth: 180 }}
            />
          ) : (
            <TextField
              key={filter.id}
              select
              size="small"
              label={filter.label}
              value={filterValues[filter.id] || ''}
              onChange={(event) => onFilterChange?.(filter.id, event.target.value)}
              sx={{ minWidth: 160 }}
            >
              <MenuItem value="">All</MenuItem>
              {(filter.options || []).map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </TextField>
          )
        )}
        <Box sx={{ flexGrow: 1 }} />
        {extraToolbar}
      </Stack>

      {error ? (
        <Box sx={{ p: 2.5 }}>
          <ErrorState message={error} onRetry={onRetry} />
        </Box>
      ) : loading ? (
        <TableSkeleton />
      ) : !paged.length ? (
        <EmptyState title={emptyTitle} description={emptyDescription} />
      ) : (
        <>
          <TableContainer sx={{ overflowX: 'auto' }}>
            <Table sx={{ minWidth: 800 }}>
              <TableHeadCustom
                order={order}
                orderBy={orderBy}
                headLabel={headLabel}
                onSort={(id) => {
                  if (id === 'actions') return;
                  const isAsc = orderBy === id && order === 'asc';
                  setOrder(isAsc ? 'desc' : 'asc');
                  setOrderBy(id);
                }}
              />
              <TableBody>
                {paged.map((row) => {
                  const id = getRowId(row);
                  return (
                    <TableRow hover key={id}>
                      {columns.map((column) => (
                        <TableCell key={column.id} align={column.align || 'left'}>
                          {column.render
                            ? column.render(row)
                            : String(getNested(row, column.id) ?? '—')}
                        </TableCell>
                      ))}
                      {!!actions.length && (
                        <TableCell align="right">
                          <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                            {actions
                              .filter((action) => !action.hidden?.(row))
                              .map((action) => (
                                <Tooltip key={action.label} title={action.label}>
                                  <IconButton
                                    size="small"
                                    color={action.color || 'inherit'}
                                    aria-label={action.label}
                                    onClick={() => action.onClick(row)}
                                  >
                                    <LucideIcon icon={action.icon || 'eva:more-vertical-fill'} width={18} />
                                  </IconButton>
                                </Tooltip>
                              ))}
                          </Stack>
                        </TableCell>
                      )}
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            page={page}
            count={totalCount ?? count}
            rowsPerPage={rowsPerPage}
            onPageChange={(_, next) => onPageChange(next)}
            onRowsPerPageChange={(event) => onRowsPerPageChange(parseInt(event.target.value, 10))}
            rowsPerPageOptions={[5, 10, 20, 50]}
          />
        </>
      )}
    </Card>
  );
}
