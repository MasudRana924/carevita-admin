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

export type EmployeesTableRowProps = {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  hireDate: string;
  salary: number;
  status: string;
  manager: string | null;
  avatarUrl: string;
};

type Props = {
  row: EmployeesTableRowProps;
  selected: boolean;
  onSelectRow: VoidFunction;
};

export function EmployeesTableRow({ row, selected, onSelectRow }: Props) {
  const router = useRouter();
  const confirm = usePopover();
  const popover = usePopover();

  const { name, employeeId, email, phone, department, position, salary, status, manager, avatarUrl } = row;

  const handleViewRow = useCallback(() => {
    router.push(`/dashboard/employees/${row.id}`);
  }, [router, row.id]);

  const handleEditRow = useCallback(() => {
    router.push(`/dashboard/employees/${row.id}`);
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
      case 'On Leave':
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

        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>
          <Avatar alt={name} src={avatarUrl} sx={{ mr: 2, width: 48, height: 48 }} />
          <ListItemText
            primary={name}
            primaryTypographyProps={{ typography: 'body2' }}
            secondary={manager}
            secondaryTypographyProps={{ component: 'span', color: 'text.disabled' }}
          />
        </TableCell>

        <TableCell sx={{ minWidth: 150 }}>
          <ListItemText
            primary={employeeId}
            primaryTypographyProps={{ typography: 'body2' }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={department}
            primaryTypographyProps={{ typography: 'body2' }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={position}
            primaryTypographyProps={{ typography: 'body2' }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={email}
            primaryTypographyProps={{ typography: 'body2' }}
            secondary={phone}
            secondaryTypographyProps={{ component: 'span', color: 'text.disabled' }}
          />
        </TableCell>

        <TableCell>
          <ListItemText
            primary={fCurrency(salary)}
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
