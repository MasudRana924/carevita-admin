import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Typography from '@mui/material/Typography';

import { useRouter } from 'src/routes/hooks';

import { _salesReports } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { Scrollbar } from 'src/components/scrollbar';
import { Breadcrumb } from 'src/components/breadcrumb';
import { LucideIcon } from 'src/components/lucide-icons';
import { TableNoData } from 'src/components/table-no-data';
import { useSnackbar } from 'src/components/snackbar';
import { fCurrency } from 'src/utils/format-number';

import { TableEmptyRows } from '../table-empty-rows';
import { SalesReportsTableRow } from '../sales-reports-table-row';
import { SalesReportsTableHead } from '../sales-reports-table-head';
import { SalesReportsTableToolbar } from '../sales-reports-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

import type { SalesReportsTableRowProps } from '../sales-reports-table-row';

// ----------------------------------------------------------------------

export function SalesReportsView() {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();
  const table = useTable();

  const [filterName, setFilterName] = useState('');
  const [filterYear, setFilterYear] = useState('all');
  const [tableData, setTableData] = useState(_salesReports);

  const dataFiltered: SalesReportsTableRowProps[] = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
    filterYear,
  });

  const notFound = !dataFiltered.length && (!!filterName || filterYear !== 'all');

  // Calculate summary metrics
  const totalRevenue = tableData.reduce((sum, report) => sum + report.totalRevenue, 0);
  const totalOrders = tableData.reduce((sum, report) => sum + report.totalOrders, 0);
  const totalProfit = tableData.reduce((sum, report) => sum + report.netProfit, 0);
  const averageGrowth = tableData.reduce((sum, report) => sum + parseFloat(report.growthRate), 0) / tableData.length;

  const handleExportReport = useCallback(() => {
    showSnackbar('Report exported successfully!');
  }, [showSnackbar]);

  const handleClearFilters = useCallback(() => {
    setFilterName('');
    setFilterYear('all');
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
        title="Sales Reports"
        items={[
          { title: 'Dashboard', href: '/dashboard' },
          { title: 'Reports' },
          { title: 'Sales Reports' },
        ]}
      />

      {/* Summary Cards */}
      <Grid container spacing={3} sx={{ mb: 5 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" sx={{ color: 'primary.main', mb: 1 }}>
              {fCurrency(totalRevenue)}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Total Revenue
            </Typography>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" sx={{ color: 'info.main', mb: 1 }}>
              {totalOrders.toLocaleString()}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Total Orders
            </Typography>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" sx={{ color: 'success.main', mb: 1 }}>
              {fCurrency(totalProfit)}
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Total Profit
            </Typography>
          </Card>
        </Grid>

        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Card sx={{ p: 3, textAlign: 'center' }}>
            <Typography variant="h4" sx={{ color: averageGrowth >= 0 ? 'success.main' : 'error.main', mb: 1 }}>
              {averageGrowth >= 0 ? '+' : ''}{averageGrowth.toFixed(1)}%
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Average Growth
            </Typography>
          </Card>
        </Grid>
      </Grid>

      <Box
        sx={{
          mb: 5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'flex-end',
          gap: 2,
        }}
      >
        <Button
          variant="outlined"
          startIcon={<LucideIcon icon="eva:download-fill" />}
          onClick={handleExportReport}
        >
          Export Report
        </Button>
      </Box>

      <Card>
        <SalesReportsTableToolbar
          numSelected={table.selected.length}
          filters={{
            name: filterName,
            year: filterYear,
          }}
          onFilters={(name, value) => {
            if (name === 'name') {
              setFilterName(value);
              table.onResetPage();
            } else if (name === 'year') {
              setFilterYear(value);
              table.onResetPage();
            }
          }}
          onDeleteSelected={handleDeleteSelected}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <SalesReportsTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={tableData.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    tableData.map((report) => report.id)
                  )
                }
                headLabel={[
                  { id: 'month', label: 'Month' },
                  { id: 'year', label: 'Year' },
                  { id: 'totalOrders', label: 'Total Orders' },
                  { id: 'totalRevenue', label: 'Total Revenue' },
                  { id: 'totalCost', label: 'Total Cost' },
                  { id: 'grossProfit', label: 'Gross Profit' },
                  { id: 'netProfit', label: 'Net Profit' },
                  { id: 'growthRate', label: 'Growth Rate' },
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
                    <SalesReportsTableRow
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
  const [orderBy, setOrderBy] = useState('month');
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
