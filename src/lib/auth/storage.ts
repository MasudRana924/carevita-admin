export const ACCESS_TOKEN_KEY = 'caremate_access_token';
export const REFRESH_TOKEN_KEY = 'caremate_refresh_token';
export const USER_KEY = 'caremate_user';

export type StoredUser = {
  id: string;
  email?: string;
  phone?: string;
  name?: string;
  role?: string;
  profile_photo?: string;
  status?: string;
  is_verified?: boolean;
  ekyc_status?: boolean | string;
};

export function getAccessToken() {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getRefreshToken() {
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function getStoredUser(): StoredUser | null {
  const raw = localStorage.getItem(USER_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as StoredUser;
  } catch {
    return null;
  }
}

export function setSession(params: {
  accessToken?: string | null;
  refreshToken?: string | null;
  user?: StoredUser | null;
}) {
  if (params.accessToken) {
    localStorage.setItem(ACCESS_TOKEN_KEY, params.accessToken);
  }
  if (params.refreshToken) {
    localStorage.setItem(REFRESH_TOKEN_KEY, params.refreshToken);
  }
  if (params.user) {
    localStorage.setItem(USER_KEY, JSON.stringify(params.user));
  }
}

export function clearSession() {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  localStorage.removeItem('authToken');
  localStorage.removeItem('userData');
}
