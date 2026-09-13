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

import { fDateTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { LucideIcon } from 'src/components/lucide-icons';

// ----------------------------------------------------------------------

export type HospitalTableRowProps = {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  city: string | null;
  district: string | null;
  type: string | null;
  is_active: boolean;
  is_verified: boolean;
  rating: string;
  photo: string | null;
  created_at: string;
};

type HospitalTableRowComponentProps = {
  row: HospitalTableRowProps;
  selected: boolean;
  onSelectRow: () => void;
  onUpdateStatus: (id: string, is_active: boolean) => void;
};

export function HospitalTableRow({ row, selected, onSelectRow, onUpdateStatus }: HospitalTableRowComponentProps) {
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
    router.push(`/hospitals/${row.id}`);
  }, [router, row.id, handleClosePopover]);

  const handleToggleStatus = useCallback(() => {
    handleClosePopover();
    onUpdateStatus(row.id, !row.is_active);
  }, [row.id, row.is_active, handleClosePopover, onUpdateStatus]);

  return (
    <>
      <TableRow hover tabIndex={-1} role="checkbox" selected={selected}>
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
              src={row.photo || `https://api.dicebear.com/7.x/identicon/svg?seed=${row.name}`}
              sx={{
                width: 48,
                height: 48,
                borderRadius: 1,
                objectFit: 'cover',
              }}
            />
            <Box>
              <Typography variant="subtitle2" noWrap>
                {row.name}
              </Typography>
              <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
                {row.email || row.phone}
              </Typography>
            </Box>
          </Box>
        </TableCell>

        <TableCell>
          <Typography variant="body2" noWrap>
            {row.address || '—'}
          </Typography>
        </TableCell>

        <TableCell>
          <Typography variant="body2">{row.district || '—'}</Typography>
        </TableCell>

        <TableCell>
          <Typography variant="body2">{row.type || '—'}</Typography>
        </TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={row.is_active ? 'success' : 'error'}
          >
            {row.is_active ? 'Active' : 'Inactive'}
          </Label>
        </TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={row.is_verified ? 'success' : 'default'}
          >
            {row.is_verified ? 'Verified' : 'Not Verified'}
          </Label>
        </TableCell>

        <TableCell>
          <Typography variant="body2">{row.rating || '0.00'}</Typography>
        </TableCell>

        <TableCell>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {fDateTime(row.created_at)}
          </Typography>
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

          <MenuItem onClick={handleToggleStatus} sx={{ color: row.is_active ? 'error.main' : 'success.main' }}>
            <LucideIcon icon={row.is_active ? 'solar:shield-cross-bold' : 'solar:shield-check-bold'} />
            {row.is_active ? 'Deactivate' : 'Activate'}
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}
