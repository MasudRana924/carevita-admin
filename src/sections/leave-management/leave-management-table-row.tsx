import { useState, useCallback } from 'react';

import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import { alpha, useTheme } from '@mui/material/styles';

import { usePopover } from 'src/hooks/use-popover';

import { fDate } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { LucideIcon } from 'src/components/lucide-icons';
import { CustomPopover, usePopover as usePopoverCustom } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export type LeaveManagementTableRowProps = {
  id: string;
  employeeId: string;
  employeeName: string;
  leaveType: string;
  startDate: string;
  endDate: string;
  totalDays: number;
  status: string;
  reason: string;
  submittedDate: string;
  approvedBy: string | null;
  approvedDate: string | null;
  notes: string;
  avatarUrl?: string;
};

type Props = {
  selected: boolean;
  onEditRow: VoidFunction;
  onViewRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
  row: LeaveManagementTableRowProps;
};

export function LeaveManagementTableRow({
  row,
  selected,
  onEditRow,
  onViewRow,
  onSelectRow,
  onDeleteRow,
}: Props) {
  const theme = useTheme();

  const { employeeName, leaveType, startDate, endDate, totalDays, status, submittedDate, avatarUrl } = row;

  const confirm = usePopover();

  const quickEdit = usePopover();

  const handleView = useCallback(() => {
    onViewRow();
    quickEdit.onFalse();
  }, [onViewRow, quickEdit]);

  const handleEdit = useCallback(() => {
    onEditRow();
    quickEdit.onFalse();
  }, [onEditRow, quickEdit]);

  const handleDelete = useCallback(() => {
    onDeleteRow();
    confirm.onClose();
  }, [onDeleteRow, confirm]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Rejected':
        return 'error';
      case 'Cancelled':
        return 'default';
      default:
        return 'default';
    }
  };

  return (
    <>
      <TableRow hover selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar
            alt={employeeName}
            src={avatarUrl}
            sx={{ mr: 2, width: 40, height: 40 }}
          />
          <ListItemText
            primary={employeeName}
            secondary={row.employeeId}
            primaryTypographyProps={{ typography: 'body2' }}
            secondaryTypographyProps={{ component: 'span', color: 'text.disabled' }}
          />
        </TableCell>

        <TableCell>{leaveType}</TableCell>

        <TableCell>{fDate(startDate)}</TableCell>

        <TableCell>{fDate(endDate)}</TableCell>

        <TableCell>{totalDays} days</TableCell>

        <TableCell>
          <Label
            variant={theme.palette.mode === 'light' ? 'soft' : 'soft'}
            color={getStatusColor(status)}
            sx={{ textTransform: 'capitalize' }}
          >
            {status}
          </Label>
        </TableCell>

        <TableCell>{fDate(submittedDate)}</TableCell>

        <TableCell align="right">
          <IconButton color={quickEdit.open ? 'primary' : 'default'} onClick={quickEdit.onTrue}>
            <LucideIcon icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={quickEdit.open}
        onClose={quickEdit.onFalse}
        arrow="top-right"
        sx={{ width: 160 }}
      >
        <MenuItem
          onClick={handleView}
          sx={{
            color: 'info.main',
          }}
        >
          <LucideIcon icon="solar:eye-bold" />
          View
        </MenuItem>

        <MenuItem
          onClick={handleEdit}
          sx={{
            color: 'primary.main',
          }}
        >
          <LucideIcon icon="solar:pen-bold" />
          Edit
        </MenuItem>

        <MenuItem
          onClick={confirm.onOpen}
          sx={{
            color: 'error.main',
          }}
        >
          <LucideIcon icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>

      <CustomPopover
        open={confirm.open}
        onClose={confirm.onClose}
        arrow="top-right"
        sx={{ width: 140 }}
      >
        <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
          <LucideIcon icon="solar:trash-bin-trash-bold" />
          Delete
        </MenuItem>
      </CustomPopover>
    </>
  );
}
