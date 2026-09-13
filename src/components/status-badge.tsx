import { Label } from 'src/components/label';

import type { LabelColor } from 'src/components/label';

const COLOR_MAP: Record<string, LabelColor> = {
  ACTIVE: 'success',
  INACTIVE: 'default',
  BANNED: 'error',
  PENDING: 'warning',
  PENDING_PAYMENT: 'warning',
  PAYMENT_PROCESSING: 'info',
  PAYMENT_PAID: 'success',
  PROCESSING: 'info',
  VERIFIED: 'success',
  APPROVED: 'success',
  REJECTED: 'error',
  COMPLETED: 'success',
  SERVICE_COMPLETED: 'success',
  CANCELLED: 'error',
  CANCELLED_BY_USER: 'error',
  CANCELLED_BY_PROVIDER: 'error',
  CANCELLED_BY_ADMIN: 'error',
  FAILED: 'error',
  RESOLVED: 'success',
  OPEN: 'warning',
  UNDER_REVIEW: 'info',
  SHIPPED: 'info',
  DELIVERED: 'success',
  PAID: 'success',
  REFUNDED: 'secondary',
  DISPUTED: 'error',
  SEARCHING_PROVIDER: 'info',
  PROVIDER_ASSIGNED: 'info',
  PROVIDER_ACCEPTED: 'success',
  PROVIDER_ON_THE_WAY: 'info',
  PATIENT_PICKED_UP: 'info',
  SERVICE_STARTED: 'info',
  SERVICE_IN_PROGRESS: 'info',
  REFUND_PENDING: 'warning',
  SUSPENDED: 'error',
  TRUE: 'success',
  FALSE: 'default',
  UNREAD: 'warning',
  READ: 'default',
};

export function statusColor(value?: string | boolean | null): LabelColor {
  if (typeof value === 'boolean') return value ? 'success' : 'default';
  if (!value) return 'default';
  return COLOR_MAP[String(value).toUpperCase().replace(/\s+/g, '_')] || 'default';
}

export function StatusBadge({
  value,
  label,
}: {
  value?: string | boolean | null;
  label?: string;
}) {
  const text =
    label ||
    (typeof value === 'boolean' ? (value ? 'Yes' : 'No') : value ? String(value).replace(/_/g, ' ') : '—');

  return (
    <Label color={statusColor(value)} variant="soft">
      {text}
    </Label>
  );
}
