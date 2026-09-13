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

// ----------------------------------------------------------------------

export type SalesReportsTableRowProps = {
  id: string;
  month: string;
  year: number;
  totalOrders: number;
  totalRevenue: number;
  totalCost: number;
  grossProfit: number;
  netProfit: number;
  averageOrderValue: number;
  topSellingProduct: string;
  topCustomer: string;
  growthRate: string;
  generatedDate: string;
};

type Props = {
  row: SalesReportsTableRowProps;
  selected: boolean;
  onSelectRow: VoidFunction;
  onDeleteRow?: (id: string) => void;
};

export function SalesReportsTableRow({ row, selected, onSelectRow, onDeleteRow }: Props) {
  const router = useRouter();
  const confirm = usePopover();
  const popover = usePopover();

  const { month, year, totalOrders, totalRevenue, totalCost, grossProfit, netProfit, growthRate } = row;

  const handleViewRow = useCallback(() => {
    router.push(`/dashboard/sales-reports/${row.id}`);
  }, [router, row.id]);

  const handleEditRow = useCallback(() => {
    router.push(`/dashboard/sales-reports/${row.id}`);
  }, [router, row.id]);

  const handleDeleteRow = useCallback(() => {
    if (onDeleteRow) {
      onDeleteRow(row.id);
    }
    confirm.onClose();
  }, [onDeleteRow, row.id, confirm]);

  const getGrowthColor = (growthRate: string) => {
    const rate = parseFloat(growthRate);
    if (rate >= 0) {
      return 'success';
    }
    return 'error';
  };

  return (
    <>
      <TableRow selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox checked={selected} onClick={onSelectRow} />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={month}
            primaryTypographyProps={{ typography: 'body2' }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={year}
            primaryTypographyProps={{ typography: 'body2' }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={totalOrders.toLocaleString()}
            primaryTypographyProps={{ typography: 'body2' }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={fCurrency(totalRevenue)}
            primaryTypographyProps={{ typography: 'body2' }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={fCurrency(totalCost)}
            primaryTypographyProps={{ typography: 'body2' }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={fCurrency(grossProfit)}
            primaryTypographyProps={{ typography: 'body2' }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={fCurrency(netProfit)}
            primaryTypographyProps={{ typography: 'body2' }}
          />
        </TableCell>

        <TableCell>
          <Button
            size="small"
            variant="outlined"
            color={getGrowthColor(growthRate) as any}
            sx={{ textTransform: 'capitalize' }}
          >
            {parseFloat(growthRate) >= 0 ? '+' : ''}{growthRate}%
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
