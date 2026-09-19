import { apiGet, apiList, apiSend } from './http';

export const usersApi = {
  list: (params?: Record<string, string | number | boolean | undefined>) => apiList('/admin/users', params),
  updateStatus: (id: string, status: string) => apiSend('put', `/admin/users/${id}/status`, { status }),
  block: (id: string) => apiSend('put', `/admin/users/${id}/block`),
  unblock: (id: string) => apiSend('put', `/admin/users/${id}/unblock`),
};

export const caregiversApi = {
  list: (params?: Record<string, string | number | boolean | undefined>) => apiList('/admin/caregivers', params),
  block: (id: string) => apiSend('put', `/admin/caregivers/${id}/block`),
  unblock: (id: string) => apiSend('put', `/admin/caregivers/${id}/unblock`),
  getEkyc: (id: string) => apiGet(`/admin/caregivers/${id}/ekyc`),
  approveEkyc: (id: string, body?: { comment?: string }) =>
    apiSend('post', `/admin/caregivers/${id}/ekyc/approve`, body?.comment ? { comment: body.comment } : {}),
  declineEkyc: (id: string, body?: { comment?: string }) =>
    apiSend('post', `/admin/caregivers/${id}/ekyc/decline`, body?.comment ? { comment: body.comment } : {}),
};

export const dashboardApi = {
  get: () => apiGet<Record<string, unknown>>('/admin/dashboard'),
};

export const bookingsApi = {
  list: (params?: Record<string, string | number | boolean | undefined>) => apiList('/admin/bookings', params),
  get: (id: string) => apiGet(`/admin/bookings/${id}`),
  cancel: (id: string, reason: string) => apiSend('post', `/admin/bookings/${id}/cancel`, { reason }),
};

export const hospitalsApi = {
  list: (params?: Record<string, string | number | boolean | undefined>) => apiList('/admin/hospitals', params),
  create: (formData: FormData) => apiSend('post', '/admin/hospitals', formData),
  update: (id: string, formData: FormData) => apiSend('put', `/admin/hospitals/${id}`, formData),
  updateStatus: (id: string, is_active: boolean) =>
    apiSend('put', `/admin/hospitals/${id}/status`, { is_active }),
};

export const disputesApi = {
  list: (params?: Record<string, string | number | boolean | undefined>) => apiList('/admin/disputes', params),
  update: (id: string, body: Record<string, unknown>) => apiSend('patch', `/admin/disputes/${id}`, body),
};

export const withdrawalsApi = {
  list: (params?: Record<string, string | number | boolean | undefined>) => apiList('/admin/withdrawals', params),
  approve: (id: string, body?: Record<string, unknown>) =>
    apiSend('post', `/admin/withdrawals/${id}/approve`, body || {}),
  reject: (id: string, body?: Record<string, unknown>) =>
    apiSend('post', `/admin/withdrawals/${id}/reject`, body || {}),
};

export const auditLogsApi = {
  list: (params?: Record<string, string | number | boolean | undefined>) => apiList('/admin/audit-logs', params),
};

export const bkashApi = {
  refund: (body: Record<string, unknown>) => apiSend('post', '/payments/bkash/refund', body),
  refundStatus: (body: Record<string, unknown>) => apiSend('post', '/payments/bkash/refund/status', body),
};
