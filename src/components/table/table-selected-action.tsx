import { forwardRef } from 'react';

import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

type Props = {
  dense?: boolean;
  action?: React.ReactNode;
  rowCount: number;
  numSelected: number;
  onSelectAllRows: (checked: boolean) => void;
  sx?: object;
};

export const TableSelectedAction = forwardRef<HTMLTableSectionElement, Props>(
  ({ dense, action, rowCount, numSelected, onSelectAllRows, sx, ...other }, ref) => {
    if (!numSelected) {
      return null;
    }

    return (
      <TableHead
        ref={ref}
        sx={{
          bgcolor: 'primary.lighter',
          ...sx,
        }}
        {...other}
      >
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={(event) => onSelectAllRows(event.target.checked)}
            />
          </TableCell>

          {action && (
            <TableCell
              colSpan={8}
              sx={{
                p: 0,
                ...(dense && {
                  p: 0,
                }),
              }}
            >
              <Box
                sx={{
                  px: 2,
                  height: 80,
                  display: 'flex',
                  alignItems: 'center',
                  ...(dense && {
                    height: 52,
                  }),
                }}
              >
                <Typography variant="subtitle1" sx={{ color: 'primary.main' }}>
                  {numSelected} selected
                </Typography>

                <Box sx={{ flexGrow: 1 }} />

                {action}
              </Box>
            </TableCell>
          )}
        </TableRow>
      </TableHead>
    );
  }
);
