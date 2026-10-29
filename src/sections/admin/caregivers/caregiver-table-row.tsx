import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

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
import { StatusBadge } from 'src/components/status-badge';
import { Iconify } from 'src/components/iconify';

import type { Caregiver } from 'src/api/admin-types';

import { fDateTimeOrDash, getDiditSessionStatus } from './verification-utils';

// ----------------------------------------------------------------------

export type CaregiverTableRowProps = Caregiver;

type CaregiverTableRowComponentProps = {
  row: CaregiverTableRowProps;
  selected: boolean;
  onSelectRow: () => void;
  onBlockCaregiver: (id: string) => void;
  onUnblockCaregiver: (id: string) => void;
};

export function CaregiverTableRow({
  row,
  selected,
  onSelectRow,
  onBlockCaregiver,
  onUnblockCaregiver,
}: CaregiverTableRowComponentProps) {
  const navigate = useNavigate();
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const ekycSessionStatus = getDiditSessionStatus(row);
  const needsReview = ekycSessionStatus === 'In Review';
  const verificationPath = `/caregivers/${row.id}/verification`;

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleBlockCaregiver = useCallback(() => {
    handleClosePopover();
    onBlockCaregiver(row.id);
  }, [row.id, handleClosePopover, onBlockCaregiver]);

  const handleUnblockCaregiver = useCallback(() => {
    handleClosePopover();
    onUnblockCaregiver(row.id);
  }, [row.id, handleClosePopover, onUnblockCaregiver]);

  const handleReviewVerification = useCallback(() => {
    handleClosePopover();
    navigate(verificationPath);
  }, [handleClosePopover, navigate, verificationPath]);

  const handleReviewEkyc = useCallback(() => {
    handleClosePopover();
    navigate(`/caregivers/${row.id}/ekyc`);
  }, [handleClosePopover, navigate, row.id]);

  const handleReviewCredentials = useCallback(() => {
    handleClosePopover();
    navigate(`/caregivers/${row.id}/ekyc#credentials`);
  }, [handleClosePopover, navigate, row.id]);

  return (
    <>
      <TableRow
        hover
        tabIndex={-1}
        role="checkbox"
        selected={selected}
        onClick={() => navigate(verificationPath)}
        sx={{ cursor: 'pointer' }}
      >
        <TableCell padding="checkbox" onClick={(event) => event.stopPropagation()}>
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

        <TableCell component="th" scope="row">
          <Box
            sx={{
              gap: 1,
              display: 'flex',
              flexDirection: 'column',
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
                borderRadius: '50%',
                objectFit: 'cover',
              }}
            />
            <Box sx={{ textAlign: 'center' }}>
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
          <Typography variant="body2">{row.district}</Typography>
        </TableCell>

        <TableCell>
          <Typography variant="body2">{row.experience_years} years</Typography>
        </TableCell>

        <TableCell>
          <Typography variant="body2">৳{row.hourly_rate}/hr</Typography>
        </TableCell>

        <TableCell>
          <StatusBadge value={row.verification_status} />
        </TableCell>

        <TableCell>
          <StatusBadge value={ekycSessionStatus} />
        </TableCell>

        <TableCell>
          <Typography variant="body2">{row.documents_count ?? 0}</Typography>
        </TableCell>

        <TableCell>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {fDateTimeOrDash(row.documents_submitted_at)}
          </Typography>
        </TableCell>

        <TableCell>
          <Label variant="soft" color={row.is_available ? 'success' : 'default'}>
            {row.is_available ? 'Available' : 'Unavailable'}
          </Label>
        </TableCell>

        <TableCell>
          <Typography variant="body2">{row.rating || '0.00'}</Typography>
        </TableCell>

        <TableCell>
          <Typography variant="body2">{row.completed_bookings}</Typography>
        </TableCell>

        <TableCell>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {fDateTime(row.created_at)}
          </Typography>
        </TableCell>

        <TableCell align="right" onClick={(event) => event.stopPropagation()}>
          <IconButton onClick={handleOpenPopover}>
            <Iconify icon="solar:menu-dots-vertical-bold" />
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
            width: 200,
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
          <MenuItem onClick={handleReviewVerification}>
            <Iconify icon="solar:check-circle-bold" />
            Review verification
          </MenuItem>

          <MenuItem onClick={handleReviewEkyc} sx={{ color: needsReview ? 'warning.main' : 'inherit' }}>
            <Iconify icon="solar:shield-check-bold" />
            {needsReview ? 'Review eKYC' : 'View eKYC'}
          </MenuItem>

          <MenuItem onClick={handleReviewCredentials}>
            <Iconify icon="solar:document-text-bold" />
            Credentials
          </MenuItem>

          {row.verification_status === 'SUSPENDED' ? (
            <MenuItem onClick={handleUnblockCaregiver} sx={{ color: 'success.main' }}>
              <Iconify icon="solar:shield-check-bold" />
              Unblock Caregiver
            </MenuItem>
          ) : (
            <MenuItem onClick={handleBlockCaregiver} sx={{ color: 'error.main' }}>
              <Iconify icon="solar:shield-cross-bold" />
              Block Caregiver
            </MenuItem>
          )}
        </MenuList>
      </Popover>
    </>
  );
}
