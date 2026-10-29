import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useState, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { Scrollbar } from 'src/components/scrollbar';
import { Breadcrumb } from 'src/components/breadcrumb';
import { TableNoData } from 'src/components/table-no-data';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { EmptyState, ErrorState, TableSkeleton } from 'src/components/page-states';
import { useSnackbar } from 'src/components/snackbar';
import { adminCaregiversService } from 'src/api/admin-services';
import { getErrorMessage } from 'src/lib/utils';

import type { CaregiversQueryParams, CaregiverVerificationStatus } from 'src/api/admin-types';

import { CaregiverTableRow } from './caregiver-table-row';
import { CaregiverTableHead } from './caregiver-table-head';
import { CaregiverTableToolbar } from './caregiver-table-toolbar';
import { usePendingReviewCount } from './use-pending-review-count';
import { CAREGIVERS_QUERY_KEY, caregiverVerificationQueryKey } from './verification-utils';

import type { CaregiverTableRowProps } from './caregiver-table-row';

// ----------------------------------------------------------------------

type CaregiverTab = 'all' | 'pending';

const TABLE_HEAD = [
  { id: 'name', label: 'Caregiver' },
  { id: 'phone', label: 'Phone' },
  { id: 'district', label: 'District' },
  { id: 'experience', label: 'Experience' },
  { id: 'hourly_rate', label: 'Hourly Rate' },
  { id: 'verification_status', label: 'Verification' },
  { id: 'ekyc_session_status', label: 'Didit eKYC' },
  { id: 'documents_count', label: 'Documents' },
  { id: 'documents_submitted_at', label: 'Docs submitted' },
  { id: 'is_available', label: 'Availability' },
  { id: 'rating', label: 'Rating' },
  { id: 'completed_bookings', label: 'Bookings' },
  { id: 'created_at', label: 'Created At' },
  { id: 'actions', label: '' },
];

const COL_SPAN = TABLE_HEAD.length + 1;

function submittedAtValue(row: CaregiverTableRowProps) {
  return row.documents_submitted_at ? new Date(row.documents_submitted_at).getTime() : null;
}

export function CaregiversView() {
  const { showSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const tab: CaregiverTab = searchParams.get('tab') === 'pending' ? 'pending' : 'all';
  const isPendingTab = tab === 'pending';
  const table = useTable(isPendingTab ? 'documents_submitted_at' : 'name');

  const [filterName, setFilterName] = useState('');
  const [verificationFilter, setVerificationFilter] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('');
  const [ekycSessionFilter, setEkycSessionFilter] = useState('');
  const [confirm, setConfirm] = useState<{ type: 'block' | 'unblock'; id: string } | null>(null);

  const { count: pendingCount } = usePendingReviewCount();

  const params: CaregiversQueryParams = isPendingTab
    ? { pending_review: true, page: table.page + 1, limit: table.rowsPerPage }
    : {
        verification_status: (verificationFilter || undefined) as CaregiverVerificationStatus | undefined,
        ekyc_session_status: ekycSessionFilter || undefined,
        page: table.page + 1,
        limit: table.rowsPerPage,
      };

  const query = useQuery({
    queryKey: [...CAREGIVERS_QUERY_KEY, 'list', params],
    queryFn: () => adminCaregiversService.getCaregivers(params),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });

  const caregivers = useMemo(() => query.data?.data ?? [], [query.data]);
  const total = query.data?.meta.total ?? 0;

  const dataFiltered = useMemo(() => {
    const term = filterName.toLowerCase();
    const rows = caregivers.filter((caregiver) => {
      const matchesSearch =
        !term ||
        caregiver.name?.toLowerCase().includes(term) ||
        caregiver.email?.toLowerCase().includes(term) ||
        caregiver.phone?.includes(filterName);
      if (!matchesSearch) return false;
      if (availabilityFilter === 'available') return caregiver.is_available;
      if (availabilityFilter === 'unavailable') return !caregiver.is_available;
      return true;
    });

    if (table.orderBy !== 'documents_submitted_at') return rows;

    const direction = table.order === 'asc' ? 1 : -1;
    return [...rows].sort((a, b) => {
      const left = submittedAtValue(a);
      const right = submittedAtValue(b);
      if (left === right) return 0;
      if (left === null) return 1;
      if (right === null) return -1;
      return (left - right) * direction;
    });
  }, [caregivers, filterName, availabilityFilter, table.orderBy, table.order]);

  const notFound = !dataFiltered.length && !!filterName;

  const handleTabChange = useCallback(
    (_event: React.SyntheticEvent, value: CaregiverTab) => {
      setSearchParams(value === 'pending' ? { tab: 'pending' } : {}, { replace: true });
      table.onResetPage();
      table.onResetSort(value === 'pending' ? 'documents_submitted_at' : 'name');
    },
    [setSearchParams, table]
  );

  const handleClearFilters = useCallback(() => {
    setFilterName('');
    setVerificationFilter('');
    setAvailabilityFilter('');
    setEkycSessionFilter('');
    table.onResetPage();
  }, [table]);

  const handleEkycSessionFilterChange = useCallback(
    (value: string) => {
      setEkycSessionFilter(value);
      table.onResetPage();
    },
    [table]
  );

  const blockMutation = useMutation({
    mutationFn: ({ type, id }: { type: 'block' | 'unblock'; id: string }) =>
      type === 'block' ? adminCaregiversService.blockCaregiver(id) : adminCaregiversService.unblockCaregiver(id),
    onSuccess: (_result, variables) => {
      showSnackbar(
        variables.type === 'block' ? 'Caregiver blocked successfully' : 'Caregiver unblocked successfully',
        'success'
      );
      setConfirm(null);
      queryClient.invalidateQueries({ queryKey: CAREGIVERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: caregiverVerificationQueryKey(variables.id) });
    },
    onError: (error) => showSnackbar(getErrorMessage(error, 'Failed to update caregiver'), 'error'),
  });

  const renderBody = () => {
    if (query.isLoading) {
      return (
        <TableRow>
          <TableCell colSpan={COL_SPAN} sx={{ p: 0 }}>
            <TableSkeleton rows={table.rowsPerPage} />
          </TableCell>
        </TableRow>
      );
    }

    if (query.error) {
      return (
        <TableRow>
          <TableCell colSpan={COL_SPAN}>
            <ErrorState message={getErrorMessage(query.error)} onRetry={() => query.refetch()} />
          </TableCell>
        </TableRow>
      );
    }

    if (notFound) {
      return <TableNoData colSpan={COL_SPAN} searchQuery={filterName} onClearFilters={handleClearFilters} />;
    }

    if (!dataFiltered.length) {
      return (
        <TableRow>
          <TableCell colSpan={COL_SPAN}>
            {isPendingTab ? (
              <EmptyState
                title="No caregivers awaiting approval"
                description="Caregivers appear here once they have uploaded documents and Didit has approved their identity."
              />
            ) : (
              <EmptyState title="No caregivers found" description="Try changing or clearing the filters." />
            )}
          </TableCell>
        </TableRow>
      );
    }

    return dataFiltered.map((row) => (
      <CaregiverTableRow
        key={row.id}
        row={row}
        selected={table.selected.includes(row.id)}
        onSelectRow={() => table.onSelectRow(row.id)}
        onBlockCaregiver={(id) => setConfirm({ type: 'block', id })}
        onUnblockCaregiver={(id) => setConfirm({ type: 'unblock', id })}
      />
    ));
  };

  return (
    <DashboardContent>
      <Breadcrumb
        title="Caregivers"
        items={[
          { title: 'Dashboard', href: '/dashboard' },
          { title: 'Caregivers' },
        ]}
      />

      <Card>
        <Tabs value={tab} onChange={handleTabChange} sx={{ px: 3 }}>
          <Tab value="all" label="All caregivers" />
          <Tab
            value="pending"
            iconPosition="end"
            label="Pending approval"
            icon={
              pendingCount > 0 ? (
                <Label variant="filled" color="warning" sx={{ ml: 1 }}>
                  {pendingCount > 99 ? '99+' : pendingCount}
                </Label>
              ) : undefined
            }
          />
        </Tabs>

        <CaregiverTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          verificationFilter={verificationFilter}
          availabilityFilter={availabilityFilter}
          ekycSessionFilter={ekycSessionFilter}
          hideStatusFilters={isPendingTab}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
          onVerificationFilterChange={(value) => {
            setVerificationFilter(value);
            table.onResetPage();
          }}
          onAvailabilityFilterChange={(value) => {
            setAvailabilityFilter(value);
            table.onResetPage();
          }}
          onEkycSessionFilterChange={handleEkycSessionFilterChange}
          onClearFilters={handleClearFilters}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ '& .MuiTableCell-root': { whiteSpace: 'nowrap' } }}>
              <CaregiverTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={dataFiltered.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    dataFiltered.map((caregiver) => caregiver.id)
                  )
                }
                headLabel={TABLE_HEAD}
              />
              <TableBody>{renderBody()}</TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={total}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>

      <ConfirmDialog
        open={!!confirm}
        onClose={() => !blockMutation.isPending && setConfirm(null)}
        title={confirm?.type === 'block' ? 'Block caregiver' : 'Unblock caregiver'}
        content={
          <Typography>
            {confirm?.type === 'block'
              ? 'Block this caregiver account? They will be suspended and cannot be booked.'
              : 'Unblock this caregiver account? They return to APPROVED only if an admin approved them before; otherwise they go back to PENDING review.'}
          </Typography>
        }
        action={
          <Button
            variant="contained"
            color={confirm?.type === 'block' ? 'error' : 'success'}
            disabled={blockMutation.isPending}
            onClick={() => confirm && blockMutation.mutate(confirm)}
          >
            {confirm?.type === 'block' ? 'Block' : 'Unblock'}
          </Button>
        }
      />
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

export function useTable(defaultOrderBy = 'name') {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState(defaultOrderBy);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      setOrder(isAsc ? 'desc' : 'asc');
      setOrderBy(id);
    },
    [order, orderBy]
  );

  const onResetSort = useCallback((id: string) => {
    setOrderBy(id);
    setOrder('asc');
  }, []);

  const onSelectAllRows = useCallback((checked: boolean, newSelecteds: string[]) => {
    if (checked) {
      setSelected(newSelecteds);
      return;
    }
    setSelected([]);
  }, []);

  const onSelectRow = useCallback(
    (inputValue: string) => {
      const newSelected = selected.includes(inputValue)
        ? selected.filter((value) => value !== inputValue)
        : [...selected, inputValue];

      setSelected(newSelected);
    },
    [selected]
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  return useMemo(
    () => ({
      page,
      order,
      onSort,
      orderBy,
      selected,
      rowsPerPage,
      onSelectRow,
      onResetPage,
      onResetSort,
      onChangePage,
      onSelectAllRows,
      onChangeRowsPerPage,
    }),
    [
      page,
      order,
      onSort,
      orderBy,
      selected,
      rowsPerPage,
      onSelectRow,
      onResetPage,
      onResetSort,
      onChangePage,
      onSelectAllRows,
      onChangeRowsPerPage,
    ]
  );
}
