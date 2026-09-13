import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { useRouter } from 'src/routes/hooks';

import { _employees } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { Scrollbar } from 'src/components/scrollbar';
import { Breadcrumb } from 'src/components/breadcrumb';
import { LucideIcon } from 'src/components/lucide-icons';
import { TableNoData } from 'src/components/table-no-data';

import { TableEmptyRows } from '../table-empty-rows';
import { EmployeesTableRow } from '../employees-table-row';
import { EmployeesTableHead } from '../employees-table-head';
import { EmployeesTableToolbar } from '../employees-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

import type { EmployeesTableRowProps } from '../employees-table-row';

// ----------------------------------------------------------------------

export function EmployeesView() {
  const router = useRouter();
  const table = useTable();

  const [filterName, setFilterName] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const dataFiltered: EmployeesTableRowProps[] = applyFilter({
    inputData: _employees,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
    filterDepartment,
    filterStatus,
  });

  const notFound = !dataFiltered.length && (!!filterName || filterDepartment !== 'all' || filterStatus !== 'all');

  const handleNewEmployee = useCallback(() => {
    router.push('/dashboard/employees/new');
  }, [router]);

  const handleClearFilters = useCallback(() => {
    setFilterName('');
    setFilterDepartment('all');
    setFilterStatus('all');
    table.onResetPage();
  }, [table]);

  return (
    <DashboardContent>
      <Breadcrumb 
        title="Employees Management" 
        items={[
          { title: 'Dashboard', href: '/dashboard' },
          { title: 'Employees' }
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
          onClick={handleNewEmployee}
        >
          Add Employee
        </Button>
      </Box>

      <Card>
        <EmployeesTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          filterDepartment={filterDepartment}
          filterStatus={filterStatus}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
          onFilterDepartment={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterDepartment(event.target.value);
            table.onResetPage();
          }}
          onFilterStatus={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterStatus(event.target.value);
            table.onResetPage();
          }}
          onClearFilters={handleClearFilters}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <EmployeesTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={_employees.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    _employees.map((employee) => employee.id)
                  )
                }
                headLabel={[
                  { id: 'name', label: 'Employee Name' },
                  { id: 'employeeId', label: 'Employee ID' },
                  { id: 'department', label: 'Department' },
                  { id: 'position', label: 'Position' },
                  { id: 'email', label: 'Email' },
                  { id: 'salary', label: 'Salary' },
                  { id: 'status', label: 'Status' },
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
                    <EmployeesTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, _employees.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} onClearFilters={handleClearFilters} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={_employees.length}
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
