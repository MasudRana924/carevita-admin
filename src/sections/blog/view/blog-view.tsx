import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import TableBody from '@mui/material/TableBody';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';

import { Scrollbar } from 'src/components/scrollbar';
import { Breadcrumb } from 'src/components/breadcrumb';
import { LucideIcon } from 'src/components/lucide-icons';
import { TableNoData } from 'src/components/table-no-data';

import { BlogTableRow } from '../blog-table-row';
import { BlogTableHead } from '../blog-table-head';
import { TableEmptyRows } from '../table-empty-rows';
import { BlogTableToolbar } from '../blog-table-toolbar';
import { emptyRows, applyFilter, getComparator } from '../utils';

import type { BlogTableRowProps } from '../blog-table-row';

// ----------------------------------------------------------------------

type Props = {
  posts: BlogTableRowProps[];
};

export function BlogView({ posts }: Props) {
  const router = useRouter();
  const table = useTable();

  const [filterName, setFilterName] = useState('');

  const dataFiltered: BlogTableRowProps[] = applyFilter({
    inputData: posts,
    comparator: getComparator(table.order, table.orderBy),
    filterName,
  });

  const notFound = !dataFiltered.length && !!filterName;

  const handleNewPost = useCallback(() => {
    router.push('/dashboard/blog/new');
  }, [router]);

  const handleClearFilters = useCallback(() => {
    setFilterName('');
    table.onResetPage();
  }, [table]);

  return (
    <DashboardContent>
      <Breadcrumb 
        title="Blog" 
        items={[
          { title: 'Dashboard', href: '/dashboard' },
          { title: 'Blog' }
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
          onClick={handleNewPost}
        >
          New post
        </Button>
      </Box>

      <Card>
        <BlogTableToolbar
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
              <BlogTableHead
                order={table.order}
                orderBy={table.orderBy}
                rowCount={posts.length}
                numSelected={table.selected.length}
                onSort={table.onSort}
                onSelectAllRows={(checked) =>
                  table.onSelectAllRows(
                    checked,
                    posts.map((post) => post.id)
                  )
                }
                headLabel={[
                  { id: 'title', label: 'Post' },
                  { id: 'author', label: 'Author' },
                  { id: 'postedAt', label: 'Date' },
                  { id: 'totalViews', label: 'Views', align: 'center' },
                  { id: 'totalComments', label: 'Comments', align: 'center' },
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
                    <BlogTableRow
                      key={row.id}
                      row={row}
                      selected={table.selected.includes(row.id)}
                      onSelectRow={() => table.onSelectRow(row.id)}
                    />
                  ))}

                <TableEmptyRows
                  height={68}
                  emptyRows={emptyRows(table.page, table.rowsPerPage, posts.length)}
                />

                {notFound && <TableNoData searchQuery={filterName} onClearFilters={handleClearFilters} />}
              </TableBody>
            </Table>
          </TableContainer>
        </Scrollbar>

        <TablePagination
          component="div"
          page={table.page}
          count={posts.length}
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
  const [orderBy, setOrderBy] = useState('title');
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
