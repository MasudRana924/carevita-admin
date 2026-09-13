import { useState, useCallback } from 'react';

// ----------------------------------------------------------------------

type Order = 'asc' | 'desc';

type OrderBy = string;

type Selected = string[];

type Page = number;

type RowsPerPage = number;

type Dense = boolean;

type TableState = {
  order: Order;
  orderBy: OrderBy;
  selected: Selected;
  page: Page;
  rowsPerPage: RowsPerPage;
  dense: Dense;
};

type TableActions = {
  onSort: (id: string) => void;
  onSelectRow: (id: string) => void;
  onSelectAllRows: (checked: boolean, newSelecteds?: string[]) => void;
  onResetPage: () => void;
  onDense: () => void;
  onPage: (event: unknown, newPage: number) => void;
  onRowsPerPage: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onUpdatePageDeleteRow: (dataLength: number) => void;
  onUpdatePageDeleteRows: ({
    totalRows,
    totalRowsInPage,
    totalSelected,
  }: {
    totalRows: number;
    totalRowsInPage: number;
    totalSelected: number;
  }) => void;
};

export function useTable(defaultOrderBy?: string, defaultOrder?: Order, defaultRowsPerPage?: number, defaultDense?: boolean) {
  const [orderBy, setOrderBy] = useState<OrderBy>(defaultOrderBy || '');

  const [order, setOrder] = useState<Order>(defaultOrder || 'asc');

  const [page, setPage] = useState<Page>(0);

  const [rowsPerPage, setRowsPerPage] = useState<RowsPerPage>(defaultRowsPerPage || 5);

  const [selected, setSelected] = useState<Selected>([]);

  const [dense, setDense] = useState<Dense>(defaultDense || false);

  const onSort = useCallback(
    (id: string) => {
      const isAsc = orderBy === id && order === 'asc';
      if (id !== '') {
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(id);
      }
    },
    [order, orderBy]
  );

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
        newSelected = newSelected.concat(selected.slice(0, selectedIndex), selected.slice(selectedIndex + 1));
      }

      setSelected(newSelected);
    },
    [selected]
  );

  const onSelectAllRows = useCallback(
    (checked: boolean, newSelecteds?: string[]) => {
      if (checked) {
        setSelected(newSelecteds || []);
        return;
      }
      setSelected([]);
    },
    []
  );

  const onResetPage = useCallback(() => {
    setPage(0);
  }, []);

  const onDense = useCallback(() => {
    setDense(!dense);
  }, [dense]);

  const onPage = useCallback((event: unknown, newPage: number) => {
    setPage(newPage);
  }, []);

  const onRowsPerPage = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value, 10));
  }, []);

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
    // state
    order,
    orderBy,
    selected,
    page,
    rowsPerPage,
    dense,
    // actions
    onSort,
    onSelectRow,
    onSelectAllRows,
    onResetPage,
    onDense,
    onPage,
    onRowsPerPage,
    onUpdatePageDeleteRow,
    onUpdatePageDeleteRows,
  };
}

// ----------------------------------------------------------------------

export function getComparator<Key extends keyof any>(order: Order, orderBy: Key): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string }
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}
