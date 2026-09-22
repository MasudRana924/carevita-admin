import { useEffect, useState } from 'react';

import Typography from '@mui/material/Typography';

import { fDateTime } from 'src/utils/format-time';

function formatRemaining(ms: number) {
  if (ms <= 0) return 'Expired';
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}m ${String(seconds).padStart(2, '0')}s`;
}

/** Live countdown for caregiver offer acceptance window. */
export function OfferExpiryText({
  expiresAt,
  timeoutMinutes,
}: {
  expiresAt?: string | null;
  timeoutMinutes?: number | null;
}) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!expiresAt) return undefined;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [expiresAt]);

  if (!expiresAt) return null;

  const expiresMs = new Date(expiresAt).getTime();
  if (Number.isNaN(expiresMs)) return null;

  const remaining = expiresMs - now;
  const expired = remaining <= 0;

  return (
    <Typography variant="body2" color={expired ? 'error.main' : 'warning.main'}>
      Offer expires at {fDateTime(expiresAt)}
      {timeoutMinutes != null ? ` (${timeoutMinutes} min)` : ''}
      {' · '}
      {formatRemaining(remaining)}
    </Typography>
  );
}
