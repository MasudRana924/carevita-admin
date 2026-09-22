import apiClient from './client';

import { unwrapData } from 'src/lib/utils';

export type LoginPayload = {
  email: string;
  password: string;
};

export async function login(payload: LoginPayload) {
  const response = await apiClient.post('/auth/login', payload);
  const body = response.data || {};
  const nested = unwrapData<Record<string, unknown>>(body).data;
  const source = (nested && typeof nested === 'object' ? nested : body) as Record<string, unknown>;

  return {
    token: (source.token || source.accessToken) as string | undefined,
    refreshToken: (source.refreshToken || body.refreshToken) as string | undefined,
    user: (source.user || body.user) as Record<string, unknown> | undefined,
    raw: body,
  };
}

export async function refreshAccessToken(refreshToken: string) {
  const response = await apiClient.post('/auth/refresh-token', { refreshToken });
  const nested = unwrapData<Record<string, unknown>>(response.data).data || {};
  const source = (nested && typeof nested === 'object' ? nested : response.data || {}) as Record<string, unknown>;
  return {
    token: (source.token || source.accessToken) as string | undefined,
    refreshToken: (source.refreshToken as string | undefined) || refreshToken,
    raw: response.data,
  };
}

export async function getProfile() {
  const response = await apiClient.get('/admin/profile');
  return unwrapData<Record<string, unknown>>(response.data).data;
}

export async function updateProfile(payload: Record<string, unknown>) {
  const response = await apiClient.put('/auth/profile', payload);
  return unwrapData<Record<string, unknown>>(response.data).data;
}

export async function updatePassword(payload: { currentPassword: string; newPassword: string }) {
  const response = await apiClient.put('/auth/password', payload);
  return unwrapData(response.data).data;
}

export async function logout(refreshToken?: string | null) {
  if (!refreshToken) return;
  try {
    await apiClient.post('/auth/logout', { refreshToken });
  } catch {
    // Local session is cleared regardless; ignore network/logout failures.
  }
}
