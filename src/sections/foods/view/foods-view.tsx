import { useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import { alpha } from '@mui/material/styles';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { useRouter } from 'src/routes/hooks';

import { useFoods } from 'src/hooks/useApi';
import { useTable, getComparator } from 'src/hooks/use-table';

import { DashboardContent } from 'src/layouts/dashboard';

import { Scrollbar } from 'src/components/scrollbar';
import { Breadcrumb } from 'src/components/breadcrumb';
import { LucideIcon } from 'src/components/lucide-icons';
import { TableNoData, TableEmptyRows } from 'src/components/table';

import { FoodTableRow } from '../food-table-row';
import { FoodTableHead } from '../food-table-head';
import { FoodTableToolbar } from '../food-table-toolbar';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'name', label: 'Name' },
  { id: 'price', label: 'Price' },
  { id: 'category', label: 'Category' },
  { id: 'available', label: 'Available' },
  { id: 'createdAt', label: 'Created At' },
                    { id: 'actions', label: '' },
];



// ----------------------------------------------------------------------

export function FoodsView() {
  const router = useRouter();
  const table = useTable();



  const { data: foodsData, isLoading, error } = useFoods();

  const foods = foodsData || [];

  const [tableData, setTableData] = useState(foods);

  const [filterName, setFilterName] = useState('');

  const dataFiltered = applyFilter({
    inputData: tableData,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const dataInPage = dataFiltered.slice(
    table.page * table.rowsPerPage,
    table.page * table.rowsPerPage + table.rowsPerPage
  );

  const denseHeight = table.dense ? 52 : 72;

  const notFound = !dataFiltered.length && !!filterName;

  const handleNewFood = useCallback(() => {
    router.push('/dashboard/foods/new');
  }, [router]);

  const handleClearFilters = useCallback(() => {
    setFilterName('');
    table.onResetPage();
  }, [table]);





  // Update table data when foods data changes
  useEffect(() => {
    if (foods.length > 0) {
      setTableData(foods);
    }
  }, [foods]);

  if (isLoading) {
    return (
      <DashboardContent>
        <Breadcrumb 
          title="Foods" 
          items={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Foods' }
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
            onClick={handleNewFood}
          >
            New Food
          </Button>
        </Box>

        <Card>
          <Box
            sx={{
              display: 'flex',
              flex: '1 1 auto',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 400,
            }}
          >
            <LinearProgress
              sx={{
                width: 1,
                maxWidth: 320,
                bgcolor: (theme) => alpha(theme.palette.text.primary, 0.16),
                [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
              }}
            />
          </Box>
        </Card>
      </DashboardContent>
    );
  }

  if (error) {
    return (
      <DashboardContent>
        <Breadcrumb 
          title="Foods" 
          items={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Foods' }
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
            onClick={handleNewFood}
          >
            New Food
          </Button>
        </Box>

        <Card>
          <Box
            sx={{
              display: 'flex',
              flex: '1 1 auto',
              alignItems: 'center',
              justifyContent: 'center',
              minHeight: 400,
            }}
          >
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="h6" color="error" sx={{ mb: 1 }}>
                Error loading foods
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {error.message}
              </Typography>
            </Box>
          </Box>
        </Card>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <Breadcrumb 
        title="Foods" 
        items={[
          { title: 'Dashboard', href: '/dashboard' },
          { title: 'Foods' }
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
          onClick={handleNewFood}
        >
          New Food
        </Button>
      </Box>

      <Card>
        <FoodTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
          onClearFilters={handleClearFilters}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <FoodTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={tableData.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    tableData.map((row) => row._id)
                  )
                }
                headLabel={TABLE_HEAD}
              />

              <TableBody>
                {dataInPage.map((row) => (
                  <FoodTableRow
                    key={row._id}
                    row={row}
                    selected={table.selected.includes(row._id)}
                    onSelectRow={() => table.onSelectRow(row._id)}
                  />
                ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, tableData.length)}
                />

                {notFound && <TableNoData notFound={notFound} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={tableData.length}
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

function applyFilter({
  inputData,
  comparator,
  filterName,
}: {
  inputData: any[];
  comparator: (a: any, b: any) => number;
  filterName: string;
}) {
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (food) => food.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  return inputData;
}

function emptyRows(page: number, rowsPerPage: number, arrayLength: number) {
  return page > 0 ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}
