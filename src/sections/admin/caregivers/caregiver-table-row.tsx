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
import { LucideIcon } from 'src/components/lucide-icons';

// ----------------------------------------------------------------------

export type CaregiverTableRowProps = {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone: string;
  bio: string;
  experience_years: number;
  service_areas: string[];
  hourly_rate: string;
  education: string;
  blood_group: string;
  gender: 'male' | 'female' | 'other';
  district: string;
  thana: string;
  verification_status: 'PENDING' | 'APPROVED' | 'SUSPENDED';
  verification_note: string | null;
  rating: string;
  completed_bookings: number;
  is_available: boolean;
  ekyc_status: boolean;
  ekyc_session_status?: string | null;
  ekyc_verified_at?: string | null;
  ekyc_reference_id?: string | null;
  user_ekyc_status?: boolean;
  user_ekyc_session_status?: string | null;
  user_ekyc_verified_at?: string | null;
  user_ekyc_reference_id?: string | null;
  profile_photo: string | null;
  created_at: string;
};

type CaregiverTableRowComponentProps = {
  row: CaregiverTableRowProps;
  selected: boolean;
  onSelectRow: () => void;
  onBlockCaregiver: (id: string) => void;
  onUnblockCaregiver: (id: string) => void;
};

function getEkycSessionStatus(row: CaregiverTableRowProps) {
  return row.user_ekyc_session_status || row.ekyc_session_status || '';
}

export function CaregiverTableRow({
  row,
  selected,
  onSelectRow,
  onBlockCaregiver,
  onUnblockCaregiver,
}: CaregiverTableRowComponentProps) {
  const navigate = useNavigate();
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);
  const ekycSessionStatus = getEkycSessionStatus(row);
  const needsReview = ekycSessionStatus === 'In Review';

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

  const handleReviewEkyc = useCallback(() => {
    handleClosePopover();
    navigate(`/caregivers/${row.id}/ekyc`);
  }, [handleClosePopover, navigate, row.id]);

  return (
    <>
      <TableRow
        hover
        tabIndex={-1}
        role="checkbox"
        selected={selected}
        onDoubleClick={() => navigate(`/caregivers/${row.id}/ekyc`)}
        sx={{ cursor: 'pointer' }}
      >
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
          <Typography variant="body2">{row.district}</Typography>
        </TableCell>

        <TableCell>
          <Typography variant="body2">{row.experience_years} years</Typography>
        </TableCell>

        <TableCell>
          <Typography variant="body2">৳{row.hourly_rate}/hr</Typography>
        </TableCell>

        <TableCell>
          <Label
            variant="soft"
            color={
              (row.verification_status === 'APPROVED' && 'success') ||
              (row.verification_status === 'PENDING' && 'warning') ||
              'error'
            }
          >
            {row.verification_status}
          </Label>
        </TableCell>

        <TableCell>
          <StatusBadge value={ekycSessionStatus || (row.user_ekyc_status || row.ekyc_status ? 'Approved' : '—')} />
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
            width: 180,
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
          <MenuItem onClick={handleReviewEkyc} sx={{ color: needsReview ? 'warning.main' : 'inherit' }}>
            <LucideIcon icon="solar:shield-check-bold" />
            {needsReview ? 'Review eKYC' : 'View eKYC'}
          </MenuItem>

          {row.verification_status === 'SUSPENDED' ? (
            <MenuItem onClick={handleUnblockCaregiver} sx={{ color: 'success.main' }}>
              <LucideIcon icon="solar:shield-check-bold" />
              Unblock Caregiver
            </MenuItem>
          ) : (
            <MenuItem onClick={handleBlockCaregiver} sx={{ color: 'error.main' }}>
              <LucideIcon icon="solar:shield-cross-bold" />
              Block Caregiver
            </MenuItem>
          )}
        </MenuList>
      </Popover>
    </>
  );
}
