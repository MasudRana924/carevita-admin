import { apiGet, apiList, apiSend } from './http';

export const usersApi = {
  list: (params?: Record<string, string | number | boolean | undefined>) => apiList('/admin/users', params),
  update: (id: string, body: Record<string, unknown>) => apiSend('put', `/admin/users/${id}`, body),
  updateStatus: (id: string, status: string) => apiSend('put', `/admin/users/${id}/status`, { status }),
  remove: (id: string) => apiSend('delete', `/admin/users/${id}`),
};

export const providersApi = {
  list: (params?: Record<string, string | number | boolean | undefined>) => apiList('/admin/providers', params),
  verify: (id: string, body: Record<string, unknown>) => apiSend('put', `/admin/providers/${id}/verify`, body),
};

export const nursesApi = {
  list: (params?: Record<string, string | number | boolean | undefined>) => apiList('/admin/nurses', params),
  get: (id: string) => apiGet(`/nurse/${id}`),
  search: (params?: Record<string, string | number | boolean | undefined>) => apiList('/nurse/search', params),
};

export const caregiversApi = {
  search: (params?: Record<string, string | number | boolean | undefined>) => apiList('/caregiver/search', params),
  get: (id: string) => apiGet(`/caregiver/${id}`),
};

export const doctorsApi = {
  search: (params?: Record<string, string | number | boolean | undefined>) => apiList('/doctor/search', params),
  get: (id: string) => apiGet(`/doctor/${id}`),
  appointments: (params?: Record<string, string | number | boolean | undefined>) =>
    apiList('/doctor/appointments', params),
  updateAppointmentStatus: (id: string, body: Record<string, unknown>) =>
    apiSend('put', `/doctor/appointments/${id}/status`, body),
};

export const dashboardApi = {
  get: () => apiGet<Record<string, unknown>>('/admin/dashboard'),
};

export const bookingsApi = {
  list: (params?: Record<string, string | number | boolean | undefined>) => apiList('/admin/bookings', params),
  get: (id: string) => apiGet(`/bookings/${id}`),
};

export const documentsApi = {
  pending: (params?: Record<string, string | number | boolean | undefined>) =>
    apiList('/admin/documents/pending', params),
  verify: (id: string, body: Record<string, unknown>) => apiSend('put', `/admin/documents/${id}/verify`, body),
};

export const paymentsApi = {
  list: (params?: Record<string, string | number | boolean | undefined>) => apiList('/admin/payments', params),
  get: (id: string) => apiGet(`/payments/${id}`),
  refund: (id: string, body: Record<string, unknown>) => apiSend('post', `/payments/${id}/refund`, body),
  verify: (body: Record<string, unknown>) => apiSend('post', '/payments/verify', body),
};

export const revenueApi = {
  get: (params?: Record<string, string | number | boolean | undefined>) =>
    apiGet('/admin/revenue', params),
};

export const hospitalsApi = {
  list: (params?: Record<string, string | number | boolean | undefined>) => apiList('/admin/hospitals', params),
  get: (id: string) => apiGet(`/services/hospitals/${id}`),
  create: (formData: FormData) => apiSend('post', '/admin/hospitals', formData),
  updateStatus: (id: string, is_active: boolean) =>
    apiSend('put', `/admin/hospitals/${id}/status`, { is_active }),
};

export const medicinesApi = {
  list: (params?: Record<string, string | number | boolean | undefined>) => apiList('/admin/medicines', params),
  create: (body: Record<string, unknown>) => apiSend('post', '/admin/medicines', body),
  update: (id: string, body: Record<string, unknown>) => apiSend('put', `/admin/medicines/${id}`, body),
  remove: (id: string) => apiSend('delete', `/admin/medicines/${id}`),
};

export const ordersApi = {
  list: (params?: Record<string, string | number | boolean | undefined>) => apiList('/admin/orders', params),
  get: (id: string) => apiGet(`/admin/orders/${id}`),
  updateStatus: (id: string, body: Record<string, unknown>) =>
    apiSend('put', `/admin/orders/${id}/status`, body),
};

export const disputesApi = {
  list: (params?: Record<string, string | number | boolean | undefined>) => apiList('/admin/disputes', params),
  update: (id: string, body: Record<string, unknown>) => apiSend('patch', `/admin/disputes/${id}`, body),
};

export const withdrawalsApi = {
  list: (params?: Record<string, string | number | boolean | undefined>) =>
    apiList('/caregiver/admin/withdrawals', params),
  get: (id: string) => apiGet(`/caregiver/withdrawals/${id}`),
  approve: (id: string, body?: Record<string, unknown>) =>
    apiSend('patch', `/caregiver/admin/withdrawals/${id}/approve`, body),
  reject: (id: string, body: Record<string, unknown>) =>
    apiSend('patch', `/caregiver/admin/withdrawals/${id}/reject`, body),
  complete: (id: string, body?: Record<string, unknown>) =>
    apiSend('patch', `/caregiver/admin/withdrawals/${id}/complete`, body),
};

export const supportApi = {
  list: (params?: Record<string, string | number | boolean | undefined>) => apiList('/support', params),
  get: (id: string) => apiGet(`/support/${id}`),
  update: (id: string, body: Record<string, unknown>) => apiSend('put', `/support/${id}`, body),
};

export const reviewsApi = {
  list: (params?: Record<string, string | number | boolean | undefined>) => apiList('/reviews', params),
  provider: (params?: Record<string, string | number | boolean | undefined>) =>
    apiGet('/reviews/provider', params),
};

export const notificationsApi = {
  list: (params?: Record<string, string | number | boolean | undefined>) => apiList('/notifications', params),
  markRead: (id: string) => apiSend('put', `/notifications/${id}/read`),
  markAllRead: () => apiSend('put', '/notifications/read-all'),
  remove: (id: string) => apiSend('delete', `/notifications/${id}`),
};

export const ambulanceApi = {
  list: (params?: Record<string, string | number | boolean | undefined>) => apiList('/ambulance', params),
  get: (id: string) => apiGet(`/ambulance/${id}`),
  cancel: (id: string) => apiSend('delete', `/ambulance/${id}`),
};

export const diagnosticsApi = {
  centers: (params?: Record<string, string | number | boolean | undefined>) =>
    apiList('/diagnostic/centers', params),
  bookings: (params?: Record<string, string | number | boolean | undefined>) =>
    apiList('/diagnostic/bookings', params),
  getBooking: (id: string) => apiGet(`/diagnostic/bookings/${id}`),
  cancelBooking: (id: string) => apiSend('delete', `/diagnostic/bookings/${id}`),
};

export const emergencyApi = {
  list: (params?: Record<string, string | number | boolean | undefined>) => apiList('/emergency', params),
  get: (id: string) => apiGet(`/emergency/${id}`),
  update: (id: string, body: Record<string, unknown>) => apiSend('put', `/emergency/${id}`, body),
  resolve: (id: string, body?: Record<string, unknown>) => apiSend('put', `/emergency/${id}/resolve`, body),
};

export const helpingHandsApi = {
  search: (params?: Record<string, string | number | boolean | undefined>) =>
    apiList('/helping-hand/search', params),
  get: (id: string) => apiGet(`/helping-hand/${id}`),
  bookings: (params?: Record<string, string | number | boolean | undefined>) =>
    apiList('/helping-hand/bookings', params),
  timeline: (id: string) => apiGet(`/helping-hand/bookings/${id}/timeline`),
};

export const familyApi = {
  list: (params?: Record<string, string | number | boolean | undefined>) => apiList('/family', params),
  get: (id: string) => apiGet(`/family/${id}`),
};

export const medicalRecordsApi = {
  list: (params?: Record<string, string | number | boolean | undefined>) =>
    apiList('/medical-records', params),
  get: (id: string) => apiGet(`/medical-records/${id}`),
};

export const medicationsApi = {
  list: (params?: Record<string, string | number | boolean | undefined>) => apiList('/medications', params),
  get: (id: string) => apiGet(`/medications/${id}`),
};

export const appointmentsApi = {
  list: (params?: Record<string, string | number | boolean | undefined>) => apiList('/appointments', params),
  get: (id: string) => apiGet(`/appointments/${id}`),
};

export const ekycApi = {
  status: () => apiGet('/ekyc/status'),
};

export const walletApi = {
  transactions: (params?: Record<string, string | number | boolean | undefined>) =>
    apiList('/wallet/transactions', params),
};
