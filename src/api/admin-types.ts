// Admin API Types

// Generic API response wrapper
export interface AdminApiResponse<T = any> {
  success: boolean;
  statusCode?: number;
  message: string;
  data: T;
  meta?: {
    requestId?: string;
    timestamp?: string;
    path?: string;
    pagination?: PaginationMeta;
    [key: string]: unknown;
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Profile types
export interface AdminProfile {
  id: string;
  phone: string | null;
  email: string;
  name: string;
  profile_photo: string | null;
  role: 'ADMIN';
  status: 'active' | 'blocked';
  is_verified: boolean;
  ekyc_status: boolean;
  ekyc_session_status?: string | null;
  ekyc_verified_at: string | null;
  ekyc_reference_id?: string | null;
  language_preference?: string | null;
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
  caregiver_payment_done?: number;
  platform_wallet_balance: number;
  total_paid_revenue: number;
  /** camelCase aliases returned by older API payloads */
  totalUsers?: number;
  totalBookings?: number;
  todayBookings?: number;
  totalCaregivers?: number;
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
  meta: PaginationMeta;
}

export interface UserStatusUpdate {
  status: 'active' | 'blocked';
}

// Caregiver types
export type EkycSessionStatus =
  | 'Not Started'
  | 'In Progress'
  | 'In Review'
  | 'Approved'
  | 'Declined'
  | string;

export type CredentialStatus =
  | 'VERIFIED'
  | 'REJECTED'
  | 'PENDING'
  | 'SUSPENDED'
  | 'REVERIFY_REQUIRED';

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
  credential_status?: CredentialStatus | null;
  credential_note?: string | null;
  credential_expires_at?: string | null;
  rating: string;
  completed_bookings: number;
  is_available: boolean;
  ekyc_status: boolean;
  ekyc_session_status?: EkycSessionStatus | null;
  ekyc_verified_at: string | null;
  ekyc_reference_id: string | null;
  user_ekyc_status?: boolean;
  user_ekyc_session_status?: EkycSessionStatus | null;
  user_ekyc_verified_at?: string | null;
  user_ekyc_reference_id?: string | null;
  created_at: string;
  updated_at: string;
  name: string;
  email: string;
  phone: string;
}

export interface CaregiversQueryParams {
  verification_status?: 'PENDING' | 'APPROVED' | 'SUSPENDED';
  ekyc_session_status?: EkycSessionStatus;
  page?: number;
  limit?: number;
}

export interface CaregiversResponse {
  data: Caregiver[];
  meta: PaginationMeta;
}

export interface CaregiverBlockResponse {
  caregiver_id: string;
  user_id: string;
}

export interface CaregiverEkycFeatureItem {
  status?: string;
  document_type?: string;
  [key: string]: unknown;
}

export interface CaregiverEkycDecision {
  status?: string;
  id_verifications?: CaregiverEkycFeatureItem[];
  liveness_checks?: CaregiverEkycFeatureItem[];
  face_matches?: CaregiverEkycFeatureItem[];
  reviews?: CaregiverEkycFeatureItem[];
  [key: string]: unknown;
}

export interface CaregiverEkycDetail {
  caregiver_id: string;
  user_id: string;
  name?: string;
  email?: string;
  phone?: string;
  ekyc_status: boolean;
  ekyc_session_status: EkycSessionStatus;
  session_id?: string | null;
  can_approve: boolean;
  can_decline: boolean;
  decision?: CaregiverEkycDecision | null;
  [key: string]: unknown;
}

export interface CaregiverEkycActionPayload {
  comment?: string;
}

export interface CaregiverCredentialsPayload {
  credential_status: CredentialStatus;
  note?: string;
  credential_note?: string;
  credential_expires_at?: string;
}

// Hospital types
export interface Hospital {
  id: string;
  name: string;
  address: string | null;
  phone: string | null;
  email: string | null;
  location_lat: string | null;
  location_long: string | null;
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
  page?: number;
  limit?: number;
}

export interface HospitalCreateData {
  name: string;
  address?: string;
  phone?: string;
  email?: string;
  city?: string;
  district?: string;
  type?: string;
  details?: string;
  location_lat?: string | number;
  location_long?: string | number;
  photo?: File;
}

export interface HospitalUpdateData {
  name?: string;
  address?: string;
  phone?: string;
  email?: string;
  city?: string;
  district?: string;
  type?: string;
  details?: string;
  location_lat?: string | number;
  location_long?: string | number;
  photo?: File;
  is_active?: boolean;
}

export interface HospitalStatusUpdate {
  is_active: boolean;
}

export interface HospitalsResponse {
  data: Hospital[];
  meta: PaginationMeta;
}

export type BookingStatus =
  | 'SEARCHING_PROVIDER'
  | 'PROVIDER_ASSIGNED'
  | 'PROVIDER_ACCEPTED'
  | 'PAYMENT_PAID'
  | 'SERVICE_IN_PROGRESS'
  | 'SERVICE_COMPLETED'
  | 'CANCELLED_BY_USER'
  | 'CANCELLED_BY_PROVIDER'
  | 'CANCELLED_BY_ADMIN';

export interface Booking {
  id: string;
  status: BookingStatus | string;
  offer_expires_at?: string | null;
  accept_timeout_minutes?: number | null;
  payout_frozen?: boolean;
  [key: string]: unknown;
}

export interface BookingsQueryParams {
  status?: string;
  date_from?: string;
  date_to?: string;
  page?: number;
  limit?: number;
}

export interface BookingsResponse {
  data: Booking[];
  meta: PaginationMeta;
}

export interface BookingCancelResponse {
  cancellation_policy?: unknown;
  refund?: unknown;
  [key: string]: unknown;
}

export type DisputeStatus = 'OPEN' | 'IN_REVIEW' | 'RESOLVED' | 'REJECTED';

export interface Dispute {
  id: string;
  status: DisputeStatus | string;
  resolution?: string | null;
  [key: string]: unknown;
}

export interface DisputesQueryParams {
  status?: DisputeStatus | string;
  page?: number;
  limit?: number;
}

export interface DisputesResponse {
  data: Dispute[];
  meta: PaginationMeta;
}

export interface Withdrawal {
  id: string;
  amount?: number | string;
  caregiver_name?: string;
  bkash_number?: string;
  status?: string;
  [key: string]: unknown;
}

export interface WithdrawalsQueryParams {
  status?: string;
  page?: number;
  limit?: number;
}

export interface WithdrawalsResponse {
  data: Withdrawal[];
  meta: PaginationMeta;
}

export interface BkashRefundPayload {
  paymentId?: string;
  booking_id: string;
  refundAmount?: string;
  sku?: string;
  reason?: string;
}

export interface BkashRefundStatusPayload {
  paymentId?: string;
  booking_id: string;
}

export interface AuditLog {
  id?: string;
  actor_name?: string;
  action?: string;
  entity_type?: string;
  entity_id?: string;
  meta?: unknown;
  created_at?: string;
  [key: string]: unknown;
}

export interface AuditLogsQueryParams {
  entity_type?: string;
  entity_id?: string;
  page?: number;
  limit?: number;
}

export interface AuditLogsResponse {
  data: AuditLog[];
  meta: PaginationMeta;
}

export type SafetyIncidentStatus = 'OPEN' | 'IN_REVIEW' | 'RESOLVED' | 'DISMISSED';

export interface SafetyIncident {
  id: string;
  booking_id?: string;
  booking_number?: string;
  reported_by?: string;
  reporter_name?: string;
  status: SafetyIncidentStatus | string;
  note?: string | null;
  admin_note?: string | null;
  payout_frozen?: boolean;
  created_at?: string;
  [key: string]: unknown;
}

export interface SafetyIncidentsQueryParams {
  status?: SafetyIncidentStatus | string;
  page?: number;
  limit?: number;
}

export interface SafetyIncidentsResponse {
  data: SafetyIncident[];
  meta: PaginationMeta;
}

export interface SafetyIncidentUpdatePayload {
  status: SafetyIncidentStatus;
  note?: string;
  admin_note?: string;
  unfreeze_payout?: boolean;
}

export type PrivacyPolicyAudience = 'USER' | 'CAREGIVER';

export interface PrivacyPolicy {
  id: string;
  audience: PrivacyPolicyAudience | string;
  title: string;
  content: string;
  version?: string;
  is_published?: boolean;
  updated_at?: string;
  [key: string]: unknown;
}

export interface PrivacyPolicyUpsertPayload {
  audience: PrivacyPolicyAudience | 'NURSE';
  title: string;
  content: string;
  version?: string;
  is_published?: boolean;
}
