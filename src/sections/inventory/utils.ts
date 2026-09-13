import type { InventoryTableRowProps } from './inventory-table-row';

// ----------------------------------------------------------------------

type Props = {
  inputData: InventoryTableRowProps[];
  comparator: (a: any, b: any) => number;
  filterName: string;
  filterCategory: string;
  filterStatus: string;
};

export function applyFilter({ inputData, comparator, filterName, filterCategory, filterStatus }: Props) {
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (item) => item.name.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
                item.sku.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterCategory !== 'all') {
    inputData = inputData.filter((item) => item.category === filterCategory);
  }

  if (filterStatus !== 'all') {
    inputData = inputData.filter((item) => item.status === filterStatus);
  }

  return inputData;
}

// ----------------------------------------------------------------------

export function getComparator(order: 'asc' | 'desc', orderBy: string) {
  return order === 'desc'
    ? (a: any, b: any) => descendingComparator(a, b, orderBy)
    : (a: any, b: any) => -descendingComparator(a, b, orderBy);
}

export function descendingComparator(a: any, b: any, orderBy: string) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

// ----------------------------------------------------------------------

export function emptyRows(page: number, rowsPerPage: number, arrayLength: number) {
  return page > 0 ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}
