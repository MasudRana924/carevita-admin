import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';

import { API_URL, getErrorMessage } from 'src/lib/utils';
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
    const url = original?.url || '';
    const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/refresh-token');

    if (status === 401 && original && !original._retry && !isAuthEndpoint) {
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
        const nextAccess = data?.token || data?.data?.token || data?.accessToken;
        const nextRefresh = data?.refreshToken || data?.data?.refreshToken || refreshToken;

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

    if (status === 401 && isAuthEndpoint) {
      return Promise.reject(error);
    }

    if (status === 403 && window.location.pathname !== '/login') {
      error.message = getErrorMessage(error, 'You do not have permission to perform this action.');
    }

    return Promise.reject(error);
  }
);

export default apiClient;
