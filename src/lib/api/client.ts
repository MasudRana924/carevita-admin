import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

import { API_URL, getErrorMessage, isAuthErrorCode, unwrapData } from 'src/lib/utils';
import { clearSession, getAccessToken, getRefreshToken, setSession } from 'src/lib/auth/storage';

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

let isRefreshing = false;
let pendingQueue: Array<(token: string | null) => void> = [];

function flushQueue(token: string | null) {
  pendingQueue.forEach((resolve) => resolve(token));
  pendingQueue = [];
}

export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (config.data instanceof FormData) {
    delete config.headers['Content-Type'];
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetryConfig | undefined;
    const status = error.response?.status;
    const envelopeCode = unwrapData(error.response?.data).code;
    const rawCode = (error.response?.data as { code?: string } | undefined)?.code;
    const url = original?.url || '';
    const isAuthEndpoint =
      url.includes('/auth/login') ||
      url.includes('/auth/refresh-token') ||
      url.includes('/auth/logout');
    const shouldRefresh =
      status === 401 || isAuthErrorCode(envelopeCode) || isAuthErrorCode(rawCode);

    if (shouldRefresh && original && !original._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          pendingQueue.push((token) => {
            if (!token) {
              reject(error);
              return;
            }
            original.headers.Authorization = `Bearer ${token}`;
            resolve(apiClient(original));
          });
        });
      }

      original._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = getRefreshToken();
        if (!refreshToken) {
          throw new Error('No refresh token');
        }

        const { data } = await axios.post(`${API_URL}/auth/refresh-token`, { refreshToken });
        const payload = unwrapData<Record<string, unknown>>(data).data || {};
        const source = (payload && typeof payload === 'object' ? payload : data) as Record<string, unknown>;
        const nextAccess = (source.token || source.accessToken || data?.token) as string | undefined;
        const nextRefresh = (source.refreshToken || data?.refreshToken || refreshToken) as string;

        if (!nextAccess) {
          throw new Error('No access token');
        }

        setSession({ accessToken: nextAccess, refreshToken: nextRefresh });
        flushQueue(nextAccess);
        original.headers.Authorization = `Bearer ${nextAccess}`;
        return apiClient(original);
      } catch {
        flushQueue(null);
        clearSession();
        if (window.location.pathname !== '/login') {
          window.location.assign('/login');
        }
        return Promise.reject(error);
      } finally {
        isRefreshing = false;
      }
    }

    if (shouldRefresh && isAuthEndpoint) {
      return Promise.reject(error);
    }

    if (status === 403 && window.location.pathname !== '/login') {
      error.message = getErrorMessage(error, 'You do not have permission to perform this action.');
    }

    return Promise.reject(error);
  }
);

export default apiClient;
