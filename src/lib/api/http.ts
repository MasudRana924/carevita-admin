import apiClient from './client';

import { asList, getPagination, unwrapData, type PaginationMeta } from 'src/lib/utils';

export type QueryParams = Record<string, string | number | boolean | undefined | null>;

export function toQuery(params?: QueryParams) {
  const search = new URLSearchParams();
  if (!params) return '';
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      search.set(key, String(value));
    }
  });
  const qs = search.toString();
  return qs ? `?${qs}` : '';
}

export async function apiGet<T = unknown>(url: string, params?: QueryParams) {
  const response = await apiClient.get(`${url}${toQuery(params)}`);
  return unwrapData<T>(response.data).data;
}

export async function apiSend<T = unknown>(
  method: 'post' | 'put' | 'patch' | 'delete',
  url: string,
  body?: unknown
) {
  const response =
    method === 'delete'
      ? await apiClient.delete(url, body !== undefined ? { data: body } : undefined)
      : await apiClient[method](url, body);
  return unwrapData<T>(response.data).data;
}

export async function apiList<T = Record<string, unknown>>(url: string, params?: QueryParams): Promise<{
  items: T[];
  meta?: Record<string, unknown>;
  pagination: PaginationMeta;
  message?: string;
  raw: unknown;
}> {
  const response = await apiClient.get(`${url}${toQuery(params)}`);
  const unwrapped = unwrapData<T[] | Record<string, unknown>>(response.data);
  return {
    items: asList<T>(unwrapped.data),
    meta: unwrapped.meta,
    pagination: getPagination(unwrapped.meta),
    message: unwrapped.message,
    raw: response.data,
  };
}
