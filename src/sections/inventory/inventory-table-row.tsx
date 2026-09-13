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

export type InventoryTableRowProps = {
  id: string;
  sku: string;
  name: string;
  category: string;
  quantity: number;
  minQuantity: number;
  maxQuantity: number;
  unitPrice: number;
  totalValue: number;
  location: string;
  supplier: string;
  lastUpdated: string;
  status: string;
  image: string;
};

type Props = {
  row: InventoryTableRowProps;
  selected: boolean;
  onSelectRow: VoidFunction;
};

export function InventoryTableRow({ row, selected, onSelectRow }: Props) {
  const router = useRouter();
  const confirm = usePopover();
  const popover = usePopover();

  const { name, sku, category, quantity, minQuantity, maxQuantity, unitPrice, totalValue, location, supplier, lastUpdated, status, image } = row;

  const handleViewRow = useCallback(() => {
    router.push(`/dashboard/inventory/${row.id}`);
  }, [router, row.id]);

  const handleEditRow = useCallback(() => {
    router.push(`/dashboard/inventory/${row.id}/edit`);
  }, [router, row.id]);

  const handleDeleteRow = useCallback(() => {
    console.info('DELETE', row.id);
    confirm.onClose();
  }, [row.id, confirm]);

  const getStatusColor = (statusValue: string) => {
    switch (statusValue) {
      case 'In Stock':
        return 'success';
      case 'Low Stock':
        return 'warning';
      case 'Out of Stock':
        return 'error';
      case 'Discontinued':
        return 'default';
      default:
        return 'default';
    }
  };

  const getQuantityColor = (quantityValue: number, minQuantityValue: number) => {
    if (quantityValue <= minQuantityValue) return 'error';
    if (quantityValue <= minQuantityValue * 2) return 'warning';
    return 'success';
  };

  return (
    <>
      <TableRow selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell sx={{ minWidth: 120 }}>
          <ListItemText
            primary={sku}
            primaryTypographyProps={{ typography: 'body2' }}
          />
        </TableCell>

        <TableCell sx={{ display: 'flex', alignItems: 'center', minWidth: 200 }}>
          <Avatar alt={name} src={image} sx={{ mr: 2, width: 48, height: 48 }} />
          <ListItemText
            primary={name}
            primaryTypographyProps={{ typography: 'body2' }}
            secondary={supplier}
            secondaryTypographyProps={{ component: 'span', color: 'text.disabled' }}
          />
        </TableCell>

        <TableCell sx={{ minWidth: 150 }}>
          <ListItemText
            primary={category}
            primaryTypographyProps={{ typography: 'body2' }}
          />
        </TableCell>

        <TableCell sx={{ minWidth: 140 }}>
          <ListItemText
            primary={quantity}
            primaryTypographyProps={{ 
              typography: 'body2',
              color: getQuantityColor(quantity, minQuantity)
            }}
            secondary={`Min: ${minQuantity} | Max: ${maxQuantity}`}
            secondaryTypographyProps={{ component: 'span', color: 'text.disabled' }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={fCurrency(unitPrice)}
            primaryTypographyProps={{ typography: 'body2' }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={fCurrency(totalValue)}
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
