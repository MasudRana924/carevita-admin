import apiClient from '../lib/api/client';
import { asList, getPagination, unwrapData as unwrapEnvelope } from 'src/lib/utils';
import type {
  AdminProfile,
  DashboardData,
  User,
  UsersQueryParams,
  UsersResponse,
  UserStatusUpdate,
  Caregiver,
  CaregiversQueryParams,
  CaregiversResponse,
  CaregiverBlockResponse,
  CaregiverEkycDetail,
  CaregiverEkycActionPayload,
  CaregiverCredentialsPayload,
  CaregiverVerificationDetail,
  CaregiverApprovePayload,
  CaregiverRejectPayload,
  Hospital,
  HospitalsQueryParams,
  HospitalCreateData,
  HospitalUpdateData,
  HospitalStatusUpdate,
  HospitalsResponse,
  AdminApiResponse,
  Booking,
  BookingsQueryParams,
  BookingsResponse,
  BookingCancelResponse,
  Dispute,
  DisputesQueryParams,
  DisputesResponse,
  DisputeStatus,
  Withdrawal,
  WithdrawalsQueryParams,
  WithdrawalsResponse,
  BkashRefundPayload,
  BkashRefundStatusPayload,
  AuditLog,
  AuditLogsQueryParams,
  AuditLogsResponse,
  SafetyIncident,
  SafetyIncidentsQueryParams,
  SafetyIncidentsResponse,
  SafetyIncidentUpdatePayload,
  PrivacyPolicy,
  PrivacyPolicyUpsertPayload,
  Conversation,
  ConversationsQueryParams,
  ConversationsResponse,
  ConversationUnreadSummary,
  Message,
  MessagesQueryParams,
  MessagesResponse,
  SendMessagePayload,
  SendMessageResponse,
  MarkReadResponse,
  ConversationStatusUpdate,
} from './admin-types';

const ADMIN_BASE = '/admin';

function unwrapData<T>(response: unknown): T {
  return unwrapEnvelope<T>(response).data;
}

function listResponse<T>(response: AdminApiResponse<T[]> | unknown): { data: T[]; meta: ReturnType<typeof getPagination> } {
  const envelope = unwrapEnvelope<T[] | Record<string, unknown>>(response);
  return {
    data: asList<T>(envelope.data),
    meta: getPagination(envelope.meta),
  };
}

function appendIfPresent(formData: FormData, key: string, value?: string | File | boolean | number | null) {
  if (value === undefined || value === null || value === '') return;
  if (value instanceof File) {
    formData.append(key, value);
    return;
  }
  formData.append(key, String(value));
}

export const adminProfileService = {
  getProfile: async (): Promise<AdminProfile> => {
    const response = await apiClient.get<AdminApiResponse<AdminProfile>>(`${ADMIN_BASE}/profile`);
    return unwrapData<AdminProfile>(response.data);
  },
};

export const adminDashboardService = {
  getDashboard: async (): Promise<DashboardData> => {
    const response = await apiClient.get<AdminApiResponse<DashboardData>>(`${ADMIN_BASE}/dashboard`);
    return unwrapData<DashboardData>(response.data);
  },
};

export const adminUsersService = {
  getUsers: async (params?: UsersQueryParams): Promise<UsersResponse> => {
    const response = await apiClient.get<AdminApiResponse<User[]>>(`${ADMIN_BASE}/users`, { params });
    return listResponse<User>(response.data);
  },

  blockUser: async (id: string): Promise<User> => {
    const response = await apiClient.put<AdminApiResponse<User>>(`${ADMIN_BASE}/users/${id}/block`);
    return unwrapData<User>(response.data);
  },

  unblockUser: async (id: string): Promise<User> => {
    const response = await apiClient.put<AdminApiResponse<User>>(`${ADMIN_BASE}/users/${id}/unblock`);
    return unwrapData<User>(response.data);
  },

  updateUserStatus: async (id: string, data: UserStatusUpdate): Promise<User> => {
    const response = await apiClient.put<AdminApiResponse<User>>(`${ADMIN_BASE}/users/${id}/status`, data);
    return unwrapData<User>(response.data);
  },
};

export const adminCaregiversService = {
  getCaregivers: async (params?: CaregiversQueryParams): Promise<CaregiversResponse> => {
    const response = await apiClient.get<AdminApiResponse<Caregiver[]>>(`${ADMIN_BASE}/caregivers`, { params });
    return listResponse<Caregiver>(response.data);
  },

  blockCaregiver: async (id: string): Promise<CaregiverBlockResponse> => {
    const response = await apiClient.put<AdminApiResponse<CaregiverBlockResponse>>(`${ADMIN_BASE}/caregivers/${id}/block`);
    return unwrapData<CaregiverBlockResponse>(response.data);
  },

  unblockCaregiver: async (id: string): Promise<CaregiverBlockResponse> => {
    const response = await apiClient.put<AdminApiResponse<CaregiverBlockResponse>>(`${ADMIN_BASE}/caregivers/${id}/unblock`);
    return unwrapData<CaregiverBlockResponse>(response.data);
  },

  getEkyc: async (id: string): Promise<CaregiverEkycDetail> => {
    const response = await apiClient.get<AdminApiResponse<CaregiverEkycDetail>>(`${ADMIN_BASE}/caregivers/${id}/ekyc`);
    return unwrapData<CaregiverEkycDetail>(response.data);
  },

  approveEkyc: async (
    id: string,
    body?: CaregiverEkycActionPayload
  ): Promise<{ data: CaregiverEkycDetail; message?: string }> => {
    const response = await apiClient.post<AdminApiResponse<CaregiverEkycDetail>>(
      `${ADMIN_BASE}/caregivers/${id}/ekyc/approve`,
      body?.comment ? { comment: body.comment } : {}
    );
    const envelope = unwrapEnvelope<CaregiverEkycDetail>(response.data);
    return { data: envelope.data, message: envelope.message };
  },

  declineEkyc: async (
    id: string,
    body?: CaregiverEkycActionPayload
  ): Promise<{ data: CaregiverEkycDetail; message?: string }> => {
    const response = await apiClient.post<AdminApiResponse<CaregiverEkycDetail>>(
      `${ADMIN_BASE}/caregivers/${id}/ekyc/decline`,
      body?.comment ? { comment: body.comment } : {}
    );
    const envelope = unwrapEnvelope<CaregiverEkycDetail>(response.data);
    return { data: envelope.data, message: envelope.message };
  },

  reviewCredentials: async (id: string, body: CaregiverCredentialsPayload): Promise<Caregiver> => {
    const payload: CaregiverCredentialsPayload = {
      credential_status: body.credential_status,
    };
    if (body.note) payload.note = body.note;
    if (body.credential_expires_at) payload.credential_expires_at = body.credential_expires_at;
    const response = await apiClient.post<AdminApiResponse<Caregiver>>(
      `${ADMIN_BASE}/caregivers/${id}/credentials`,
      payload
    );
    return unwrapData<Caregiver>(response.data);
  },

  getVerification: async (id: string): Promise<CaregiverVerificationDetail> => {
    const response = await apiClient.get<AdminApiResponse<CaregiverVerificationDetail>>(
      `${ADMIN_BASE}/caregivers/${id}/verification`
    );
    return unwrapData<CaregiverVerificationDetail>(response.data);
  },

  approve: async (id: string, body?: CaregiverApprovePayload): Promise<{ message?: string }> => {
    const response = await apiClient.post<AdminApiResponse<unknown>>(
      `${ADMIN_BASE}/caregivers/${id}/approve`,
      body?.note ? { note: body.note } : {}
    );
    return { message: unwrapEnvelope(response.data).message };
  },

  reject: async (id: string, body: CaregiverRejectPayload): Promise<{ message?: string }> => {
    const response = await apiClient.post<AdminApiResponse<unknown>>(`${ADMIN_BASE}/caregivers/${id}/reject`, {
      reason: body.reason,
    });
    return { message: unwrapEnvelope(response.data).message };
  },
};

export const adminHospitalsService = {
  getHospitals: async (params?: HospitalsQueryParams): Promise<HospitalsResponse> => {
    const response = await apiClient.get<AdminApiResponse<Hospital[]>>(`${ADMIN_BASE}/hospitals`, { params });
    return listResponse<Hospital>(response.data);
  },

  createHospital: async (data: HospitalCreateData): Promise<Hospital> => {
    const formData = new FormData();
    formData.append('name', data.name);
    appendIfPresent(formData, 'address', data.address);
    appendIfPresent(formData, 'phone', data.phone);
    appendIfPresent(formData, 'email', data.email);
    appendIfPresent(formData, 'city', data.city);
    appendIfPresent(formData, 'district', data.district);
    appendIfPresent(formData, 'type', data.type);
    appendIfPresent(formData, 'details', data.details);
    appendIfPresent(formData, 'location_lat', data.location_lat);
    appendIfPresent(formData, 'location_long', data.location_long);
    appendIfPresent(formData, 'photo', data.photo);

    const response = await apiClient.post<AdminApiResponse<Hospital>>(`${ADMIN_BASE}/hospitals`, formData);
    return unwrapData<Hospital>(response.data);
  },

  updateHospital: async (id: string, data: HospitalUpdateData): Promise<Hospital> => {
    const formData = new FormData();
    appendIfPresent(formData, 'name', data.name);
    appendIfPresent(formData, 'address', data.address);
    appendIfPresent(formData, 'phone', data.phone);
    appendIfPresent(formData, 'email', data.email);
    appendIfPresent(formData, 'city', data.city);
    appendIfPresent(formData, 'district', data.district);
    appendIfPresent(formData, 'type', data.type);
    appendIfPresent(formData, 'details', data.details);
    appendIfPresent(formData, 'location_lat', data.location_lat);
    appendIfPresent(formData, 'location_long', data.location_long);
    appendIfPresent(formData, 'is_active', data.is_active);
    appendIfPresent(formData, 'photo', data.photo);

    const response = await apiClient.put<AdminApiResponse<Hospital>>(`${ADMIN_BASE}/hospitals/${id}`, formData);
    return unwrapData<Hospital>(response.data);
  },

  updateHospitalStatus: async (id: string, data: HospitalStatusUpdate): Promise<Hospital> => {
    const response = await apiClient.put<AdminApiResponse<Hospital>>(`${ADMIN_BASE}/hospitals/${id}/status`, data);
    return unwrapData<Hospital>(response.data);
  },
};

export const adminBookingsService = {
  getBookings: async (params?: BookingsQueryParams): Promise<BookingsResponse> => {
    const response = await apiClient.get<AdminApiResponse<Booking[]>>(`${ADMIN_BASE}/bookings`, { params });
    return listResponse<Booking>(response.data);
  },

  getBooking: async (id: string): Promise<Booking> => {
    const response = await apiClient.get<AdminApiResponse<Booking>>(`${ADMIN_BASE}/bookings/${id}`);
    return unwrapData<Booking>(response.data);
  },

  cancelBooking: async (id: string, reason: string): Promise<BookingCancelResponse> => {
    const response = await apiClient.post<AdminApiResponse<BookingCancelResponse>>(
      `${ADMIN_BASE}/bookings/${id}/cancel`,
      { reason }
    );
    return unwrapData<BookingCancelResponse>(response.data);
  },
};

export const adminDisputesService = {
  getDisputes: async (params?: DisputesQueryParams): Promise<DisputesResponse> => {
    const response = await apiClient.get<AdminApiResponse<Dispute[]>>(`${ADMIN_BASE}/disputes`, { params });
    return listResponse<Dispute>(response.data);
  },

  updateDispute: async (id: string, body: { status: DisputeStatus; resolution?: string }): Promise<Dispute> => {
    const response = await apiClient.patch<AdminApiResponse<Dispute>>(`${ADMIN_BASE}/disputes/${id}`, body);
    return unwrapData<Dispute>(response.data);
  },
};

export const adminWithdrawalsService = {
  getWithdrawals: async (params?: WithdrawalsQueryParams): Promise<WithdrawalsResponse> => {
    const response = await apiClient.get<AdminApiResponse<Withdrawal[]>>(`${ADMIN_BASE}/withdrawals`, { params });
    return listResponse<Withdrawal>(response.data);
  },

  approveWithdrawal: async (id: string, note?: string): Promise<Withdrawal> => {
    const response = await apiClient.post<AdminApiResponse<Withdrawal>>(
      `${ADMIN_BASE}/withdrawals/${id}/approve`,
      note ? { note } : {}
    );
    return unwrapData<Withdrawal>(response.data);
  },

  rejectWithdrawal: async (id: string, note?: string): Promise<Withdrawal> => {
    const response = await apiClient.post<AdminApiResponse<Withdrawal>>(
      `${ADMIN_BASE}/withdrawals/${id}/reject`,
      note ? { note } : {}
    );
    return unwrapData<Withdrawal>(response.data);
  },
};

export const bkashRefundService = {
  refund: async (payload: BkashRefundPayload) => {
    const response = await apiClient.post('/payments/bkash/refund', payload);
    return unwrapData<Record<string, unknown>>(response.data);
  },

  status: async (payload: BkashRefundStatusPayload) => {
    const response = await apiClient.post('/payments/bkash/refund/status', payload);
    return unwrapData<Record<string, unknown>>(response.data);
  },
};

export const adminAuditLogsService = {
  getAuditLogs: async (params?: AuditLogsQueryParams): Promise<AuditLogsResponse> => {
    const response = await apiClient.get<AdminApiResponse<AuditLog[]>>(`${ADMIN_BASE}/audit-logs`, { params });
    return listResponse<AuditLog>(response.data);
  },
};

export const adminSafetyIncidentsService = {
  getSafetyIncidents: async (params?: SafetyIncidentsQueryParams): Promise<SafetyIncidentsResponse> => {
    const response = await apiClient.get<AdminApiResponse<SafetyIncident[]>>(
      `${ADMIN_BASE}/safety-incidents`,
      { params }
    );
    return listResponse<SafetyIncident>(response.data);
  },

  updateSafetyIncident: async (id: string, body: SafetyIncidentUpdatePayload): Promise<SafetyIncident> => {
    const response = await apiClient.patch<AdminApiResponse<SafetyIncident>>(
      `${ADMIN_BASE}/safety-incidents/${id}`,
      body
    );
    return unwrapData<SafetyIncident>(response.data);
  },
};

export const adminPrivacyPoliciesService = {
  getPrivacyPolicies: async (): Promise<PrivacyPolicy[]> => {
    const response = await apiClient.get<AdminApiResponse<PrivacyPolicy[]>>(`${ADMIN_BASE}/privacy-policies`);
    return asList<PrivacyPolicy>(unwrapEnvelope<PrivacyPolicy[]>(response.data).data);
  },

  upsertPrivacyPolicy: async (body: PrivacyPolicyUpsertPayload): Promise<PrivacyPolicy> => {
    const response = await apiClient.put<AdminApiResponse<PrivacyPolicy>>(`${ADMIN_BASE}/privacy-policies`, body);
    return unwrapData<PrivacyPolicy>(response.data);
  },
};

export const adminConversationsService = {
  getConversations: async (params?: ConversationsQueryParams): Promise<ConversationsResponse> => {
    const query: Record<string, unknown> = { ...params };
    if (!params?.unread_only) delete query.unread_only;
    if (!params?.search) delete query.search;
    if (!params?.status) delete query.status;
    const response = await apiClient.get<AdminApiResponse<Conversation[]>>(`${ADMIN_BASE}/conversations`, {
      params: query,
    });
    return listResponse<Conversation>(response.data);
  },

  getUnreadSummary: async (): Promise<ConversationUnreadSummary> => {
    const response = await apiClient.get<AdminApiResponse<ConversationUnreadSummary>>(
      `${ADMIN_BASE}/conversations/unread-summary`
    );
    const data = unwrapData<Partial<ConversationUnreadSummary> | null>(response.data) || {};
    return {
      unread_messages: Number(data.unread_messages) || 0,
      unread_conversations: Number(data.unread_conversations) || 0,
    };
  },

  getConversationByUser: async (userId: string): Promise<Conversation> => {
    const response = await apiClient.get<AdminApiResponse<Conversation>>(`${ADMIN_BASE}/conversations/user/${userId}`);
    return unwrapData<Conversation>(response.data);
  },

  getConversation: async (id: string): Promise<Conversation> => {
    const response = await apiClient.get<AdminApiResponse<Conversation>>(`${ADMIN_BASE}/conversations/${id}`);
    return unwrapData<Conversation>(response.data);
  },

  getMessages: async (id: string, params?: MessagesQueryParams): Promise<MessagesResponse> => {
    const response = await apiClient.get<AdminApiResponse<Message[]>>(`${ADMIN_BASE}/conversations/${id}/messages`, {
      params,
    });
    const envelope = unwrapEnvelope<Message[]>(response.data);
    return {
      data: Array.isArray(envelope.data) ? envelope.data : [],
      has_more: Boolean(envelope.meta?.has_more),
    };
  },

  sendMessage: async (
    id: string,
    body: SendMessagePayload,
    onUploadProgress?: (percent: number) => void
  ): Promise<SendMessageResponse> => {
    let payload: FormData | { message?: string; client_message_id?: string };
    if (body.file) {
      const formData = new FormData();
      formData.append('file', body.file);
      appendIfPresent(formData, 'message', body.message);
      appendIfPresent(formData, 'client_message_id', body.client_message_id);
      payload = formData;
    } else {
      payload = { message: body.message, client_message_id: body.client_message_id };
    }

    const response = await apiClient.post<AdminApiResponse<Message>>(
      `${ADMIN_BASE}/conversations/${id}/messages`,
      payload,
      {
        timeout: body.file ? 120000 : undefined,
        onUploadProgress: onUploadProgress
          ? (event) => {
              if (event.total) onUploadProgress(Math.round((event.loaded / event.total) * 100));
            }
          : undefined,
      }
    );
    const envelope = unwrapEnvelope<Message>(response.data);
    return {
      message: envelope.data,
      conversation: (envelope.meta?.conversation as Conversation | undefined) ?? null,
    };
  },

  updateStatus: async (id: string, body: ConversationStatusUpdate): Promise<Conversation> => {
    const response = await apiClient.put<AdminApiResponse<Conversation>>(`${ADMIN_BASE}/conversations/${id}/status`, body);
    return unwrapData<Conversation>(response.data);
  },

  markAsRead: async (id: string): Promise<MarkReadResponse> => {
    const response = await apiClient.put<AdminApiResponse<MarkReadResponse>>(`${ADMIN_BASE}/conversations/${id}/read`);
    const data = unwrapData<Partial<MarkReadResponse> | null>(response.data) || {};
    return { marked: Number(data.marked) || 0, conversation: data.conversation ?? null };
  },
};
