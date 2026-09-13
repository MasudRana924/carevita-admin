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
import { fCurrency } from 'src/utils/format-number';
import { fDate } from 'src/utils/format-time';

// ----------------------------------------------------------------------

export type PurchaseOrdersTableRowProps = {
  id: string;
  poNumber: string;
  supplierName: string;
  supplierEmail: string;
  orderDate: string;
  expectedDelivery: string;
  status: string;
  priority: string;
  total: number;
  items: Array<{
    id: string;
    productName: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }>;
  notes?: string;
  approvedBy?: string | null;
  approvedDate?: string | null;
  deliveryAddress: string;
};

type Props = {
  row: PurchaseOrdersTableRowProps;
  selected: boolean;
  onSelectRow: VoidFunction;
  onDeleteRow?: (id: string) => void;
};

export function PurchaseOrdersTableRow({ row, selected, onSelectRow, onDeleteRow }: Props) {
  const router = useRouter();
  const confirm = usePopover();
  const popover = usePopover();

  const { poNumber, supplierName, orderDate, expectedDelivery, status, priority, total } = row;

  const handleViewRow = useCallback(() => {
    router.push(`/dashboard/purchase-orders/${row.id}`);
  }, [router, row.id]);

  const handleEditRow = useCallback(() => {
    router.push(`/dashboard/purchase-orders/${row.id}`);
  }, [router, row.id]);

  const handleDeleteRow = useCallback(() => {
    if (onDeleteRow) {
      onDeleteRow(row.id);
    }
    confirm.onClose();
  }, [onDeleteRow, row.id, confirm]);

  const getStatusColor = (statusValue: string) => {
    switch (statusValue) {
      case 'Draft':
        return 'default';
      case 'Sent':
        return 'info';
      case 'Confirmed':
        return 'warning';
      case 'Shipped':
        return 'primary';
      case 'Received':
        return 'success';
      case 'Cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const getPriorityColor = (priorityValue: string) => {
    switch (priorityValue) {
      case 'Low':
        return 'success';
      case 'Medium':
        return 'warning';
      case 'High':
        return 'error';
      case 'Urgent':
        return 'error';
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
            primary={poNumber}
            primaryTypographyProps={{ typography: 'body2' }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={supplierName}
            primaryTypographyProps={{ typography: 'body2' }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={fDate(orderDate)}
            primaryTypographyProps={{ typography: 'body2' }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={fDate(expectedDelivery)}
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
          <Button
            size="small"
            variant="outlined"
            color={getPriorityColor(priority) as any}
            sx={{ textTransform: 'capitalize' }}
          >
            {priority}
          </Button>
        </TableCell>

        <TableCell>
          <ListItemText
            primary={fCurrency(total)}
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
