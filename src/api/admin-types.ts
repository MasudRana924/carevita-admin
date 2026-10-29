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

export type CaregiverVerificationStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'SUSPENDED';

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
  verification_status: CaregiverVerificationStatus;
  verification_note: string | null;
  documents_count?: number | null;
  documents_submitted_at?: string | null;
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
  verification_status?: CaregiverVerificationStatus;
  ekyc_session_status?: EkycSessionStatus;
  /** PENDING + Didit approved: ready for manual admin review */
  pending_review?: boolean;
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

export type CaregiverOnboardingStep =
  | 'DOCUMENTS'
  | 'PROFILE'
  | 'EKYC'
  | 'PENDING_ADMIN_APPROVAL'
  | 'APPROVED'
  | 'REJECTED'
  | 'SUSPENDED';

export type CaregiverDocumentType =
  | 'family_nid_front'
  | 'family_nid_back'
  | 'academic_certificate'
  | 'professional_certificate'
  | string;

export interface CaregiverDocument {
  id: string;
  document_type: CaregiverDocumentType;
  file_url: string;
  /** `raw` = PDF */
  resource_type: 'image' | 'raw';
  original_name: string | null;
  mime_type: string | null;
  size_bytes: number | null;
  title: string | null;
  family_member_name: string | null;
  family_member_relation: string | null;
  created_at: string;
}

export interface CaregiverVerificationDocuments {
  family_nid_front: CaregiverDocument | null;
  family_nid_back: CaregiverDocument | null;
  academic_certificates: CaregiverDocument[];
  professional_certificates: CaregiverDocument[];
}

export interface CaregiverDocumentsSummary {
  family_nid_front: boolean;
  family_nid_back: boolean;
  academic_certificates: number;
  professional_certificates: number;
  complete: boolean;
  missing: string[];
}

export interface CaregiverVerificationDetail {
  caregiver_id: string;
  user_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  profile_photo: string | null;
  provider_type: string | null;
  district: string | null;
  thana: string | null;
  verification_status: CaregiverVerificationStatus;
  verification_note: string | null;
  approved_at: string | null;
  approved_by: string | { id?: string; name?: string; email?: string } | null;
  rejected_at: string | null;
  ekyc_status: boolean;
  ekyc_session_status: EkycSessionStatus | null;
  ekyc_verified_at: string | null;
  onboarding_step: CaregiverOnboardingStep;
  can_approve: boolean;
  can_reject: boolean;
  documents: CaregiverVerificationDocuments;
  documents_summary: CaregiverDocumentsSummary;
}

export interface CaregiverApprovePayload {
  note?: string;
}

export interface CaregiverRejectPayload {
  reason: string;
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

// Support chat types (one conversation per user)
export type ConversationStatus = 'active' | 'closed' | 'archived';

export type MessageType = 'text' | 'image' | 'document';

export type MessageSenderRole = 'user' | 'admin';

export interface Conversation {
  id: string;
  user_id: string;
  user_name: string | null;
  user_phone: string | null;
  user_email: string | null;
  user_photo: string | null;
  user_role: string | null;
  status: ConversationStatus;
  admin_unread_count: number;
  user_unread_count: number;
  last_message_at: string | null;
  last_message_preview: string | null;
  last_message_sender_role: MessageSenderRole | null;
}

export interface ConversationsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  unread_only?: boolean;
  status?: ConversationStatus;
}

export interface ConversationsResponse {
  data: Conversation[];
  meta: PaginationMeta;
}

export interface ConversationUnreadSummary {
  unread_messages: number;
  unread_conversations: number;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_role: MessageSenderRole;
  sender_name: string | null;
  sender_photo: string | null;
  message_type: MessageType;
  message: string | null;
  attachment_url: string | null;
  attachment_name: string | null;
  attachment_mime: string | null;
  attachment_size: number | null;
  client_message_id: string | null;
  is_read: boolean;
  read_at: string | null;
  created_at: string;
}

export interface MessagesQueryParams {
  limit?: number;
  before?: string;
  after?: string;
}

export interface MessagesResponse {
  data: Message[];
  has_more: boolean;
}

export interface SendMessagePayload {
  message?: string;
  file?: File;
  client_message_id?: string;
}

export interface SendMessageResponse {
  message: Message;
  conversation: Conversation | null;
}

export interface MarkReadResponse {
  marked: number;
  conversation: Conversation | null;
}

export interface ConversationStatusUpdate {
  status: ConversationStatus;
}
