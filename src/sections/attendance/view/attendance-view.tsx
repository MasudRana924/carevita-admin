import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { useRouter } from 'src/routes/hooks';

import { _attendance } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { Scrollbar } from 'src/components/scrollbar';
import { Breadcrumb } from 'src/components/breadcrumb';
import { LucideIcon } from 'src/components/lucide-icons';
import { TableNoData } from 'src/components/table-no-data';
import { useSnackbar } from 'src/components/snackbar';

import { TableEmptyRows } from '../table-empty-rows';
import { AttendanceTableRow } from '../attendance-table-row';
import { AttendanceTableHead } from '../attendance-table-head';
import { AttendanceTableToolbar } from '../attendance-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

import type { AttendanceTableRowProps } from '../attendance-table-row';

// ----------------------------------------------------------------------

export function AttendanceView() {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const table = useTable();

  const [filterName, setFilterName] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterDate, setFilterDate] = useState('all');
  const [tableData, setTableData] = useState(_attendance);

  const dataFiltered: AttendanceTableRowProps[] = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
    filterStatus,
    filterDate,
  });

  const notFound = !dataFiltered.length && (!!filterName || filterStatus !== 'all' || filterDate !== 'all');

  const handleNewAttendance = useCallback(() => {
    router.push('/dashboard/attendance/new');
  }, [router]);

  const handleClearFilters = useCallback(() => {
    setFilterName('');
    setFilterStatus('all');
    setFilterDate('all');
    table.onResetPage();
  }, [table]);

  const handleDeleteSelected = useCallback(() => {
    const deleteRows = tableData.filter((row) => !table.selected.includes(row.id));
    setTableData(deleteRows);

    table.onUpdatePageDeleteRows({
      totalRows: tableData.length,
      totalRowsInPage: dataFiltered.length,
      totalSelected: table.selected.length,
    });

    showSnackbar('Delete success!');
  }, [dataFiltered.length, showSnackbar, table, tableData]);

  const handleDeleteRow = useCallback(
    (id: string) => {
      const deleteRow = tableData.filter((row) => row.id !== id);
      setTableData(deleteRow);

      table.onUpdatePageDeleteRow(dataFiltered.length);

      showSnackbar('Delete success!');
    },
    [dataFiltered.length, showSnackbar, table, tableData]
  );

  return (
    <DashboardContent>
      <Breadcrumb
        title="Attendance"
        items={[
          { title: 'Dashboard', href: '/dashboard' },
          { title: 'HR Management', href: '/dashboard/hr' },
          { title: 'Attendance' },
        ]}
      />

      <Box
        sx={{
          mb: 5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
        }}
      >
        <Button
          variant="contained"
          color="inherit"
          startIcon={<LucideIcon icon="mingcute:add-line" />}
          onClick={handleNewAttendance}
        >
          Add Attendance
        </Button>
      </Box>

      <Card>
        <AttendanceTableToolbar
          numSelected={table.selected.length}
          filters={{
            name: filterName,
            status: filterStatus,
            date: filterDate,
          }}
          onFilters={(name, value) => {
            if (name === 'name') {
              setFilterName(value);
              table.onResetPage();
            } else if (name === 'status') {
              setFilterStatus(value);
              table.onResetPage();
            } else if (name === 'date') {
              setFilterDate(value);
              table.onResetPage();
            }
          }}
          employeeNames={tableData.map((row) => row.employeeName)}
          onDeleteSelected={handleDeleteSelected}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <AttendanceTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={tableData.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    tableData.map((attendance) => attendance.id)
                  )
                }
                headLabel={[
                  { id: 'employeeName', label: 'Employee Name' },
                  { id: 'employeeId', label: 'Employee ID' },
                  { id: 'date', label: 'Date' },
                  { id: 'checkIn', label: 'Check In' },
                  { id: 'checkOut', label: 'Check Out' },
                  { id: 'totalHours', label: 'Total Hours' },
                  { id: 'status', label: 'Status' },
                  { id: 'overtime', label: 'Overtime' },
                  { id: 'actions', label: '' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <AttendanceTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onDeleteRow={handleDeleteRow}
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} onClearFilters={handleClearFilters} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={tableData.length}
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
  const [orderBy, setOrderBy] = useState('date');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');

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
    (id: string) => {
      const selectedIndex = selected.indexOf(id);

      let newSelected: string[] = [];

      if (selectedIndex === -1) {
        newSelected = newSelected.concat(selected, id);
      } else if (selectedIndex === 0) {
        newSelected = newSelected.concat(selected.slice(1));
      } else if (selectedIndex === selected.length - 1) {
        newSelected = newSelected.concat(selected.slice(0, -1));
      } else if (selectedIndex > 0) {
        newSelected = newSelected.concat(
          selected.slice(0, selectedIndex),
          selected.slice(selectedIndex + 1)
        );
      }

      setSelected(newSelected);
    },
    [selected]
  );

  const onChangePage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onChangeRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  }, []);

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onUpdatePageDeleteRows = useCallback(
    ({ totalRows, totalRowsInPage, totalSelected }: {
      totalRows: number;
      totalRowsInPage: number;
      totalSelected: number;
    }) => {
      const newTotalRows = totalRows - totalSelected;

      if (totalRowsInPage === totalSelected) {
        setPage(Math.max(0, Math.ceil(newTotalRows / rowsPerPage) - 1));
      }
    },
    [rowsPerPage]
  );

  const onUpdatePageDeleteRow = useCallback(
    (totalRowsInPage: number) => {
      if (totalRowsInPage === 1) {
        setPage(Math.max(0, page - 1));
      }
    },
    [page]
  );

  return {
    page,
    order,
    orderBy,
    rowsPerPage,
    selected,
    onSelectRow,
    onSelectAllRows,
    onChangePage,
    onChangeRowsPerPage,
    onSort,
    onResetPage,
    onUpdatePageDeleteRows,
    onUpdatePageDeleteRow,
  };
}
