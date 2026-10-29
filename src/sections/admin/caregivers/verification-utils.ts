import type { NavigateFunction } from 'react-router-dom';

import { getErrorCode, getErrorMessage } from 'src/lib/utils';
import { fDateTime } from 'src/utils/format-time';

import type { CaregiverOnboardingStep } from 'src/api/admin-types';

/** Root key for every caregiver list query; invalidating it also refreshes the pending-review count. */
export const CAREGIVERS_QUERY_KEY = ['admin-caregivers'] as const;
export const PENDING_REVIEW_COUNT_QUERY_KEY = [...CAREGIVERS_QUERY_KEY, 'pending-review-count'] as const;

export const caregiverVerificationQueryKey = (id: string) => ['admin-caregiver-verification', id] as const;
export const caregiverReviewHistoryQueryKey = (id: string) => ['admin-caregiver-review-history', id] as const;

export const REVIEW_AUDIT_ACTIONS = [
  'CAREGIVER_APPROVED',
  'CAREGIVER_REJECTED',
  'CAREGIVER_DOCUMENTS_UPLOADED',
] as const;

export const REJECT_REASON_PRESETS = [
  'NID image is blurry',
  'NID back side missing',
  'Certificate not readable',
  'Name mismatch',
];

const DOCUMENT_LABELS: Record<string, string> = {
  family_nid_front: 'Family member NID (front)',
  family_nid_back: 'Family member NID (back)',
  academic_certificate: 'Academic certificate',
  academic_certificates: 'Academic certificates',
  professional_certificate: 'Professional certificate',
  professional_certificates: 'Professional certificates',
};

export function documentTypeLabel(type: string) {
  return DOCUMENT_LABELS[type] || type.replace(/_/g, ' ').replace(/^\w/, (char) => char.toUpperCase());
}

const ONBOARDING_STEP_LABELS: Record<CaregiverOnboardingStep, string> = {
  DOCUMENTS: 'Uploading documents',
  PROFILE: 'Completing profile',
  EKYC: 'Didit eKYC',
  PENDING_ADMIN_APPROVAL: 'Awaiting admin approval',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  SUSPENDED: 'Suspended',
};

export function onboardingStepLabel(step?: string | null) {
  if (!step) return '—';
  return ONBOARDING_STEP_LABELS[step as CaregiverOnboardingStep] || step.replace(/_/g, ' ');
}

export function formatBytes(bytes?: number | null) {
  if (!bytes || bytes <= 0) return '—';
  const units = ['B', 'KB', 'MB', 'GB'];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** index;
  return `${value >= 10 || index === 0 ? Math.round(value) : value.toFixed(1)} ${units[index]}`;
}

/** Goes back within the app when there is in-app history (react-router's `idx`), otherwise to `fallback`. */
export function navigateBack(navigate: NavigateFunction, fallback: string) {
  if ((window.history.state?.idx ?? 0) > 0) navigate(-1);
  else navigate(fallback);
}

export function fDateTimeOrDash(value?: string | null) {
  return value ? fDateTime(value) : '—';
}

export function getDiditSessionStatus(row: {
  user_ekyc_session_status?: string | null;
  ekyc_session_status?: string | null;
  user_ekyc_status?: boolean;
  ekyc_status?: boolean;
}) {
  const session = row.user_ekyc_session_status || row.ekyc_session_status;
  if (session) return session;
  return row.user_ekyc_status || row.ekyc_status ? 'Approved' : 'Not Started';
}

/** Maps approve/reject API errors (EKYC_REQUIRED, DOCUMENTS_REQUIRED, 409) to reviewer-friendly text. */
export function getVerificationActionError(error: unknown) {
  const response = (error as { response?: { status?: number; data?: { errors?: Array<{ field?: string }> } } })
    ?.response;
  const code = getErrorCode(error);

  if (code === 'EKYC_REQUIRED') {
    return 'Didit identity verification is not approved yet. Approve or wait for the eKYC session first.';
  }

  if (code === 'DOCUMENTS_REQUIRED') {
    const missing = (response?.data?.errors || [])
      .map((item) => item.field)
      .filter((field): field is string => Boolean(field))
      .map(documentTypeLabel);
    return missing.length
      ? `Required documents are missing: ${missing.join(', ')}.`
      : 'Required documents are missing.';
  }

  if (response?.status === 409) {
    return getErrorMessage(error, 'This caregiver is already approved or suspended.');
  }

  return getErrorMessage(error);
}
