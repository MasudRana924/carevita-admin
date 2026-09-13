import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { useRouter } from 'src/routes/hooks';

import { _performanceReviews } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { Scrollbar } from 'src/components/scrollbar';
import { Breadcrumb } from 'src/components/breadcrumb';
import { LucideIcon } from 'src/components/lucide-icons';
import { TableNoData } from 'src/components/table-no-data';

import { TableEmptyRows } from '../table-empty-rows';
import { PerformanceReviewsTableRow } from '../performance-reviews-table-row';
import { PerformanceReviewsTableHead } from '../performance-reviews-table-head';
import { PerformanceReviewsTableToolbar } from '../performance-reviews-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

import type { PerformanceReviewsTableRowProps } from '../performance-reviews-table-row';

// ----------------------------------------------------------------------

export function PerformanceReviewsView() {
  const router = useRouter();
  const table = useTable();

  const [filterName, setFilterName] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('all');
  const [filterPerformance, setFilterPerformance] = useState('all');

  const dataFiltered: PerformanceReviewsTableRowProps[] = applyFilter({
    inputData: _performanceReviews,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
    filterPeriod,
    filterPerformance,
  });

  const notFound = !dataFiltered.length && (!!filterName || filterPeriod !== 'all' || filterPerformance !== 'all');

  const handleNewReview = useCallback(() => {
    router.push('/dashboard/performance-reviews/new');
  }, [router]);

  const handleClearFilters = useCallback(() => {
    setFilterName('');
    setFilterPeriod('all');
    setFilterPerformance('all');
    table.onResetPage();
  }, [table]);

  const handleDeleteRow = useCallback(
    (id: string) => {
      const deleteRow = _performanceReviews.filter((row) => row.id !== id);
      // In a real app, you would update the state here
      table.onUpdatePageDeleteRow(dataFiltered.length);
    },
    [dataFiltered.length, table]
  );

  const handleDeleteRows = useCallback(() => {
    const deleteRows = _performanceReviews.filter((row) => !table.selected.includes(row.id));
    // In a real app, you would update the state here
    table.onUpdatePageDeleteRows({
      totalRows: _performanceReviews.length,
      totalRowsInPage: dataFiltered.length,
      totalSelected: table.selected.length,
    });
  }, [table, dataFiltered.length]);

  const handleEditRow = useCallback(
    (id: string) => {
      router.push(`/dashboard/performance-reviews/${id}`);
    },
    [router]
  );

  const handleViewRow = useCallback(
    (id: string) => {
      router.push(`/dashboard/performance-reviews/${id}`);
    },
    [router]
  );

  return (
    <DashboardContent>
      <Breadcrumb 
        title="Performance Reviews" 
        items={[
          { title: 'Dashboard', href: '/dashboard' },
          { title: 'Performance Reviews' }
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
          onClick={handleNewReview}
        >
          New Review
        </Button>
      </Box>

      <Card>
        <PerformanceReviewsTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          filterPeriod={filterPeriod}
          filterPerformance={filterPerformance}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
          onFilterPeriod={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterPeriod(event.target.value);
            table.onResetPage();
          }}
          onFilterPerformance={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterPerformance(event.target.value);
            table.onResetPage();
          }}
          onClearFilters={handleClearFilters}
          onDeleteRows={handleDeleteRows}
        />

        <TableContainer sx={{ position: 'relative', overflow: 'unset' }}>
          <Scrollbar>
            <Table size={table.dense ? 'small' : 'medium'} sx={{ minWidth: 960 }}>
              <PerformanceReviewsTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={_performanceReviews.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked: boolean) =>
                  table.onSelectAllRows(
                    checked,
                    _performanceReviews.map((row) => row.id)
                  )
                }
                                 headLabel={[
                   { id: 'employee', label: 'Employee' },
                   { id: 'reviewer', label: 'Reviewer' },
                   { id: 'reviewPeriod', label: 'Review Period' },
                   { id: 'reviewDate', label: 'Review Date' },
                   { id: 'overallRating', label: 'Overall Rating' },
                   { id: 'performance', label: 'Performance' },
                   { id: 'actions', label: 'Actions' },
                 ]}
              />

              <TableBody>
                {dataFiltered
                  .slice(table.page * table.rowsPerPage, table.page * table.rowsPerPage + table.rowsPerPage)
                  .map((row) => (
                    <PerformanceReviewsTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onDeleteRow={() => handleDeleteRow(row.id)}
                      onEditRow={() => handleEditRow(row.id)}
                      onViewRow={() => handleViewRow(row.id)}
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, _performanceReviews.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} onClearFilters={handleClearFilters} />}
              </TableBody>
            </Table>
          </Scrollbar>
        </TableContainer>

        <TablePagination
          component="div"
          page={table.page}
          count={_performanceReviews.length}
          rowsPerPage={table.rowsPerPage}
          onPageChange={table.onPage}
          rowsPerPageOptions={[5, 10, 25]}
          onRowsPerPageChange={table.onRowsPerPage}
        />
      </Card>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

export function useTable() {
  const [page, setPage] = useState(0);
  const [orderBy, setOrderBy] = useState('employeeName');
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selected, setSelected] = useState<string[]>([]);
  const [order, setOrder] = useState<'asc' | 'desc'>('asc');
  const [dense, setDense] = useState(false);

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

  const onPage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onRowsPerPage = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      onResetPage();
    },
    [onResetPage]
  );

  const onUpdatePageDeleteRow = useCallback(
    (dataLength: number) => {
      const selectedIndex = selected.indexOf('id');
      const newSelected: string[] = [...selected];

      if (selectedIndex > -1) {
        newSelected.splice(selectedIndex, 1);
      }

      const currentPage = Math.ceil((dataLength - 1) / rowsPerPage);

      if (currentPage < page) {
        setPage(currentPage);
      }

      setSelected(newSelected);
    },
    [page, rowsPerPage, selected]
  );

  const onUpdatePageDeleteRows = useCallback(
    ({
      totalRows,
      totalRowsInPage,
      totalSelected,
    }: {
      totalRows: number;
      totalRowsInPage: number;
      totalSelected: number;
    }) => {
      const totalSelectedOnPage = Math.min(totalSelected, totalRowsInPage);

      const newSelected = selected.filter((id) => !selected.includes(id));

      const currentPage = Math.ceil((totalRows - totalSelectedOnPage) / rowsPerPage);

      if (currentPage < page) {
        setPage(currentPage);
      }

      setSelected(newSelected);
    },
    [page, rowsPerPage, selected]
  );

  return {
    page,
    order,
    onSort,
    orderBy,
    selected,
    rowsPerPage,
    dense,
    onSelectRow,
    onResetPage,
    onPage,
    onSelectAllRows,
    onRowsPerPage,
    onUpdatePageDeleteRow,
    onUpdatePageDeleteRows,
  };
}
