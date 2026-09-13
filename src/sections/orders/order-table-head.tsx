import Box from '@mui/material/Box';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableHead from '@mui/material/TableHead';
import TableCell from '@mui/material/TableCell';
import TableSortLabel from '@mui/material/TableSortLabel';

import { visuallyHidden } from './utils';

// ----------------------------------------------------------------------

type OrderTableHeadProps = {
  orderBy: string;
  rowCount: number;
  numSelected: number;
  order: 'asc' | 'desc';
  onSort: (id: string) => void;
  headLabel: Record<string, any>[];
  onSelectAllRows: (checked: boolean) => void;
};

export function OrderTableHead({
  order,
  onSort,
  orderBy,
  rowCount,
  headLabel,
  numSelected,
  onSelectAllRows,
}: OrderTableHeadProps) {
  return (
    <TableHead>
      <TableRow>
        <TableCell 
          padding="checkbox"
          sx={{
            backgroundColor: '#f8fafc',
            borderBottom: 'none',
            borderTop: 'none',
            py: 2,
            px: 3,
          }}
        >
          <Checkbox
            indeterminate={numSelected > 0 && numSelected < rowCount}
            checked={rowCount > 0 && numSelected === rowCount}
            onChange={(event) => onSelectAllRows(event.target.checked)}
            sx={{
              '&.Mui-checked': {
                color: 'primary.main',
              },
            }}
          />
        </TableCell>

        {headLabel.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.align || 'left'}
            sortDirection={orderBy === headCell.id ? order : false}
            sx={{
              width: headCell.width,
              minWidth: headCell.minWidth,
              backgroundColor: '#f8fafc',
              borderBottom: 'none',
              borderTop: 'none',
              py: 2,
              px: 3,
              fontWeight: 600,
              fontSize: '0.875rem',
              color: 'text.primary',
              '& .MuiTableSortLabel-root': {
                fontWeight: 600,
                fontSize: '0.875rem',
                color: 'text.primary',
                '&:hover': {
                  color: 'primary.main',
                },
                '&.Mui-active': {
                  color: 'primary.main',
                  '& .MuiTableSortLabel-icon': {
                    color: 'primary.main',
                  },
                },
              },
            }}
          >
            {headCell.id === 'actions' || headCell.id === 'orderDate' ? (
              headCell.label
            ) : (
              <TableSortLabel
                hideSortIcon
                active={orderBy === headCell.id}
                direction={orderBy === headCell.id ? order : 'asc'}
                onClick={() => onSort(headCell.id)}
              >
                {headCell.label}

                {orderBy === headCell.id ? (
                  <Box sx={{ ...visuallyHidden }}>
                    Sorted by
                  </Box>
                ) : null}
              </TableSortLabel>
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
