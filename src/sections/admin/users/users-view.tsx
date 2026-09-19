import { useState, useCallback, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

import { Scrollbar } from 'src/components/scrollbar';
import { Breadcrumb } from 'src/components/breadcrumb';
import { TableNoData } from 'src/components/table-no-data';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { useSnackbar } from 'src/components/snackbar';
import { useUsers } from 'src/hooks/useAdminApi';

import { UserTableRow } from './user-table-row';
import { UserTableHead } from './user-table-head';
import { UserTableToolbar } from './user-table-toolbar';

import type { UserTableRowProps } from './user-table-row';

// ----------------------------------------------------------------------

export function UsersView() {
  const { showSnackbar } = useSnackbar();
  const table = useTable();

  const [filterName, setFilterName] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [confirm, setConfirm] = useState<{ type: 'block' | 'unblock'; id: string } | null>(null);

  const { users, loading, error, meta, refetch, blockUser, unblockUser } = useUsers({
    role: roleFilter as any,
    status: statusFilter as any,
    page: table.page + 1,
    limit: table.rowsPerPage,
  });

  // Filter users based on search name
  const dataFiltered: UserTableRowProps[] = users.filter((user) =>
    user.name.toLowerCase().includes(filterName.toLowerCase()) ||
    user.email.toLowerCase().includes(filterName.toLowerCase()) ||
    user.phone.includes(filterName)
  );

  const notFound = !dataFiltered.length && !!filterName;

  const handleClearFilters = useCallback(() => {
    setFilterName('');
    setRoleFilter('');
    setStatusFilter('');
    table.onResetPage();
  }, [table]);

  const handleBlockUser = useCallback((id: string) => {
    setConfirm({ type: 'block', id });
  }, []);

  const handleUnblockUser = useCallback((id: string) => {
    setConfirm({ type: 'unblock', id });
  }, []);

  const handleConfirm = useCallback(async () => {
    if (!confirm) return;
    try {
      if (confirm.type === 'block') {
        await blockUser(confirm.id);
        showSnackbar('User blocked successfully', 'success');
      } else {
        await unblockUser(confirm.id);
        showSnackbar('User unblocked successfully', 'success');
      }
      setConfirm(null);
    } catch (err: any) {
      showSnackbar(err.message || 'Failed to update user', 'error');
    }
  }, [confirm, blockUser, unblockUser, showSnackbar]);

  // Refetch when filters change
  useEffect(() => {
    refetch();
  }, [roleFilter, statusFilter, table.page, table.rowsPerPage]);

  return (
    <DashboardContent>
      <Breadcrumb 
        title="Users" 
        items={[
          { title: 'Dashboard', href: '/dashboard' },
          { title: 'Users' }
        ]} 
      />

      <Card>
        <UserTableToolbar
          numSelected={table.selected.length}
          filterName={filterName}
          roleFilter={roleFilter}
          statusFilter={statusFilter}
          onFilterName={(event: React.ChangeEvent<HTMLInputElement>) => {
            setFilterName(event.target.value);
            table.onResetPage();
          }}
          onRoleFilterChange={setRoleFilter}
          onStatusFilterChange={setStatusFilter}
          onClearFilters={handleClearFilters}
        />

        <Scrollbar>
          <TableContainer sx={{ overflow: 'unset' }}>
            <Table sx={{ minWidth: 800 }}>
              <UserTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={dataFiltered.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    dataFiltered.map((user) => user.id)
                  )
                }
                headLabel={[
                  { id: 'name', label: 'User' },
                  { id: 'phone', label: 'Phone' },
                  { id: 'role', label: 'Role' },
                  { id: 'status', label: 'Status' },
                  { id: 'verified', label: 'Verified' },
                  { id: 'created_at', label: 'Created At' },
                  { id: 'actions', label: '' },
                ]}
              />
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Box sx={{ py: 3 }}>Loading...</Box>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={7} align="center">
                      <Box sx={{ py: 3, color: 'error.main' }}>{error}</Box>
                    </TableCell>
                  </TableRow>
                ) : dataFiltered.map((row) => (
                    <UserTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                      onBlockUser={handleBlockUser}
                      onUnblockUser={handleUnblockUser}
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

      <ConfirmDialog
        open={!!confirm}
        onClose={() => setConfirm(null)}
        title={confirm?.type === 'block' ? 'Block user' : 'Unblock user'}
        content={
          <Typography>
            {confirm?.type === 'block'
              ? 'Block this user account?'
              : 'Unblock this user account?'}
          </Typography>
        }
        action={
          <Button
            variant="contained"
            color={confirm?.type === 'block' ? 'error' : 'success'}
            onClick={handleConfirm}
          >
            {confirm?.type === 'block' ? 'Block' : 'Unblock'}
          </Button>
        }
      />
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
