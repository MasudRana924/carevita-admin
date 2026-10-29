import { useNavigate } from 'react-router-dom';

import Badge from '@mui/material/Badge';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

import { usePendingReviewCount } from 'src/sections/admin/caregivers/use-pending-review-count';
import { Iconify } from 'src/components/iconify';

export function PendingVerificationBadge() {
  const navigate = useNavigate();
  const { count } = usePendingReviewCount();

  return (
    <Tooltip title="Caregivers pending approval">
      <IconButton onClick={() => navigate('/caregivers?tab=pending')} aria-label="Caregivers pending approval">
        <Badge badgeContent={count} color="error" max={99}>
          <Iconify icon="solar:user-check-rounded-bold" width={20} />
        </Badge>
      </IconButton>
    </Tooltip>
  );
}
