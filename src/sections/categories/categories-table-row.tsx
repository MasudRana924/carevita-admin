import { useState, useCallback } from 'react';

import Avatar from '@mui/material/Avatar';
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

export type CategoriesTableRowProps = {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  status: string;
  createdAt: string;
};

type Props = {
  row: CategoriesTableRowProps;
  selected: boolean;
  onSelectRow: VoidFunction;
  onDeleteRow?: (id: string) => void;
};

export function CategoriesTableRow({ row, selected, onSelectRow, onDeleteRow }: Props) {
  const router = useRouter();
  const confirm = usePopover();
  const popover = usePopover();

  const { name, description, imageUrl, status, createdAt } = row;

  const handleViewRow = useCallback(() => {
    router.push(`/dashboard/categories/${row.id}`);
  }, [router, row.id]);

  const handleEditRow = useCallback(() => {
    router.push(`/dashboard/categories/${row.id}`);
  }, [router, row.id]);

  const handleDeleteRow = useCallback(() => {
    if (onDeleteRow) {
      onDeleteRow(row.id);
    }
    confirm.onClose();
  }, [onDeleteRow, row.id, confirm]);

  const getStatusColor = (statusValue: string) => {
    switch (statusValue) {
      case 'active':
        return 'success';
      case 'inactive':
        return 'default';
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

        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar alt={name} src={imageUrl} sx={{ mr: 2, width: 48, height: 48 }} />
          <ListItemText
            primary={name}
            primaryTypographyProps={{ typography: 'body2' }}
            secondary={description}
            secondaryTypographyProps={{ component: 'span', color: 'text.disabled' }}
          />
        </TableCell>

        <TableCell sx={{ minWidth: 200 }}>
          <ListItemText
            primary={description}
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
            primary={fDate(createdAt)}
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
