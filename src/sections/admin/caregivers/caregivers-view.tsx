import { useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { DashboardContent } from 'src/layouts/dashboard';

import { Scrollbar } from 'src/components/scrollbar';
import { Breadcrumb } from 'src/components/breadcrumb';
import { TableNoData } from 'src/components/table-no-data';
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

  const { caregivers, loading, error, meta, refetch, blockCaregiver, unblockCaregiver } = useCaregivers({
    verification_status: verificationFilter as any,
    page: table.page + 1,
    limit: table.rowsPerPage,
  });

  // Filter caregivers based on search name
  const dataFiltered: CaregiverTableRowProps[] = caregivers.filter((caregiver) =>
    caregiver.name.toLowerCase().includes(filterName.toLowerCase()) ||
    caregiver.email.toLowerCase().includes(filterName.toLowerCase()) ||
    caregiver.phone.includes(filterName)
  );

  const notFound = !dataFiltered.length && !!filterName;

  const handleClearFilters = useCallback(() => {
    setFilterName('');
    setVerificationFilter('');
    table.onResetPage();
  }, [table]);

  const handleBlockCaregiver = useCallback(async (id: string) => {
    try {
      await blockCaregiver(id);
      showSnackbar('Caregiver blocked successfully', 'success');
    } catch (error: any) {
      showSnackbar(error.message || 'Failed to block caregiver', 'error');
    }
  }, [blockCaregiver, showSnackbar]);

  const handleUnblockCaregiver = useCallback(async (id: string) => {
    try {
      await unblockCaregiver(id);
      showSnackbar('Caregiver unblocked successfully', 'success');
    } catch (error: any) {
      showSnackbar(error.message || 'Failed to unblock caregiver', 'error');
    }
  }, [unblockCaregiver, showSnackbar]);

  // Refetch when filters change
  useEffect(() => {
    refetch();
  }, [verificationFilter, table.page, table.rowsPerPage]);

  return (
    <DashboardContent>
      <Breadcrumb 
        title="Caregivers" 
        items={[
          { title: 'Dashboard', href: '/dashboard' },
          { title: 'Caregivers' }
        ]} 
      />

      <Card>
        <CaregiverTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          verificationFilter={verificationFilter}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
          onVerificationFilterChange={setVerificationFilter}
          onClearFilters={handleClearFilters}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
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
                    <TableCell colSpan={11} align="center">
                      <Box sx={{ py: 3 }}>Loading...</Box>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={11} align="center">
                      <Box sx={{ py: 3, color: 'error.main' }}>{error}</Box>
                    </TableCell>
                  </TableRow>
                ) : dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <CaregiverTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onBlockCaregiver={handleBlockCaregiver}
                      onUnblockCaregiver={handleUnblockCaregiver}
                    />
                  ))}

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
