export const API_URL =
  import.meta.env.NEXT_PUBLIC_API_URL || import.meta.env.VITE_API_URL || '';

export function getErrorMessage(error: unknown, fallback = 'Something went wrong. Please try again.') {
  if (!error) return fallback;

  if (typeof error === 'string') return error;

  const anyError = error as {
    message?: string;
    response?: { data?: { message?: string; error?: string; errors?: Array<{ msg?: string; message?: string }> } };
  };

  const data = anyError.response?.data;
  if (data?.message) return data.message;
  if (data?.error) return data.error;
  if (Array.isArray(data?.errors) && data.errors[0]) {
    return data.errors[0].msg || data.errors[0].message || fallback;
  }
  if (anyError.message && !anyError.message.startsWith('Request failed')) {
    return anyError.message;
  }

  return fallback;
}

export function unwrapData<T = unknown>(payload: unknown): { data: T; meta?: Record<string, unknown>; message?: string } {
  if (payload == null) {
    return { data: payload as T };
  }

  if (Array.isArray(payload)) {
    return { data: payload as T };
  }

  if (typeof payload !== 'object') {
    return { data: payload as T };
  }

  const body = payload as Record<string, unknown>;

  if ('data' in body) {
    return {
      data: body.data as T,
      meta: (body.meta as Record<string, unknown>) || undefined,
      message: typeof body.message === 'string' ? body.message : undefined,
    };
  }

  return {
    data: payload as T,
    message: typeof body.message === 'string' ? body.message : undefined,
  };
}

const LIST_KEYS = [
  'users',
  'providers',
  'nurses',
  'caregivers',
  'doctors',
  'bookings',
  'payments',
  'orders',
  'hospitals',
  'medicines',
  'disputes',
  'withdrawals',
  'tickets',
  'reviews',
  'notifications',
  'documents',
  'emergencies',
  'items',
  'results',
  'rows',
  'records',
];

export function asList<T = Record<string, unknown>>(payload: unknown): T[] {
  const { data } = unwrapData(payload);

  if (Array.isArray(data)) return data as T[];
  if (!data || typeof data !== 'object') return [];

  const obj = data as Record<string, unknown>;
  for (const key of LIST_KEYS) {
    if (Array.isArray(obj[key])) return obj[key] as T[];
  }

  return [];
}

export function pickString(record: Record<string, unknown> | null | undefined, keys: string[], fallback = '—') {
  if (!record) return fallback;
  for (const key of keys) {
    const value = record[key];
    if (value !== undefined && value !== null && value !== '') {
      return String(value);
    }
  }
  return fallback;
}

export function pickNumber(record: Record<string, unknown> | null | undefined, keys: string[]) {
  if (!record) return undefined;
  for (const key of keys) {
    const value = record[key];
    if (typeof value === 'number' && !Number.isNaN(value)) return value;
    if (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value))) {
      return Number(value);
    }
  }
  return undefined;
}

export function getRecordId(record: Record<string, unknown> | null | undefined) {
  return pickString(record, ['id', '_id', 'uuid', 'user_id'], '');
}

export function isAdminRole(role?: string | null) {
  if (!role) return false;
  return role.toUpperCase() === 'ADMIN' || role.toUpperCase() === 'SUPER_ADMIN';
}
