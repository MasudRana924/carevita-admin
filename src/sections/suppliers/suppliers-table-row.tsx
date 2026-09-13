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
import { fCurrency } from 'src/utils/format-number';

// ----------------------------------------------------------------------

export type SuppliersTableRowProps = {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  category: string;
  status: string;
  totalOrders: number;
  totalSpent: number;
  lastOrderDate: string;
  paymentTerms: string;
};

type Props = {
  row: SuppliersTableRowProps;
  selected: boolean;
  onSelectRow: VoidFunction;
};

export function SuppliersTableRow({ row, selected, onSelectRow }: Props) {
  const router = useRouter();
  const confirm = usePopover();
  const popover = usePopover();

  const { name, category, totalOrders, totalSpent, status } = row;

  const handleViewRow = useCallback(() => {
    router.push(`/dashboard/suppliers/${row.id}`);
  }, [router, row.id]);

  const handleEditRow = useCallback(() => {
    router.push(`/dashboard/suppliers/${row.id}`);
  }, [router, row.id]);

  const handleDeleteRow = useCallback(() => {
    console.info('DELETE', row.id);
    confirm.onClose();
  }, [row.id, confirm]);

  const getStatusColor = (statusValue: string) => {
    switch (statusValue) {
      case 'Active':
        return 'success';
      case 'Inactive':
        return 'default';
      case 'Pending':
        return 'warning';
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
            primary={name}
            primaryTypographyProps={{ typography: 'body2' }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={category}
            primaryTypographyProps={{ typography: 'body2' }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={totalOrders}
            primaryTypographyProps={{ typography: 'body2' }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={fCurrency(totalSpent)}
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
