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

import { fDateTime } from 'src/utils/format-time';

import { Label } from 'src/components/label';
import { LucideIcon } from 'src/components/lucide-icons';

// ----------------------------------------------------------------------

export type UserTableRowProps = {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'USER' | 'CAREGIVER' | 'ADMIN';
  status: 'active' | 'blocked';
  is_verified: boolean;
  created_at: string;
  profile_photo: string | null;
};

type UserTableRowComponentProps = {
  row: UserTableRowProps;
  selected: boolean;
  onSelectRow: () => void;
  onBlockUser: (id: string) => void;
  onUnblockUser: (id: string) => void;
};

export function UserTableRow({ row, selected, onSelectRow, onBlockUser, onUnblockUser }: UserTableRowComponentProps) {
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleBlockUser = useCallback(() => {
    handleClosePopover();
    onBlockUser(row.id);
  }, [row.id, handleClosePopover, onBlockUser]);

  const handleUnblockUser = useCallback(() => {
    handleClosePopover();
    onUnblockUser(row.id);
  }, [row.id, handleClosePopover, onUnblockUser]);

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
              src={row.profile_photo || `https://api.dicebear.com/7.x/avataaars/svg?seed=${row.name}`}
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
                {row.email}
              </Typography>
            </Box>
          </Box>
        </TableCell>

        <TableCell>
          <Typography variant="body2">{row.phone}</Typography>
        </TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (row.role === 'ADMIN' && 'error') ||
              (row.role === 'CAREGIVER' && 'warning') ||
              'default'
            }
          >
            {row.role}
          </Label>
        </TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={row.status === 'active' ? 'success' : 'error'}
          >
            {row.status}
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
            width: 160,
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
          {row.status === 'active' ? (
            <MenuItem onClick={handleBlockUser} sx={{ color: 'error.main' }}>
              <LucideIcon icon="solar:shield-cross-bold" />
              Block User
            </MenuItem>
          ) : (
            <MenuItem onClick={handleUnblockUser} sx={{ color: 'success.main' }}>
              <LucideIcon icon="solar:shield-check-bold" />
              Unblock User
            </MenuItem>
          )}
        </MenuList>
      </Popover>
    </>
  );
}
