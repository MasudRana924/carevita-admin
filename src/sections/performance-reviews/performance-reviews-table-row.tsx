import { useState, useCallback } from 'react';

import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import { useTheme } from '@mui/material/styles';

import { usePopover } from 'src/hooks/use-popover';

import { fDate } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { LucideIcon } from 'src/components/lucide-icons';
import { CustomPopover } from 'src/components/custom-popover';

// ----------------------------------------------------------------------

export type PerformanceReviewsTableRowProps = {
  id: string;
  employeeId: string;
  employeeName: string;
  reviewer: string;
  reviewPeriod: string;
  reviewDate: string;
  overallRating: number;
  performance: string;
  strengths: string;
  areasForImprovement: string;
  goals: string;
  comments: string;
  nextReviewDate: string;
  avatarUrl?: string;
};

type Props = {
  selected: boolean;
  onEditRow: VoidFunction;
  onViewRow: VoidFunction;
  onSelectRow: VoidFunction;
  onDeleteRow: VoidFunction;
  row: PerformanceReviewsTableRowProps;
};

export function PerformanceReviewsTableRow({
  row,
  selected,
  onEditRow,
  onViewRow,
  onSelectRow,
  onDeleteRow,
}: Props) {
  const theme = useTheme();

  const { employeeName, reviewer, reviewPeriod, reviewDate, overallRating, performance, avatarUrl } = row;

  const confirm = usePopover();

  const quickEdit = usePopover();

  const handleView = useCallback(() => {
    onViewRow();
    quickEdit.onClose();
  }, [onViewRow, quickEdit]);

  const handleEdit = useCallback(() => {
    onEditRow();
    quickEdit.onClose();
  }, [onEditRow, quickEdit]);

  const handleDelete = useCallback(() => {
    onDeleteRow();
    confirm.onClose();
  }, [onDeleteRow, confirm]);



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

        <TableCell>{reviewer}</TableCell>

        <TableCell>{reviewPeriod}</TableCell>

        <TableCell>{fDate(reviewDate)}</TableCell>

        <TableCell>{overallRating}/5</TableCell>

        <TableCell>{performance}</TableCell>

        <TableCell align="right">
          <IconButton color={quickEdit.open ? 'primary' : 'default'} onClick={quickEdit.onOpen}>
            <LucideIcon icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={quickEdit.open}
        onClose={quickEdit.onClose}
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
