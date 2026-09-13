

// ----------------------------------------------------------------------

export function visuallyHidden(hidden?: boolean) {
  return {
    visibility: hidden ? 'hidden' : 'visible',
    position: hidden ? 'absolute' : 'static',
    overflow: hidden ? 'hidden' : 'visible',
    width: hidden ? 0 : 'auto',
    height: hidden ? 0 : 'auto',
  } as const;
}

// ----------------------------------------------------------------------

export function emptyRows(page: number, rowsPerPage: number, arrayLength: number) {
  return page > 0 ? Math.max(0, (1 + page) * rowsPerPage - arrayLength) : 0;
}

// ----------------------------------------------------------------------

type ApplyFilterProps = {
  inputData: any[];
  comparator: (a: any, b: any) => number;
  filterName: string;
  filterDate?: Date | null;
};

export function applyFilter({ inputData, comparator, filterName, filterDate }: ApplyFilterProps) {
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (order) =>
        order.orderNumber.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        order.customerName.toLowerCase().indexOf(filterName.toLowerCase()) !== -1 ||
        order.customerEmail.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterDate) {
    inputData = inputData.filter((order) => {
      const orderDate = new Date(order.orderDate);
      const filterDateOnly = new Date(filterDate);
      return (
        orderDate.getFullYear() === filterDateOnly.getFullYear() &&
        orderDate.getMonth() === filterDateOnly.getMonth() &&
        orderDate.getDate() === filterDateOnly.getDate()
      );
    });
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
