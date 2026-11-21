import Typography from '@mui/material/Typography';

import { Label } from 'src/components/label';

import type { PayoutStatus } from 'src/api/admin-types';

import { PAYOUT_STATUS_META } from './payment-utils';

export function PayoutStatusBadge({ status }: { status?: PayoutStatus | null }) {
  const meta = status ? PAYOUT_STATUS_META[status] : undefined;

  if (!meta) {
    return (
      <Typography variant="body2" sx={{ color: 'text.disabled' }}>
        —
      </Typography>
    );
  }

  return (
    <Label variant="soft" color={meta.color}>
      {meta.label}
    </Label>
  );
}
