import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { useRouter } from 'src/routes/hooks';

import { fCurrency } from 'src/utils/format-number';

import { Label } from 'src/components/label';
import { LucideIcon } from 'src/components/lucide-icons';
import { ColorPreview } from 'src/components/color-utils';

// ----------------------------------------------------------------------

export type ProductTableRowProps = {
  id: string;
  name: string;
  price: number;
  status: string;
  coverUrl: string;
  colors: string[];
  priceSale: number | null;
};

type ProductTableRowComponentProps = {
  row: ProductTableRowProps;
  selected: boolean;
  onSelectRow: () => void;
};

export function ProductTableRow({ row, selected, onSelectRow }: ProductTableRowComponentProps) {
  const router = useRouter();
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleEdit = useCallback(() => {
    handleClosePopover();
    router.push(`/dashboard/products/${row.id}`);
  }, [router, row.id, handleClosePopover]);

  const handleDelete = useCallback(() => {
    handleClosePopover();
    // Handle delete logic here
    console.log('Delete product:', row.id);
  }, [row.id, handleClosePopover]);

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
            <Box
              component="img"
              alt={row.name}
              src={row.coverUrl}
              sx={{
                width: 48,
                height: 48,
                borderRadius: 1,
                objectFit: 'cover',
              }}
            />
            {row.name}
          </Box>
        </TableCell>

        <TableCell>
          <ColorPreview colors={row.colors} />
        </TableCell>

        <TableCell>
          <Typography variant="subtitle2">
            {row.priceSale && (
              <Typography
                component="span"
                variant="body2"
                sx={{
                  color: 'text.disabled',
                  textDecoration: 'line-through',
                  mr: 1,
                }}
              >
                {fCurrency(row.priceSale)}
              </Typography>
            )}
            {fCurrency(row.price)}
          </Typography>
        </TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={(row.status === 'sale' && 'error') || (row.status === 'new' && 'info') || 'default'}
          >
            {row.status || 'Regular'}
          </Label>
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
            <LucideIcon icon="eva:more-vertical-fill" />
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
