import apiClient from './client';

import { unwrapData } from 'src/lib/utils';

export type LoginPayload = {
  phone?: string;
  email?: string;
  password: string;
};

export async function login(payload: LoginPayload) {
  const response = await apiClient.post('/auth/login', payload);
  const body = response.data || {};
  const nested = unwrapData<Record<string, unknown>>(body).data as Record<string, unknown> | undefined;
  const source = (nested && typeof nested === 'object' ? nested : body) as Record<string, unknown>;

  return {
    token: (source.token || source.accessToken || body.token) as string | undefined,
    refreshToken: (source.refreshToken || body.refreshToken) as string | undefined,
    user: (source.user || body.user) as Record<string, unknown> | undefined,
    raw: body,
  };
}

export async function refreshAccessToken(refreshToken: string) {
  const response = await apiClient.post('/auth/refresh-token', { refreshToken });
  const body = response.data || {};
  return {
    token: body.token || body.data?.token,
    refreshToken: body.refreshToken || body.data?.refreshToken,
    raw: body,
  };
}

export async function getProfile() {
  const response = await apiClient.get('/auth/profile');
  const body = response.data || {};
  return (body.user || unwrapData(body).data || body) as Record<string, unknown>;
}

export async function updateProfile(payload: Record<string, unknown>) {
  const response = await apiClient.put('/auth/profile', payload);
  const body = response.data || {};
  return (body.user || unwrapData(body).data || body) as Record<string, unknown>;
}

export async function updatePassword(payload: { currentPassword: string; newPassword: string }) {
  const response = await apiClient.put('/auth/password', payload);
  return unwrapData(response.data);
}

export async function uploadProfilePhoto(file: File) {
  const form = new FormData();
  form.append('photo', file);
  const response = await apiClient.post('/auth/profile/photo', form);
  return unwrapData(response.data);
}
