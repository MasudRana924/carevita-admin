// Admin API Types

// Generic API response wrapper
export interface AdminApiResponse<T = any> {
  success: boolean;
  message: string;
  data: T;
  meta: Record<string, any>;
}

// Profile types
export interface AdminProfile {
  id: string;
  phone: string;
  email: string;
  name: string;
  profile_photo: string | null;
  role: 'ADMIN';
  status: 'active' | 'blocked';
  is_verified: boolean;
  ekyc_status: boolean;
  ekyc_verified_at: string | null;
  ekyc_reference_id: string | null;
  language_preference: string;
  emergency_contact: string | null;
  address: string | null;
  date_of_birth: string | null;
  created_at: string;
  updated_at: string;
}

// Dashboard types
export interface DashboardData {
  total_bookings: number;
  pending_payment: number;
  paid: number;
  today_bookings: number;
  weekly_bookings: number;
  total_users: number;
  total_caregivers: number;
  caregiver_payment_done: number;
  platform_wallet_balance: number;
  total_paid_revenue: number;
  totalUsers: number;
  totalBookings: number;
  todayBookings: number;
  totalCaregivers: number;
  charts: {
    bookings_last_7_days: Array<{ date: string; count: number }>;
    payments_last_7_days: Array<{ date: string; paid: number; pending: number }>;
  };
}

// User types
export interface User {
  id: string;
  phone: string;
  email: string;
  name: string;
  profile_photo: string | null;
  role: 'USER' | 'CAREGIVER' | 'ADMIN';
  status: 'active' | 'blocked';
  is_verified: boolean;
  ekyc_status: boolean;
  ekyc_verified_at: string | null;
  ekyc_reference_id: string | null;
  created_at: string;
  updated_at?: string;
}

export interface UsersQueryParams {
  role?: 'USER' | 'CAREGIVER' | 'ADMIN';
  status?: 'active' | 'blocked';
  page?: number;
  limit?: number;
}

export interface UsersResponse {
  data: User[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface UserStatusUpdate {
  status: 'active' | 'blocked';
}

// Caregiver types
export interface Caregiver {
  id: string;
  user_id: string;
  bio: string;
  experience_years: number;
  service_areas: string[];
  hourly_rate: string;
  education: string;
  blood_group: string;
  date_of_birth: string;
  profile_photo: string | null;
  gender: 'male' | 'female' | 'other';
  district: string;
  thana: string;
  verification_status: 'PENDING' | 'APPROVED' | 'SUSPENDED';
  verification_note: string | null;
  rating: string;
  completed_bookings: number;
  is_available: boolean;
  ekyc_status: boolean;
  ekyc_verified_at: string | null;
  ekyc_reference_id: string | null;
  created_at: string;
  updated_at: string;
  name: string;
  email: string;
  phone: string;
}

export interface CaregiversQueryParams {
  verification_status?: 'PENDING' | 'APPROVED' | 'SUSPENDED';
  is_available?: boolean;
  page?: number;
  limit?: number;
}

export interface CaregiversResponse {
  data: Caregiver[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}

export interface CaregiverBlockResponse {
  caregiver_id: string;
  user_id: string;
}

// Hospital types
export interface Hospital {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  location_lat: string;
  location_long: string;
  city: string | null;
  district: string | null;
  type: string | null;
  photo: string | null;
  details: string | null;
  rating: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}

export interface HospitalsQueryParams {
  district?: string;
  type?: string;
  page?: number;
  limit?: number;
}

export interface HospitalCreateData {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  location_lat?: number;
  location_long?: number;
  city?: string;
  district?: string;
  type?: string;
  details?: string;
  photo?: File;
}

export interface HospitalUpdateData {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  location_lat?: number;
  location_long?: number;
  city?: string;
  district?: string;
  type?: string;
  details?: string;
  photo?: File;
  is_active?: boolean;
}

export interface HospitalStatusUpdate {
  is_active: boolean;
}

export interface HospitalsResponse {
  data: Hospital[];
  meta: {
    page: number;
    limit: number;
    total: number;
  };
}
