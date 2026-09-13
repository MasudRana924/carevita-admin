import { useState, useCallback } from 'react';

import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { useRouter } from 'src/routes/hooks';

import { _orders } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { Scrollbar } from 'src/components/scrollbar';
import { Breadcrumb } from 'src/components/breadcrumb';

import { TableNoData } from '../table-no-data';
import { OrderTableRow } from '../order-table-row';
import { OrderTableHead } from '../order-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { OrderTableToolbar } from '../order-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

import type { OrderProps } from '../order-table-row';

// ----------------------------------------------------------------------

export function OrdersView() {
  const router = useRouter();
  const table = useTable();

  const [filterName, setFilterName] = useState('');
  const [filterDate, setFilterDate] = useState<Date | null>(null);

  const dataFiltered: OrderProps[] = applyFilter({
    inputData: _orders,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
    filterDate,
  });

  const notFound = !dataFiltered.length && (!!filterName || !!filterDate);

  const handleNewOrder = useCallback(() => {
    router.push('/dashboard/orders/new');
  }, [router]);

  const handleClearFilters = useCallback(() => {
    setFilterName('');
    setFilterDate(null);
    table.onResetPage();
  }, [table]);

  return (
    <DashboardContent>
      <Breadcrumb 
        title="Orders" 
        items={[
          { title: 'Dashboard', href: '/dashboard' },
          { title: 'Orders' }
        ]} 
      />

      <Card
        sx={{
          backgroundColor: '#FFFFFF',
          borderRadius: 3,
          overflow: 'hidden',
        }}
      >
        <OrderTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          filterDate={filterDate}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
          onFilterDate={(newValue) => {
            setFilterDate(newValue);
            table.onResetPage();
          }}
          onClearFilters={handleClearFilters}
        />

        <Scrollbar>
          <TableContainer 
            sx={{ 
              overflow: 'unset',
              '& .MuiTable-root': {
                borderCollapse: 'separate',
                borderSpacing: 0,
              },
            }}
          >
            <Table 
              sx={{ 
                minWidth: { xs: 600, md: 800, lg: 1200 },
                '& .MuiTableCell-root': {
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                  py: 2,
                  px: 3,
                },
                '& .MuiTableHead-root .MuiTableCell-root': {
                  backgroundColor: '#f8fafc',
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  color: 'text.primary',
                  borderBottom: 'none',
                  borderTop: 'none',
                },
                '& .MuiTableBody-root .MuiTableRow-root:hover': {
                  backgroundColor: 'transparent',
                },
              }}
            >
              <OrderTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={_orders.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked: boolean) =>
                  table.onSelectAllRows(
                    checked,
                    _orders.map((order) => order.id)
                  )
                }
                headLabel={[
                  { id: 'orderNumber', label: 'Order #', width: 100 },
                  { id: 'customerName', label: 'Customer', width: 150 },
                  { id: 'items', label: 'Items', width: 350 },
                  { id: 'total', label: 'Total', width: 80, align: 'right' },
                  { id: 'status', label: 'Status', width: 100, align: 'center' },
                  { id: 'orderDate', label: 'Order Date', width: 100 },
                  { id: 'paymentStatus', label: 'Payment', width: 80, align: 'center' },
                  { id: 'actions', label: 'Actions', width: 60, align: 'center' },
                ]}
              />
              <TableBody>
                {dataFiltered
                  .slice(
                    table.page * table.rowsPerPage,
                    table.page * table.rowsPerPage + table.rowsPerPage
                  )
                  .map((row) => (
                    <OrderTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, _orders.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={_orders.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onChangePage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onChangeRowsPerPage}
          sx={{
            backgroundColor: '#FFFFFF',
            '& .MuiTablePagination-selectLabel, & .MuiTablePagination-displayedRows': {
              fontWeight: 500,
            },
          }}
        />
      </Card>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('orderDate');
  const [rowsPerPage, setRowsPerPage] = useState(10);
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
