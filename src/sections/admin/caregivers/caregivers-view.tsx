import { useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

import { Scrollbar } from 'src/components/scrollbar';
import { Breadcrumb } from 'src/components/breadcrumb';
import { TableNoData } from 'src/components/table-no-data';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSnackbar } from 'src/components/snackbar';
import { useCaregivers } from 'src/hooks/useAdminApi';

import { CaregiverTableRow } from './caregiver-table-row';
import { CaregiverTableHead } from './caregiver-table-head';
import { CaregiverTableToolbar } from './caregiver-table-toolbar';

import type { CaregiverTableRowProps } from './caregiver-table-row';

// ----------------------------------------------------------------------

export function CaregiversView() {
  const { showSnackbar } = useSnackbar();
  const table = useTable();

  const [filterName, setFilterName] = useState('');
  const [verificationFilter, setVerificationFilter] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('');
  const [ekycSessionFilter, setEkycSessionFilter] = useState('');
  const [confirm, setConfirm] = useState<{ type: 'block' | 'unblock'; id: string } | null>(null);

  const { caregivers, loading, error, meta, refetch, blockCaregiver, unblockCaregiver } = useCaregivers({
    verification_status: (verificationFilter || undefined) as any,
    ekyc_session_status: ekycSessionFilter || undefined,
    page: table.page + 1,
    limit: table.rowsPerPage,
  });

  const dataFiltered: CaregiverTableRowProps[] = caregivers.filter(
    (caregiver) =>
      caregiver.name.toLowerCase().includes(filterName.toLowerCase()) ||
      caregiver.email.toLowerCase().includes(filterName.toLowerCase()) ||
      caregiver.phone.includes(filterName)
  );

  const notFound = !dataFiltered.length && !!filterName;

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

  const handleBlockCaregiver = useCallback((id: string) => {
    setConfirm({ type: 'block', id });
  }, []);

  const handleUnblockCaregiver = useCallback((id: string) => {
    setConfirm({ type: 'unblock', id });
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!confirm) return;
    try {
      if (confirm.type === 'block') {
        await blockCaregiver(confirm.id);
        showSnackbar('Caregiver blocked successfully', 'success');
      } else {
        await unblockCaregiver(confirm.id);
        showSnackbar('Caregiver unblocked successfully', 'success');
      }
      setConfirm(null);
    } catch (err: any) {
      showSnackbar(err.message || 'Failed to update caregiver', 'error');
    }
  }, [confirm, blockCaregiver, unblockCaregiver, showSnackbar]);

  useEffect(() => {
    refetch();
  }, [verificationFilter, availabilityFilter, ekycSessionFilter, table.page, table.rowsPerPage]);

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
        <CaregiverTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          verificationFilter={verificationFilter}
          availabilityFilter={availabilityFilter}
          ekycSessionFilter={ekycSessionFilter}
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
            <Table sx={{ minWidth: 960 }}>
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
                headLabel={[
                  { id: 'name', label: 'Caregiver' },
                  { id: 'phone', label: 'Phone' },
                  { id: 'district', label: 'District' },
                  { id: 'experience', label: 'Experience' },
                  { id: 'hourly_rate', label: 'Hourly Rate' },
                  { id: 'verification_status', label: 'Verification' },
                  { id: 'ekyc_session_status', label: 'eKYC' },
                  { id: 'is_available', label: 'Availability' },
                  { id: 'rating', label: 'Rating' },
                  { id: 'completed_bookings', label: 'Bookings' },
                  { id: 'created_at', label: 'Created At' },
                  { id: 'actions', label: '' },
                ]}
              />
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={13} align="center">
                      <Box sx={{ py: 3 }}>Loading...</Box>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={13} align="center">
                      <Box sx={{ py: 3, color: 'error.main' }}>{error}</Box>
                    </TableCell>
                  </TableRow>
                ) : (
                  dataFiltered
                    .filter((row) => {
                      if (availabilityFilter === 'available') return row.is_available;
                      if (availabilityFilter === 'unavailable') return !row.is_available;
                      return true;
                    })
                    .map((row) => (
                      <CaregiverTableRow
                        key={row.id}
                        row={row}
                        selected={table.selected.includes(row.id)}
                        onSelectRow={() => table.onSelectRow(row.id)}
                        onBlockCaregiver={handleBlockCaregiver}
                        onUnblockCaregiver={handleUnblockCaregiver}
                      />
                    ))
                )}

                {notFound && <TableNoData searchQuery={filterName} onClearFilters={handleClearFilters} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={meta.total}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
        />
      </Card>

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        title={confirm?.type === 'block' ? 'Block caregiver' : 'Unblock caregiver'}
        content={
          <Typography>
            {confirm?.type === 'block'
              ? 'Block this caregiver account?'
              : 'Unblock this caregiver account?'}
          </Typography>
        }
        action={
          <Button
            variant="contained"
            color={confirm?.type === 'block' ? 'error' : 'success'}
            onClick={handleConfirm}
          >
            {confirm?.type === 'block' ? 'Block' : 'Unblock'}
          </Button>
        }
      />
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('name');
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

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    onSelectRow,
    onResetPage,
    onChangePage,
    onSelectAllRows,
    onChangeRowsPerPage,
  };
}
