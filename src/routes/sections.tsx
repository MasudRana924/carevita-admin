import type { RouteObject } from 'react-router';

import { lazy, Suspense } from 'react';
import { Navigate, Outlet, useParams } from 'react-router-dom';

import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';
import { PageLoader } from 'src/components/page-loader';
import { AuthRedirect } from 'src/components/auth-redirect';
import { ProtectedRoute } from 'src/components/protected-route';
import { RouteTransitionLoader } from 'src/components/route-transition-loader';

const LoginPage = lazy(() => import('src/pages/login'));
const DashboardView = lazy(() => import('src/sections/admin/dashboard-view'));
const Page404 = lazy(() => import('src/pages/page-not-found'));

const UsersView = lazy(() => import('src/sections/admin/users').then((m) => ({ default: m.UsersView })));
const CaregiversView = lazy(() => import('src/sections/admin/caregivers').then((m) => ({ default: m.CaregiversView })));
const CaregiverEkycDetailView = lazy(() =>
  import('src/sections/admin/caregivers').then((m) => ({ default: m.CaregiverEkycDetailView }))
);
const HospitalsView = lazy(() => import('src/sections/admin/hospitals').then((m) => ({ default: m.HospitalsView })));
const NewHospitalView = lazy(() => import('src/sections/admin/hospitals').then((m) => ({ default: m.NewHospitalView })));
const HospitalEditView = lazy(() => import('src/sections/admin/hospitals').then((m) => ({ default: m.HospitalEditView })));
const BookingsView = lazy(() => import('src/sections/admin/bookings').then((m) => ({ default: m.BookingsView })));
const BookingDetailView = lazy(() => import('src/sections/admin/bookings').then((m) => ({ default: m.BookingDetailView })));
const DisputesView = lazy(() => import('src/sections/admin/disputes').then((m) => ({ default: m.DisputesView })));
const WithdrawalsView = lazy(() => import('src/sections/admin/withdrawals').then((m) => ({ default: m.WithdrawalsView })));
const SafetyIncidentsView = lazy(() =>
  import('src/sections/admin/safety-incidents').then((m) => ({ default: m.SafetyIncidentsView }))
);
const PrivacyPoliciesView = lazy(() =>
  import('src/sections/admin/privacy-policies').then((m) => ({ default: m.PrivacyPoliciesView }))
);
const AuditLogsView = lazy(() => import('src/sections/admin/audit-logs').then((m) => ({ default: m.AuditLogsView })));
const UserDetailView = lazy(() => import('src/sections/admin/detail-views').then((m) => ({ default: m.UserDetailView })));
const ProfileView = lazy(() => import('src/sections/admin/profile').then((m) => ({ default: m.ProfileView })));
const SettingsView = lazy(() => import('src/sections/admin/settings').then((m) => ({ default: m.SettingsView })));
const SupportChatView = lazy(() =>
  import('src/sections/admin/support-chat').then((m) => ({ default: m.SupportChatView }))
);
const CaregiverVerificationView = lazy(() =>
  import('src/sections/admin/caregivers').then((m) => ({ default: m.CaregiverVerificationView }))
);

function LegacyConversationRedirect() {
  const { id } = useParams();
  return <Navigate to={id ? `/support-chat/${id}` : '/support-chat'} replace />;
}

function LegacyVerificationRedirect() {
  const { id } = useParams();
  return <Navigate to={id ? `/caregivers/${id}/verification` : '/caregivers?tab=pending'} replace />;
}

const renderFallback = () => <PageLoader />;

function AdminShell() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <RouteTransitionLoader>
          <Suspense fallback={renderFallback()}>
            <Outlet />
          </Suspense>
        </RouteTransitionLoader>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

export const routesSection: RouteObject[] = [
  {
    path: '/',
    element: (
      <AuthRedirect>
        <AuthLayout>
          <Suspense fallback={renderFallback()}>
            <LoginPage />
          </Suspense>
        </AuthLayout>
      </AuthRedirect>
    ),
  },
  {
    path: '/login',
    element: (
      <AuthRedirect>
        <AuthLayout>
          <Suspense fallback={renderFallback()}>
            <LoginPage />
          </Suspense>
        </AuthLayout>
      </AuthRedirect>
    ),
  },
  {
    element: <AdminShell />,
    children: [
      { path: 'dashboard', element: <DashboardView /> },
      { path: 'users', element: <UsersView /> },
      { path: 'users/:id', element: <UserDetailView /> },
      { path: 'caregivers', element: <CaregiversView /> },
      { path: 'caregivers/:id/ekyc', element: <CaregiverEkycDetailView /> },
      { path: 'caregivers/:id/verification', element: <CaregiverVerificationView /> },
      { path: 'pending-verifications', element: <LegacyVerificationRedirect /> },
      { path: 'pending-verifications/:id/review', element: <LegacyVerificationRedirect /> },
      { path: 'hospitals', element: <HospitalsView /> },
      { path: 'hospitals/new', element: <NewHospitalView /> },
      { path: 'hospitals/:id', element: <HospitalEditView /> },
      { path: 'bookings', element: <BookingsView /> },
      { path: 'bookings/:id', element: <BookingDetailView /> },
      { path: 'disputes', element: <DisputesView /> },
      { path: 'withdrawals', element: <WithdrawalsView /> },
      { path: 'safety-incidents', element: <SafetyIncidentsView /> },
      { path: 'privacy-policies', element: <PrivacyPoliciesView /> },
      { path: 'audit-logs', element: <AuditLogsView /> },
      { path: 'support-chat', element: <SupportChatView /> },
      { path: 'support-chat/:conversationId', element: <SupportChatView /> },
      { path: 'conversations', element: <LegacyConversationRedirect /> },
      { path: 'conversations/:id', element: <LegacyConversationRedirect /> },
      { path: 'profile', element: <ProfileView /> },
      { path: 'settings', element: <SettingsView /> },
    ],
  },
  { path: '404', element: <Page404 /> },
  { path: '*', element: <Page404 /> },
];
