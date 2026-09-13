import type { PurchaseOrdersTableRowProps } from './purchase-orders-table-row';

// ----------------------------------------------------------------------

export function emptyRows(page: number, rowsPerPage: number, arrayLength: number) {
  return page > 0 ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}

// ----------------------------------------------------------------------

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

export function getComparator<Key extends keyof any>(
  order: 'asc' | 'desc',
  orderBy: Key
): (a: any, b: any) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

// ----------------------------------------------------------------------

export function applyFilter({
  inputData,
  comparator,
  filterName,
  filterStatus,
  filterSupplier,
}: {
  inputData: PurchaseOrdersTableRowProps[];
  comparator: (a: PurchaseOrdersTableRowProps, b: PurchaseOrdersTableRowProps) => number;
  filterName: string;
  filterStatus: string;
  filterSupplier: string;
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
      (purchaseOrder) => purchaseOrder.poNumber.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterStatus !== 'all') {
    inputData = inputData.filter((purchaseOrder) => purchaseOrder.status === filterStatus);
  }

  if (filterSupplier !== 'all') {
    inputData = inputData.filter((purchaseOrder) => purchaseOrder.supplierName === filterSupplier);
  }

  return inputData;
}
