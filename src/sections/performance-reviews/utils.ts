import type { PerformanceReviewsTableRowProps } from './performance-reviews-table-row';

// ----------------------------------------------------------------------

type Props = {
  inputData: PerformanceReviewsTableRowProps[];
  comparator: (a: any, b: any) => number;
  filterName: string;
  filterPeriod: string;
  filterPerformance: string;
};

export function applyFilter({ inputData, comparator, filterName, filterPeriod, filterPerformance }: Props) {
  const stabilizedThis = inputData.map((el, index) => [el, index] as const);

  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) return order;
    return a[1] - b[1];
  });

  inputData = stabilizedThis.map((el) => el[0]);

  if (filterName) {
    inputData = inputData.filter(
      (item) => item.employeeName.toLowerCase().indexOf(filterName.toLowerCase()) !== -1
    );
  }

  if (filterPeriod !== 'all') {
    inputData = inputData.filter((item) => item.reviewPeriod === filterPeriod);
  }

  if (filterPerformance !== 'all') {
    inputData = inputData.filter((item) => item.performance === filterPerformance);
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
