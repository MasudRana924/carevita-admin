import type { Food } from 'src/api/types';

import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { useRouter } from 'src/routes/hooks';

import { LucideIcon } from 'src/components/lucide-icons';
import { Label, labelClasses } from 'src/components/label';

// ----------------------------------------------------------------------

type Props = {
  selected: boolean;
  row: Food;
  onSelectRow: VoidFunction;
};

export function FoodTableRow({
  row,
  selected,
  onSelectRow,
}: Props) {
  const router = useRouter();
  const { name, price, category, available, image, createdAt } = row;

  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleEdit = useCallback(() => {
    handleClosePopover();
    router.push(`/dashboard/foods/${row._id}`);
  }, [router, row._id, handleClosePopover]);

  const handleDelete = useCallback(() => {
    handleClosePopover();
    // You can implement delete logic here
    console.log('Delete food:', row._id);
  }, [handleClosePopover, row._id]);

  return (
    <>
      <TableRow tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell component="th" scope="row">
          <Box
            sx={{
              gap: 2,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Avatar alt={name} src={image} />
            {name}
          </Box>
        </TableCell>

        <TableCell>${price}</TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (category === 'breakfast' && 'info') ||
              (category === 'lunch' && 'warning') ||
              (category === 'dinner' && 'error') ||
              'default'
            }
          >
            {category}
          </Label>
        </TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={available ? 'success' : 'error'}
            sx={{
              textTransform: 'capitalize',
            }}
          >
            {available ? 'Available' : 'Unavailable'}
          </Label>
        </TableCell>

        <TableCell>{new Date(createdAt).toLocaleDateString()}</TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
            <LucideIcon icon="solar:eye-bold" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
            },
          }}
        >
          <MenuItem onClick={handleEdit}>
            <LucideIcon icon="solar:pen-bold" />
            Edit
          </MenuItem>

          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <LucideIcon icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}
