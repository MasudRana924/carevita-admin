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
import { useHospitals } from 'src/hooks/useAdminApi';

import { HospitalTableRow } from './hospital-table-row';
import { HospitalTableHead } from './hospital-table-head';
import { HospitalTableToolbar } from './hospital-table-toolbar';

import type { HospitalTableRowProps } from './hospital-table-row';

// ----------------------------------------------------------------------

export function HospitalsView() {
  const { showSnackbar } = useSnackbar();
  const table = useTable();

  const [filterName, setFilterName] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');

  const { hospitals, loading, error, meta, refetch, updateHospitalStatus } = useHospitals({
    district: districtFilter || undefined,
    page: table.page + 1,
    limit: table.rowsPerPage,
  });

  // Filter hospitals based on search name
  const dataFiltered: HospitalTableRowProps[] = hospitals.filter((hospital) =>
    hospital.name.toLowerCase().includes(filterName.toLowerCase()) ||
    (hospital.address && hospital.address.toLowerCase().includes(filterName.toLowerCase())) ||
    (hospital.email && hospital.email.toLowerCase().includes(filterName.toLowerCase()))
  );

  const notFound = !dataFiltered.length && !!filterName;

  const handleClearFilters = useCallback(() => {
    setFilterName('');
    setDistrictFilter('');
    table.onResetPage();
  }, [table]);

  const handleUpdateStatus = useCallback(async (id: string, is_active: boolean) => {
    try {
      await updateHospitalStatus(id, is_active);
      showSnackbar(`Hospital ${is_active ? 'activated' : 'deactivated'} successfully`, 'success');
    } catch (error: any) {
      showSnackbar(error.message || 'Failed to update hospital status', 'error');
    }
  }, [updateHospitalStatus, showSnackbar]);

  // Refetch when filters change
  useEffect(() => {
    refetch();
  }, [districtFilter, table.page, table.rowsPerPage]);

  return (
    <DashboardContent>
      <Breadcrumb 
        title="Hospitals" 
        items={[
          { title: 'Dashboard', href: '/dashboard' },
          { title: 'Hospitals' }
        ]} 
      />

      <Card>
        <HospitalTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          districtFilter={districtFilter}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
          onDistrictFilterChange={setDistrictFilter}
          onClearFilters={handleClearFilters}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <HospitalTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={dataFiltered.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    dataFiltered.map((hospital) => hospital.id)
                  )
                }
                headLabel={[
                  { id: 'name', label: 'Hospital' },
                  { id: 'address', label: 'Address' },
                  { id: 'district', label: 'District' },
                  { id: 'type', label: 'Type' },
                  { id: 'is_active', label: 'Status' },
                  { id: 'is_verified', label: 'Verified' },
                  { id: 'rating', label: 'Rating' },
                  { id: 'created_at', label: 'Created At' },
                  { id: 'actions', label: '' },
                ]}
              />
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      <Box sx={{ py: 3 }}>Loading...</Box>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={9} align="center">
                      <Box sx={{ py: 3, color: 'error.main' }}>{error}</Box>
                    </TableCell>
                  </TableRow>
                ) : dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <HospitalTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onUpdateStatus={handleUpdateStatus}
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
