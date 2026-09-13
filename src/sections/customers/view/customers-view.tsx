import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { useRouter } from 'src/routes/hooks';

import { _customers } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { Scrollbar } from 'src/components/scrollbar';
import { Breadcrumb } from 'src/components/breadcrumb';
import { LucideIcon } from 'src/components/lucide-icons';
import { TableNoData } from 'src/components/table-no-data';

import { TableEmptyRows } from '../table-empty-rows';
import { CustomersTableRow } from '../customers-table-row';
import { CustomersTableHead } from '../customers-table-head';
import { CustomersTableToolbar } from '../customers-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

import type { CustomersTableRowProps } from '../customers-table-row';

// ----------------------------------------------------------------------

export function CustomersView() {
  const router = useRouter();
  const table = useTable();

  const [filterName, setFilterName] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const dataFiltered: CustomersTableRowProps[] = applyFilter({
    inputData: _customers,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
    filterType,
    filterStatus,
  });

  const notFound = !dataFiltered.length && (!!filterName || filterType !== 'all' || filterStatus !== 'all');

  const handleNewCustomer = useCallback(() => {
    router.push('/dashboard/customers/new');
  }, [router]);

  const handleClearFilters = useCallback(() => {
    setFilterName('');
    setFilterType('all');
    setFilterStatus('all');
    table.onResetPage();
  }, [table]);

  return (
    <DashboardContent>
      <Breadcrumb 
        title="Customers Management" 
        items={[
          { title: 'Dashboard', href: '/dashboard' },
          { title: 'Customers' }
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
          onClick={handleNewCustomer}
        >
          Add Customer
        </Button>
      </Box>

      <Card>
        <CustomersTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          filterType={filterType}
          filterStatus={filterStatus}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
          onFilterType={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterType(event.target.value);
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
              <CustomersTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={_customers.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    _customers.map((customer) => customer.id)
                  )
                }
                headLabel={[
                  { id: 'name', label: 'Customer Name' },
                  { id: 'phone', label: 'Phone' },
                  { id: 'customerType', label: 'Type' },
                  { id: 'totalOrders', label: 'Total Orders' },
                  { id: 'totalSpent', label: 'Total Spent' },
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
                    <CustomersTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, _customers.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} onClearFilters={handleClearFilters} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={_customers.length}
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
