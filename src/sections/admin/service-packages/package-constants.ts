export const SERVICE_TYPES = [
  { value: 'HOME_CARE', label: 'Home Care' },
  { value: 'HOSPITAL_ASSISTANCE', label: 'Outdoor Assistance' },
] as const;

export const HOME_PACKAGE_CODES = [
  { code: 'HOME_6', hours: 6, label: 'Home Care 6 Hours' },
  { code: 'HOME_12', hours: 12, label: 'Home Care 12 Hours' },
  { code: 'HOME_24', hours: 24, label: 'Home Care 24 Hours' },
] as const;

export const OUTDOOR_PACKAGE_CODES = [
  { code: 'OUTDOOR_2', hours: 2, label: 'Outdoor Assistance 2 Hours' },
  { code: 'OUTDOOR_4', hours: 4, label: 'Outdoor Assistance 4 Hours' },
  { code: 'OUTDOOR_6', hours: 6, label: 'Outdoor Assistance 6 Hours' },
  { code: 'OUTDOOR_8', hours: 8, label: 'Outdoor Assistance 8 Hours' },
  { code: 'OUTDOOR_12', hours: 12, label: 'Outdoor Assistance 12 Hours' },
] as const;

export const OUTDOOR_PURPOSES = [
  { value: 'HOSPITAL', label: 'Hospital' },
  { value: 'LAB_DIAGNOSTIC', label: 'Lab / Diagnostic' },
  { value: 'PHARMACY', label: 'Pharmacy' },
  { value: 'DOCTOR_CHAMBER', label: 'Doctor chamber' },
] as const;

export type ServicePackageTab = 'ALL' | 'HOME_CARE' | 'HOSPITAL_ASSISTANCE';

export function formatServiceType(value: string) {
  if (value === 'HOME_CARE') return 'Home Care';
  if (value === 'HOSPITAL_ASSISTANCE') return 'Outdoor Assistance';
  return value.replace(/_/g, ' ');
}

export function formatMoney(value: unknown) {
  if (value === undefined || value === null || value === '') return '—';
  const amount = Number(value);
  if (Number.isNaN(amount)) return String(value);
  return `৳${amount.toLocaleString()}`;
}
