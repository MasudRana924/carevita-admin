import apiClient from '../lib/api/client';
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
  Hospital,
  HospitalsQueryParams,
  HospitalCreateData,
  HospitalUpdateData,
  HospitalStatusUpdate,
  HospitalsResponse,
  AdminApiResponse,
} from './admin-types';

// Admin API base path
const ADMIN_BASE = '/admin';

// Helper function to unwrap API response
function unwrapData<T>(response: any): T {
  return response.data || response;
}

// Profile API
export const adminProfileService = {
  getProfile: async (): Promise<AdminProfile> => {
    const response = await apiClient.get<AdminApiResponse<AdminProfile>>(`${ADMIN_BASE}/profile`);
    return unwrapData<AdminProfile>(response.data);
  },
};

// Dashboard API
export const adminDashboardService = {
  getDashboard: async (): Promise<DashboardData> => {
    const response = await apiClient.get<AdminApiResponse<DashboardData>>(`${ADMIN_BASE}/dashboard`);
    return unwrapData<DashboardData>(response.data);
  },
};

// Users API
export const adminUsersService = {
  getUsers: async (params?: UsersQueryParams): Promise<UsersResponse> => {
    const response = await apiClient.get<AdminApiResponse<User[]>>(`${ADMIN_BASE}/users`, { params });
    const meta = response.data.meta as { page: number; limit: number; total: number } | undefined;
    return {
      data: unwrapData<User[]>(response.data),
      meta: meta || { page: 1, limit: 20, total: 0 },
    };
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

// Caregivers API
export const adminCaregiversService = {
  getCaregivers: async (params?: CaregiversQueryParams): Promise<CaregiversResponse> => {
    const response = await apiClient.get<AdminApiResponse<Caregiver[]>>(`${ADMIN_BASE}/caregivers`, { params });
    const meta = response.data.meta as { page: number; limit: number; total: number } | undefined;
    return {
      data: unwrapData<Caregiver[]>(response.data),
      meta: meta || { page: 1, limit: 20, total: 0 },
    };
  },

  blockCaregiver: async (id: string): Promise<CaregiverBlockResponse> => {
    const response = await apiClient.put<AdminApiResponse<CaregiverBlockResponse>>(`${ADMIN_BASE}/caregivers/${id}/block`);
    return unwrapData<CaregiverBlockResponse>(response.data);
  },

  unblockCaregiver: async (id: string): Promise<CaregiverBlockResponse> => {
    const response = await apiClient.put<AdminApiResponse<CaregiverBlockResponse>>(`${ADMIN_BASE}/caregivers/${id}/unblock`);
    return unwrapData<CaregiverBlockResponse>(response.data);
  },
};

// Hospitals API
export const adminHospitalsService = {
  getHospitals: async (params?: HospitalsQueryParams): Promise<HospitalsResponse> => {
    const response = await apiClient.get<AdminApiResponse<Hospital[]>>(`${ADMIN_BASE}/hospitals`, { params });
    const meta = response.data.meta as { page: number; limit: number; total: number } | undefined;
    return {
      data: unwrapData<Hospital[]>(response.data),
      meta: meta || { page: 1, limit: 20, total: 0 },
    };
  },

  createHospital: async (data: HospitalCreateData): Promise<Hospital> => {
    const formData = new FormData();
    formData.append('name', data.name);
    
    if (data.address) formData.append('address', data.address);
    if (data.phone) formData.append('phone', data.phone);
    if (data.email) formData.append('email', data.email);
    if (data.location_lat !== undefined) formData.append('location_lat', data.location_lat.toString());
    if (data.location_long !== undefined) formData.append('location_long', data.location_long.toString());
    if (data.city) formData.append('city', data.city);
    if (data.district) formData.append('district', data.district);
    if (data.type) formData.append('type', data.type);
    if (data.details) formData.append('details', data.details);
    if (data.photo) formData.append('photo', data.photo);

    const response = await apiClient.post<AdminApiResponse<Hospital>>(`${ADMIN_BASE}/hospitals`, formData);
    return unwrapData<Hospital>(response.data);
  },

  updateHospital: async (id: string, data: HospitalUpdateData): Promise<Hospital> => {
    const formData = new FormData();
    
    if (data.name) formData.append('name', data.name);
    if (data.address) formData.append('address', data.address);
    if (data.phone) formData.append('phone', data.phone);
    if (data.email) formData.append('email', data.email);
    if (data.location_lat !== undefined) formData.append('location_lat', data.location_lat.toString());
    if (data.location_long !== undefined) formData.append('location_long', data.location_long.toString());
    if (data.city) formData.append('city', data.city);
    if (data.district) formData.append('district', data.district);
    if (data.type) formData.append('type', data.type);
    if (data.details) formData.append('details', data.details);
    if (data.is_active !== undefined) formData.append('is_active', data.is_active.toString());
    if (data.photo) formData.append('photo', data.photo);

    const response = await apiClient.put<AdminApiResponse<Hospital>>(`${ADMIN_BASE}/hospitals/${id}`, formData);
    return unwrapData<Hospital>(response.data);
  },

  updateHospitalStatus: async (id: string, data: HospitalStatusUpdate): Promise<Hospital> => {
    const response = await apiClient.put<AdminApiResponse<Hospital>>(`${ADMIN_BASE}/hospitals/${id}/status`, data);
    return unwrapData<Hospital>(response.data);
  },
};
