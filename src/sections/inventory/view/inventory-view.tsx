import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { useRouter } from 'src/routes/hooks';

import { _inventory } from 'src/_mock';
import { DashboardContent } from 'src/layouts/dashboard';

import { Scrollbar } from 'src/components/scrollbar';
import { Breadcrumb } from 'src/components/breadcrumb';
import { LucideIcon } from 'src/components/lucide-icons';
import { TableNoData } from 'src/components/table-no-data';

import { TableEmptyRows } from '../table-empty-rows';
import { InventoryTableRow } from '../inventory-table-row';
import { emptyRows, applyFilter, getComparator } from '../utils';      
import { InventoryTableHead } from '../inventory-table-head';
import { InventoryTableToolbar } from '../inventory-table-toolbar';    

import type { InventoryTableRowProps } from '../inventory-table-row';

// ----------------------------------------------------------------------

export function InventoryView() {
  const router = useRouter();
  const table = useTable();

  const [filterName, setFilterName] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  const dataFiltered: InventoryTableRowProps[] = applyFilter({
    inputData: _inventory,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
    filterCategory,
    filterStatus,
  });

  const notFound = !dataFiltered.length && (!!filterName || filterCategory !== 'all' || filterStatus !== 'all');

  const handleNewItem = useCallback(() => {
    router.push('/dashboard/inventory/new');
  }, [router]);

  const handleClearFilters = useCallback(() => {
    setFilterName('');
    setFilterCategory('all');
    setFilterStatus('all');
    table.onResetPage();
  }, [table]);

  return (
    <DashboardContent>
      <Breadcrumb 
        title="Inventory Management" 
        items={[
          { title: 'Dashboard', href: '/dashboard' },
          { title: 'Inventory' }
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
          onClick={handleNewItem}
        >
          Add Item
        </Button>
      </Box>

      <Card>
        <InventoryTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          filterCategory={filterCategory}
          filterStatus={filterStatus}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
          onFilterCategory={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterCategory(event.target.value);
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
              <InventoryTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={_inventory.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    _inventory.map((item) => item.id)
                  )
                }
                headLabel={[
                  { id: 'sku', label: 'SKU' },
                  { id: 'name', label: 'Item Name' },
                  { id: 'category', label: 'Category' },
                  { id: 'quantity', label: 'Quantity' },
                  { id: 'unitPrice', label: 'Unit Price' },
                  { id: 'totalValue', label: 'Total Value' },
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
                    <InventoryTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, _inventory.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} onClearFilters={handleClearFilters} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={_inventory.length}
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
