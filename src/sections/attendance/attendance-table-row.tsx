import { useState, useCallback } from 'react';

import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';

import { ConfirmDialog } from 'src/components/custom-dialog';
import { LucideIcon } from 'src/components/lucide-icons';
import { CustomPopover, usePopover } from 'src/components/custom-popover';
import { useRouter } from 'src/routes/hooks';
import { fDate } from 'src/utils/format-time';

// ----------------------------------------------------------------------

export type AttendanceTableRowProps = {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string;
  checkIn: string;
  checkOut: string;
  totalHours: number;
  status: string;
  overtime: number;
  notes?: string;
};

type Props = {
  row: AttendanceTableRowProps;
  selected: boolean;
  onSelectRow: VoidFunction;
  onDeleteRow?: (id: string) => void;
};

export function AttendanceTableRow({ row, selected, onSelectRow, onDeleteRow }: Props) {
  const router = useRouter();
  const confirm = usePopover();
  const popover = usePopover();

  const { employeeId, employeeName, date, checkIn, checkOut, totalHours, status, overtime } = row;

  const handleViewRow = useCallback(() => {
    router.push(`/dashboard/attendance/${row.id}`);
  }, [router, row.id]);

  const handleEditRow = useCallback(() => {
    router.push(`/dashboard/attendance/${row.id}`);
  }, [router, row.id]);

  const handleDeleteRow = useCallback(() => {
    if (onDeleteRow) {
      onDeleteRow(row.id);
    }
    confirm.onClose();
  }, [onDeleteRow, row.id, confirm]);

  const getStatusColor = (statusValue: string) => {
    switch (statusValue) {
      case 'Present':
        return 'success';
      case 'Late':
        return 'warning';
      case 'Absent':
        return 'error';
      case 'Half Day':
        return 'info';
      default:
        return 'default';
    }
  };

  return (
    <>
      <TableRow selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={employeeName}
            primaryTypographyProps={{ typography: 'body2' }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={employeeId}
            primaryTypographyProps={{ typography: 'body2' }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={fDate(date)}
            primaryTypographyProps={{ typography: 'body2' }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={checkIn}
            primaryTypographyProps={{ typography: 'body2' }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={checkOut}
            primaryTypographyProps={{ typography: 'body2' }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={`${totalHours}h`}
            primaryTypographyProps={{ typography: 'body2' }}
          />
        </TableCell>

        <TableCell>
          <Button
            size="small"
            variant="outlined"
            color={getStatusColor(status) as any}
            sx={{ textTransform: 'capitalize' }}
          >
            {status}
          </Button>
        </TableCell>

        <TableCell>
          <ListItemText
            primary={`${overtime}h`}
            primaryTypographyProps={{ typography: 'body2' }}
          />
        </TableCell>

        <TableCell align="right">
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <LucideIcon icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        anchorEl={popover.anchorEl}
        onClose={popover.onClose}
        arrow="top-right"
        sx={{ width: 140 }}
      >
        <MenuItem
          onClick={() => {
            handleViewRow();
            popover.onClose();
          }}
        >
          <LucideIcon icon="solar:eye-bold" />
          View
        </MenuItem>

        <MenuItem
          onClick={() => {
            handleEditRow();
            popover.onClose();
          }}
        >
          <LucideIcon icon="solar:pen-bold" />
          Edit
        </MenuItem>

        <MenuItem
          onClick={(event) => {
            confirm.onOpen(event);
            popover.onClose();
          }}
          sx={{ color: 'error.main' }}
        >
          <LucideIcon icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>

      <ConfirmDialog
        open={confirm.open}
        onClose={confirm.onClose}
        title="Delete"
        content="Are you sure want to delete?"
        action={
          <Button variant="contained" color="error" onClick={handleDeleteRow}>
            Delete
          </Button>
        }
      />
    </>
  );
}
