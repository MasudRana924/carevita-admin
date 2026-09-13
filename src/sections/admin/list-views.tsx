import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

import { AdminListPage } from './admin-list-page';
import { StatusBadge } from 'src/components/status-badge';
import {
  ambulanceApi,
  bookingsApi,
  diagnosticsApi,
  disputesApi,
  doctorsApi,
  documentsApi,
  emergencyApi,
  helpingHandsApi,
  hospitalsApi,
  medicinesApi,
  notificationsApi,
  nursesApi,
  ordersApi,
  paymentsApi,
  providersApi,
  reviewsApi,
  supportApi,
  usersApi,
  withdrawalsApi,
} from 'src/lib/api';
import { pickString } from 'src/lib/utils';
import { fDate } from 'src/utils/format-time';

function PersonCell({ row }: { row: Record<string, unknown> }) {
  const name = pickString(row, ['name', 'full_name', 'customer_name', 'provider_name']);
  const photo = pickString(row, ['profile_photo', 'photo', 'avatar', 'image'], '');
  return (
    <Stack direction="row" spacing={1.5} alignItems="center">
      <Avatar src={photo || undefined} alt={name}>
        {name.charAt(0).toUpperCase()}
      </Avatar>
      <Typography variant="subtitle2">{name}</Typography>
    </Stack>
  );
}

function dateCell(row: Record<string, unknown>, keys = ['created_at']) {
  const value = pickString(row, keys, '');
  return value ? fDate(value) : '—';
}

export function UsersView() {
  const navigate = useNavigate();
  return (
    <AdminListPage
      title="Users"
      queryKey="admin-users"
      fetcher={usersApi.list}
      emptyTitle="No users found"
      searchPlaceholder="Search users"
      clientSearchKeys={['name', 'email', 'phone']}
      filters={[
        {
          id: 'role',
          label: 'Role',
          options: ['USER', 'CAREGIVER', 'NURSE', 'ADMIN'].map((value) => ({ value, label: value })),
        },
        {
          id: 'status',
          label: 'Status',
          options: ['active', 'inactive', 'banned'].map((value) => ({ value, label: value })),
        },
      ]}
      columns={[
        { id: 'name', label: 'User', render: (row) => <PersonCell row={row} /> },
        { id: 'email', label: 'Email' },
        { id: 'phone', label: 'Phone' },
        { id: 'role', label: 'Role', render: (row) => <StatusBadge value={pickString(row, ['role'], '')} /> },
        { id: 'status', label: 'Status', render: (row) => <StatusBadge value={pickString(row, ['status'], '')} /> },
        { id: 'created_at', label: 'Created', render: (row) => dateCell(row) },
      ]}
      actions={[
        { label: 'View', icon: 'eva:eye-fill', onClick: (row) => navigate(`/users/${pickString(row, ['id'])}`) },
        { label: 'Edit', icon: 'solar:pen-bold', onClick: (row) => navigate(`/users/${pickString(row, ['id'])}?edit=1`) },
        ({ confirm }) => ({
          label: 'Activate',
          icon: 'eva:checkmark-fill',
          color: 'success',
          hidden: (row) => String(row.status).toLowerCase() === 'active',
          onClick: (row) =>
            confirm(row, {
              title: 'Activate user',
              content: 'Activate this user account?',
              confirmLabel: 'Activate',
              color: 'success',
              run: () => usersApi.updateStatus(pickString(row, ['id']), 'active'),
              successMessage: 'User updated successfully',
            }),
        }),
        ({ confirm }) => ({
          label: 'Deactivate',
          icon: 'solar:forbidden-circle-bold',
          color: 'warning',
          hidden: (row) => String(row.status).toLowerCase() !== 'active',
          onClick: (row) =>
            confirm(row, {
              title: 'Deactivate user',
              content: 'Deactivate this user account?',
              confirmLabel: 'Deactivate',
              color: 'warning',
              run: () => usersApi.updateStatus(pickString(row, ['id']), 'inactive'),
              successMessage: 'User updated successfully',
            }),
        }),
        ({ confirm }) => ({
          label: 'Delete',
          icon: 'solar:trash-bin-trash-bold',
          color: 'error',
          onClick: (row) =>
            confirm(row, {
              title: 'Delete user',
              content: 'This cannot be undone. Delete this user?',
              run: () => usersApi.remove(pickString(row, ['id'])),
              successMessage: 'User deleted successfully',
            }),
        }),
      ]}
    />
  );
}

export function ProvidersView() {
  const navigate = useNavigate();
  return (
    <AdminListPage
      title="Providers"
      queryKey="admin-providers"
      fetcher={providersApi.list}
      emptyTitle="No providers found"
      clientSearchKeys={['name', 'email', 'phone']}
      filters={[
        {
          id: 'provider_type',
          label: 'Type',
          options: [
            { value: 'CAREGIVER', label: 'Caregiver' },
            { value: 'NURSE', label: 'Nurse' },
          ],
        },
        {
          id: 'verification_status',
          label: 'Verification',
          options: ['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'].map((value) => ({ value, label: value })),
        },
      ]}
      columns={[
        { id: 'name', label: 'Name', render: (row) => <PersonCell row={row} /> },
        { id: 'phone', label: 'Contact', render: (row) => pickString(row, ['phone', 'email']) },
        { id: 'specialization', label: 'Specialization', render: (row) => pickString(row, ['specialization', 'education', 'bio']) },
        {
          id: 'verification_status',
          label: 'Verification',
          render: (row) => <StatusBadge value={pickString(row, ['verification_status'], '')} />,
        },
        { id: 'is_available', label: 'Availability', render: (row) => <StatusBadge value={Boolean(row.is_available)} /> },
        { id: 'rating', label: 'Rating', render: (row) => pickString(row, ['rating'], '—') },
        { id: 'created_at', label: 'Created', render: (row) => dateCell(row) },
      ]}
      actions={[
        { label: 'View', icon: 'eva:eye-fill', onClick: (row) => navigate(`/providers/${pickString(row, ['id'])}`) },
        ({ confirm }) => ({
          label: 'Approve',
          icon: 'eva:checkmark-fill',
          color: 'success',
          onClick: (row) =>
            confirm(row, {
              title: 'Verify provider',
              content: 'Approve this provider verification?',
              confirmLabel: 'Approve',
              color: 'success',
              run: () =>
                providersApi.verify(pickString(row, ['id']), {
                  provider_type: row.license_number ? 'NURSE' : 'CAREGIVER',
                  verification_status: 'APPROVED',
                }),
              successMessage: 'Provider verified successfully',
            }),
        }),
        ({ confirm }) => ({
          label: 'Reject',
          icon: 'eva:close-fill',
          color: 'error',
          onClick: (row) =>
            confirm(row, {
              title: 'Reject provider',
              content: 'Reject this provider verification?',
              run: () =>
                providersApi.verify(pickString(row, ['id']), {
                  provider_type: row.license_number ? 'NURSE' : 'CAREGIVER',
                  verification_status: 'REJECTED',
                }),
              successMessage: 'Provider verification updated',
            }),
        }),
      ]}
    />
  );
}

export function NursesView() {
  const navigate = useNavigate();
  return (
    <AdminListPage
      title="Nurses"
      queryKey="admin-nurses"
      fetcher={nursesApi.list}
      emptyTitle="No nurses found"
      clientSearchKeys={['name', 'email', 'phone', 'specialization', 'license_number']}
      filters={[
        {
          id: 'verification_status',
          label: 'Verification',
          options: ['PENDING', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'].map((value) => ({ value, label: value })),
        },
      ]}
      columns={[
        { id: 'name', label: 'Name', render: (row) => <PersonCell row={row} /> },
        { id: 'specialization', label: 'Specialization' },
        { id: 'experience_years', label: 'Experience' },
        { id: 'hourly_rate', label: 'Hourly rate' },
        { id: 'license_number', label: 'License' },
        { id: 'verification_status', label: 'Verification', render: (row) => <StatusBadge value={pickString(row, ['verification_status'], '')} /> },
        { id: 'is_available', label: 'Availability', render: (row) => <StatusBadge value={Boolean(row.is_available)} /> },
      ]}
      actions={[{ label: 'View', icon: 'eva:eye-fill', onClick: (row) => navigate(`/nurses/${pickString(row, ['id'])}`) }]}
    />
  );
}

export function CaregiversView() {
  const navigate = useNavigate();
  return (
    <AdminListPage
      title="Caregivers"
      queryKey="admin-caregivers"
      fetcher={(params) => providersApi.list({ ...params, provider_type: 'CAREGIVER' })}
      emptyTitle="No caregivers found"
      clientSearchKeys={['name', 'email', 'phone']}
      columns={[
        { id: 'name', label: 'Name', render: (row) => <PersonCell row={row} /> },
        { id: 'experience_years', label: 'Experience' },
        { id: 'hourly_rate', label: 'Hourly rate' },
        { id: 'verification_status', label: 'Verification', render: (row) => <StatusBadge value={pickString(row, ['verification_status'], '')} /> },
        { id: 'is_available', label: 'Availability', render: (row) => <StatusBadge value={Boolean(row.is_available)} /> },
        { id: 'rating', label: 'Rating' },
      ]}
      actions={[{ label: 'View', icon: 'eva:eye-fill', onClick: (row) => navigate(`/caregivers/${pickString(row, ['id'])}`) }]}
    />
  );
}

export function DoctorsView() {
  const navigate = useNavigate();
  return (
    <AdminListPage
      title="Doctors"
      queryKey="admin-doctors"
      fetcher={doctorsApi.search}
      emptyTitle="No doctors found"
      clientSearchKeys={['name', 'specialization', 'location']}
      columns={[
        { id: 'name', label: 'Doctor' },
        { id: 'specialization', label: 'Specialization' },
        { id: 'location', label: 'Location', render: (row) => pickString(row, ['location', 'city', 'district']) },
        { id: 'is_available', label: 'Availability', render: (row) => <StatusBadge value={row.is_available as boolean} /> },
        { id: 'status', label: 'Status', render: (row) => <StatusBadge value={pickString(row, ['status', 'verification_status'], '')} /> },
      ]}
      actions={[{ label: 'View', icon: 'eva:eye-fill', onClick: (row) => navigate(`/doctors/${pickString(row, ['id'])}`) }]}
    />
  );
}

export function DocumentsView() {
  return (
    <AdminListPage
      title="Pending documents"
      queryKey="admin-documents"
      fetcher={documentsApi.pending}
      emptyTitle="No pending documents"
      columns={[
        { id: 'provider_name', label: 'Provider' },
        { id: 'document_type', label: 'Document type' },
        { id: 'submitted_at', label: 'Submitted', render: (row) => dateCell(row, ['submitted_at', 'created_at']) },
        { id: 'verification_status', label: 'Status', render: (row) => <StatusBadge value={pickString(row, ['verification_status'], '')} /> },
        {
          id: 'document_url',
          label: 'Preview',
          render: (row) => {
            const url = pickString(row, ['document_url', 'file_url', 'url'], '');
            return url !== '—' ? (
              <a href={url} target="_blank" rel="noreferrer">
                View
              </a>
            ) : (
              '—'
            );
          },
        },
      ]}
      actions={[
        ({ confirm }) => ({
          label: 'Approve',
          icon: 'eva:checkmark-fill',
          color: 'success',
          onClick: (row) =>
            confirm(row, {
              title: 'Verify document',
              content: 'Approve this document?',
              confirmLabel: 'Approve',
              color: 'success',
              run: () =>
                documentsApi.verify(pickString(row, ['id']), {
                  verified: true,
                  verification_status: 'APPROVED',
                }),
              successMessage: 'Document verified successfully',
            }),
        }),
        ({ confirm }) => ({
          label: 'Reject',
          icon: 'eva:close-fill',
          color: 'error',
          onClick: (row) =>
            confirm(row, {
              title: 'Reject document',
              content: 'Reject this document?',
              run: () =>
                documentsApi.verify(pickString(row, ['id']), {
                  verified: false,
                  verification_status: 'REJECTED',
                }),
              successMessage: 'Document rejected',
            }),
        }),
      ]}
    />
  );
}

export function BookingsView() {
  const navigate = useNavigate();
  return (
    <AdminListPage
      title="Bookings"
      queryKey="admin-bookings"
      fetcher={bookingsApi.list}
      emptyTitle="No bookings found"
      clientSearchKeys={['booking_number', 'customer_name', 'service_type']}
      filters={[
        {
          id: 'status',
          label: 'Status',
          options: [
            'PENDING_PAYMENT',
            'SEARCHING_PROVIDER',
            'PROVIDER_ACCEPTED',
            'SERVICE_STARTED',
            'PATIENT_PICKED_UP',
            'SERVICE_COMPLETED',
            'CANCELLED_BY_USER',
            'DISPUTED',
          ].map((value) => ({ value, label: value.replace(/_/g, ' ') })),
        },
        {
          id: 'provider_type',
          label: 'Service type',
          options: ['CAREGIVER', 'NURSE'].map((value) => ({ value, label: value })),
        },
      ]}
      columns={[
        { id: 'booking_number', label: 'Booking ID', render: (row) => pickString(row, ['booking_number', 'id']) },
        { id: 'customer_name', label: 'Customer' },
        { id: 'provider_type', label: 'Provider' },
        { id: 'service_type', label: 'Service type' },
        { id: 'booking_date', label: 'Date', render: (row) => dateCell(row, ['booking_date']) },
        { id: 'start_time', label: 'Time', render: (row) => pickString(row, ['start_time', 'end_time']) },
        { id: 'status', label: 'Status', render: (row) => <StatusBadge value={pickString(row, ['status'], '')} /> },
        { id: 'created_at', label: 'Created', render: (row) => dateCell(row) },
      ]}
      actions={[{ label: 'View', icon: 'eva:eye-fill', onClick: (row) => navigate(`/bookings/${pickString(row, ['id'])}`) }]}
    />
  );
}

export function PaymentsView() {
  const navigate = useNavigate();
  return (
    <AdminListPage
      title="Payments"
      queryKey="admin-payments"
      fetcher={paymentsApi.list}
      emptyTitle="No payments found"
      filters={[
        {
          id: 'status',
          label: 'Status',
          options: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED', 'REFUNDED', 'PAID'].map((value) => ({
            value,
            label: value,
          })),
        },
      ]}
      columns={[
        { id: 'id', label: 'Payment ID' },
        { id: 'user_id', label: 'Customer' },
        { id: 'booking_id', label: 'Booking' },
        { id: 'amount', label: 'Amount', render: (row) => `৳${pickString(row, ['amount'], '0')}` },
        { id: 'currency', label: 'Currency', render: (row) => pickString(row, ['currency'], 'BDT') },
        { id: 'payment_method', label: 'Method' },
        { id: 'status', label: 'Status', render: (row) => <StatusBadge value={pickString(row, ['status'], '')} /> },
        { id: 'created_at', label: 'Date', render: (row) => dateCell(row) },
      ]}
      actions={[{ label: 'View', icon: 'eva:eye-fill', onClick: (row) => navigate(`/payments/${pickString(row, ['id'])}`) }]}
    />
  );
}

export function HospitalsView() {
  const navigate = useNavigate();
  return (
    <AdminListPage
      title="Hospitals"
      queryKey="admin-hospitals"
      fetcher={hospitalsApi.list}
      emptyTitle="No hospitals found"
      extraToolbar={
        <ButtonCreate onClick={() => navigate('/hospitals/new')} label="Add hospital" />
      }
      columns={[
        {
          id: 'photo',
          label: 'Image',
          render: (row) => (
            <Avatar src={pickString(row, ['photo', 'image'], '') || undefined} variant="rounded" />
          ),
        },
        { id: 'name', label: 'Name' },
        { id: 'address', label: 'Address' },
        { id: 'phone', label: 'Phone' },
        { id: 'is_active', label: 'Status', render: (row) => <StatusBadge value={row.is_active === false ? 'INACTIVE' : 'ACTIVE'} /> },
      ]}
      actions={[
        { label: 'View', icon: 'eva:eye-fill', onClick: (row) => navigate(`/hospitals/${pickString(row, ['id'])}`) },
        ({ confirm }) => ({
          label: 'Deactivate',
          icon: 'solar:forbidden-circle-bold',
          hidden: (row) => row.is_active === false,
          onClick: (row) =>
            confirm(row, {
              title: 'Deactivate hospital',
              content: 'Set this hospital as inactive?',
              run: () => hospitalsApi.updateStatus(pickString(row, ['id']), false),
              successMessage: 'Hospital status updated',
            }),
        }),
        ({ confirm }) => ({
          label: 'Activate',
          icon: 'eva:checkmark-fill',
          hidden: (row) => row.is_active !== false,
          onClick: (row) =>
            confirm(row, {
              title: 'Activate hospital',
              content: 'Activate this hospital?',
              color: 'success',
              run: () => hospitalsApi.updateStatus(pickString(row, ['id']), true),
              successMessage: 'Hospital status updated',
            }),
        }),
      ]}
    />
  );
}

export function MedicinesView() {
  const navigate = useNavigate();
  return (
    <AdminListPage
      title="Medicines"
      queryKey="admin-medicines"
      fetcher={medicinesApi.list}
      emptyTitle="No medicines found"
      extraToolbar={<ButtonCreate onClick={() => navigate('/medicines/new')} label="Add medicine" />}
      columns={[
        { id: 'name', label: 'Name' },
        { id: 'generic_name', label: 'Generic' },
        { id: 'manufacturer', label: 'Manufacturer' },
        { id: 'category', label: 'Category' },
        { id: 'form', label: 'Form' },
        { id: 'is_active', label: 'Status', render: (row) => <StatusBadge value={row.is_active === false ? 'INACTIVE' : 'ACTIVE'} /> },
      ]}
      actions={[
        { label: 'Edit', icon: 'solar:pen-bold', onClick: (row) => navigate(`/medicines/${pickString(row, ['id'])}`) },
        ({ confirm }) => ({
          label: 'Delete',
          icon: 'solar:trash-bin-trash-bold',
          color: 'error',
          onClick: (row) =>
            confirm(row, {
              title: 'Delete medicine',
              content: 'Delete this medicine?',
              run: () => medicinesApi.remove(pickString(row, ['id'])),
              successMessage: 'Medicine deleted successfully',
            }),
        }),
      ]}
    />
  );
}

export function OrdersView() {
  const navigate = useNavigate();
  return (
    <AdminListPage
      title="Medicine orders"
      queryKey="admin-orders"
      fetcher={ordersApi.list}
      emptyTitle="No orders found"
      filters={[
        {
          id: 'status',
          label: 'Status',
          options: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map((value) => ({
            value,
            label: value,
          })),
        },
      ]}
      columns={[
        { id: 'order_number', label: 'Order ID' },
        { id: 'customer_name', label: 'Customer' },
        { id: 'total_amount', label: 'Total', render: (row) => `৳${pickString(row, ['total_amount'], '0')}` },
        { id: 'created_at', label: 'Order date', render: (row) => dateCell(row) },
        { id: 'delivery_address', label: 'Delivery' },
        { id: 'status', label: 'Status', render: (row) => <StatusBadge value={pickString(row, ['status'], '')} /> },
      ]}
      actions={[{ label: 'View', icon: 'eva:eye-fill', onClick: (row) => navigate(`/orders/${pickString(row, ['id'])}`) }]}
    />
  );
}

export function DisputesView() {
  const navigate = useNavigate();
  return (
    <AdminListPage
      title="Disputes"
      queryKey="admin-disputes"
      fetcher={disputesApi.list}
      emptyTitle="No disputes found"
      columns={[
        { id: 'dispute_number', label: 'Dispute ID' },
        { id: 'booking_number', label: 'Booking' },
        { id: 'raised_by_name', label: 'Customer' },
        { id: 'dispute_type', label: 'Reason' },
        { id: 'description', label: 'Description' },
        { id: 'status', label: 'Status', render: (row) => <StatusBadge value={pickString(row, ['status'], '')} /> },
        { id: 'resolution', label: 'Resolution' },
        { id: 'created_at', label: 'Created', render: (row) => dateCell(row) },
      ]}
      actions={[{ label: 'View', icon: 'eva:eye-fill', onClick: (row) => navigate(`/disputes/${pickString(row, ['id'])}`) }]}
    />
  );
}

export function WithdrawalsView() {
  const navigate = useNavigate();
  return (
    <AdminListPage
      title="Withdrawals"
      queryKey="admin-withdrawals"
      fetcher={withdrawalsApi.list}
      emptyTitle="No withdrawal requests"
      columns={[
        { id: 'provider_id', label: 'Provider' },
        { id: 'amount', label: 'Amount', render: (row) => `৳${pickString(row, ['amount'], '0')}` },
        { id: 'payment_account_id', label: 'Payment account' },
        { id: 'created_at', label: 'Requested', render: (row) => dateCell(row) },
        { id: 'status', label: 'Status', render: (row) => <StatusBadge value={pickString(row, ['status'], '')} /> },
      ]}
      actions={[
        { label: 'View', icon: 'eva:eye-fill', onClick: (row) => navigate(`/withdrawals/${pickString(row, ['id'])}`) },
        ({ confirm }) => ({
          label: 'Approve',
          icon: 'eva:checkmark-fill',
          hidden: (row) => String(row.status) !== 'PENDING',
          onClick: (row) =>
            confirm(row, {
              title: 'Approve withdrawal',
              content: 'Approve this withdrawal request?',
              color: 'success',
              run: () => withdrawalsApi.approve(pickString(row, ['id'])),
              successMessage: 'Withdrawal approved',
            }),
        }),
        ({ confirm }) => ({
          label: 'Reject',
          icon: 'eva:close-fill',
          color: 'error',
          hidden: (row) => String(row.status) !== 'PENDING',
          onClick: (row) =>
            confirm(row, {
              title: 'Reject withdrawal',
              content: 'Reject this withdrawal request?',
              run: () => withdrawalsApi.reject(pickString(row, ['id']), { rejection_reason: 'Rejected by admin' }),
              successMessage: 'Withdrawal rejected',
            }),
        }),
        ({ confirm }) => ({
          label: 'Complete',
          icon: 'solar:check-circle-bold',
          hidden: (row) => String(row.status) !== 'APPROVED',
          onClick: (row) =>
            confirm(row, {
              title: 'Complete withdrawal',
              content: 'Mark this withdrawal as completed?',
              color: 'success',
              run: () => withdrawalsApi.complete(pickString(row, ['id'])),
              successMessage: 'Withdrawal completed',
            }),
        }),
      ]}
    />
  );
}

export function SupportView() {
  const navigate = useNavigate();
  return (
    <AdminListPage
      title="Support tickets"
      queryKey="admin-support"
      fetcher={supportApi.list}
      emptyTitle="No support tickets found"
      columns={[
        { id: 'id', label: 'Ticket ID' },
        { id: 'user_id', label: 'User' },
        { id: 'subject', label: 'Subject' },
        { id: 'category', label: 'Category' },
        { id: 'status', label: 'Status', render: (row) => <StatusBadge value={pickString(row, ['status'], '')} /> },
        { id: 'created_at', label: 'Created', render: (row) => dateCell(row) },
      ]}
      actions={[{ label: 'View', icon: 'eva:eye-fill', onClick: (row) => navigate(`/support/${pickString(row, ['id'])}`) }]}
    />
  );
}

export function ReviewsView() {
  return (
    <AdminListPage
      title="Reviews"
      queryKey="admin-reviews"
      fetcher={reviewsApi.list}
      emptyTitle="No reviews found"
      columns={[
        { id: 'user_id', label: 'Reviewer' },
        { id: 'provider_id', label: 'Provider' },
        { id: 'overall_rating', label: 'Rating', render: (row) => pickString(row, ['overall_rating', 'rating']) },
        { id: 'review', label: 'Comment', render: (row) => pickString(row, ['review', 'comment', 'feedback']) },
        { id: 'booking_id', label: 'Booking' },
        { id: 'created_at', label: 'Date', render: (row) => dateCell(row) },
      ]}
    />
  );
}

export function NotificationsView() {
  return (
    <AdminListPage
      title="Notifications"
      queryKey="admin-notifications"
      fetcher={notificationsApi.list}
      emptyTitle="No notifications found"
      extraToolbar={
        <ButtonCreate
          label="Mark all as read"
          onClick={async () => {
            await notificationsApi.markAllRead();
          }}
        />
      }
      columns={[
        { id: 'title', label: 'Notification', render: (row) => pickString(row, ['title', 'message']) },
        { id: 'user_id', label: 'Recipient' },
        { id: 'type', label: 'Type' },
        { id: 'is_read', label: 'Read', render: (row) => <StatusBadge value={Boolean(row.is_read || row.read)} label={row.is_read || row.read ? 'Read' : 'Unread'} /> },
        { id: 'created_at', label: 'Created', render: (row) => dateCell(row) },
      ]}
      actions={[
        ({ confirm }) => ({
          label: 'Mark read',
          icon: 'eva:checkmark-fill',
          hidden: (row) => Boolean(row.is_read || row.read),
          onClick: (row) =>
            confirm(row, {
              title: 'Mark as read',
              content: 'Mark this notification as read?',
              color: 'primary',
              run: () => notificationsApi.markRead(pickString(row, ['id'])),
              successMessage: 'Notification updated',
            }),
        }),
        ({ confirm }) => ({
          label: 'Delete',
          icon: 'solar:trash-bin-trash-bold',
          color: 'error',
          onClick: (row) =>
            confirm(row, {
              title: 'Delete notification',
              content: 'Delete this notification?',
              run: () => notificationsApi.remove(pickString(row, ['id'])),
              successMessage: 'Notification deleted',
            }),
        }),
      ]}
    />
  );
}

export function AmbulanceView() {
  const navigate = useNavigate();
  return (
    <AdminListPage
      title="Ambulance"
      queryKey="admin-ambulance"
      fetcher={ambulanceApi.list}
      emptyTitle="No ambulance bookings found"
      columns={[
        { id: 'id', label: 'Booking ID' },
        { id: 'user_id', label: 'Patient/customer' },
        { id: 'pickup_location', label: 'Pickup' },
        { id: 'destination_location', label: 'Destination' },
        { id: 'status', label: 'Status', render: (row) => <StatusBadge value={pickString(row, ['status'], '')} /> },
        { id: 'scheduled_date', label: 'Date/time', render: (row) => dateCell(row, ['scheduled_date', 'created_at']) },
      ]}
      actions={[
        { label: 'View', icon: 'eva:eye-fill', onClick: (row) => navigate(`/ambulance/${pickString(row, ['id'])}`) },
        ({ confirm }) => ({
          label: 'Cancel',
          icon: 'eva:close-fill',
          color: 'error',
          onClick: (row) =>
            confirm(row, {
              title: 'Cancel ambulance booking',
              content: 'Cancel this ambulance booking?',
              run: () => ambulanceApi.cancel(pickString(row, ['id'])),
              successMessage: 'Ambulance booking cancelled',
            }),
        }),
      ]}
    />
  );
}

export function DiagnosticsView() {
  const navigate = useNavigate();
  return (
    <AdminListPage
      title="Diagnostics"
      queryKey="admin-diagnostics"
      fetcher={diagnosticsApi.bookings}
      emptyTitle="No diagnostic bookings found"
      columns={[
        { id: 'center', label: 'Center', render: (row) => pickString(row, ['center_name', 'diagnostic_center', 'center']) },
        { id: 'test', label: 'Test', render: (row) => pickString(row, ['test_name', 'test']) },
        { id: 'customer', label: 'Customer', render: (row) => pickString(row, ['customer_name', 'user_id']) },
        { id: 'booking_date', label: 'Booking date', render: (row) => dateCell(row, ['booking_date', 'created_at']) },
        { id: 'status', label: 'Status', render: (row) => <StatusBadge value={pickString(row, ['status'], '')} /> },
      ]}
      actions={[{ label: 'View', icon: 'eva:eye-fill', onClick: (row) => navigate(`/diagnostics/${pickString(row, ['id'])}`) }]}
    />
  );
}

export function EmergencyView() {
  const navigate = useNavigate();
  return (
    <AdminListPage
      title="Emergency"
      queryKey="admin-emergency"
      fetcher={emergencyApi.list}
      emptyTitle="No emergency requests found"
      columns={[
        { id: 'emergency_type', label: 'Type' },
        { id: 'location', label: 'Location' },
        { id: 'description', label: 'Description' },
        { id: 'status', label: 'Status', render: (row) => <StatusBadge value={pickString(row, ['status'], '')} /> },
        { id: 'created_at', label: 'Created', render: (row) => dateCell(row) },
      ]}
      actions={[
        { label: 'View', icon: 'eva:eye-fill', onClick: (row) => navigate(`/emergency/${pickString(row, ['id'])}`) },
        ({ confirm }) => ({
          label: 'Resolve',
          icon: 'eva:checkmark-fill',
          color: 'success',
          onClick: (row) =>
            confirm(row, {
              title: 'Resolve emergency',
              content: 'Mark this emergency as resolved?',
              color: 'success',
              run: () => emergencyApi.resolve(pickString(row, ['id'])),
              successMessage: 'Emergency resolved',
            }),
        }),
      ]}
    />
  );
}

export function HelpingHandsView() {
  const navigate = useNavigate();
  return (
    <AdminListPage
      title="Helping Hands"
      queryKey="admin-helping-hands"
      fetcher={helpingHandsApi.search}
      emptyTitle="No helping hand providers found"
      columns={[
        { id: 'name', label: 'Provider', render: (row) => pickString(row, ['name', 'id']) },
        { id: 'skills', label: 'Skills', render: (row) => pickString(row, ['skills', 'specialization']) },
        { id: 'location', label: 'Location', render: (row) => pickString(row, ['location', 'district', 'city']) },
        { id: 'is_available', label: 'Availability', render: (row) => <StatusBadge value={Boolean(row.is_available)} /> },
        { id: 'status', label: 'Status', render: (row) => <StatusBadge value={pickString(row, ['status'], '')} /> },
      ]}
      actions={[{ label: 'View', icon: 'eva:eye-fill', onClick: (row) => navigate(`/helping-hands/${pickString(row, ['id'])}`) }]}
    />
  );
}

function ButtonCreate({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <Button variant="contained" color="inherit" onClick={onClick}>
      {label}
    </Button>
  );
}
