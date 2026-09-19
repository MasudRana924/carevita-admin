import type { RouteObject } from 'react-router';

import { lazy, Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

import { AuthLayout } from 'src/layouts/auth';
import { DashboardLayout } from 'src/layouts/dashboard';
import { AuthRedirect } from 'src/components/auth-redirect';
import { ProtectedRoute } from 'src/components/protected-route';

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
const AuditLogsView = lazy(() => import('src/sections/admin/audit-logs').then((m) => ({ default: m.AuditLogsView })));
const UserDetailView = lazy(() => import('src/sections/admin/detail-views').then((m) => ({ default: m.UserDetailView })));
const ProfileView = lazy(() => import('src/sections/admin/profile').then((m) => ({ default: m.ProfileView })));
const SettingsView = lazy(() => import('src/sections/admin/settings').then((m) => ({ default: m.SettingsView })));

const renderFallback = () => (
  <Box sx={{ display: 'flex', flex: '1 1 auto', alignItems: 'center', justifyContent: 'center' }}>
    <LinearProgress
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  </Box>
);

function AdminShell() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <Suspense fallback={renderFallback()}>
          <Outlet />
        </Suspense>
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
      { path: 'hospitals', element: <HospitalsView /> },
      { path: 'hospitals/new', element: <NewHospitalView /> },
      { path: 'hospitals/:id', element: <HospitalEditView /> },
      { path: 'bookings', element: <BookingsView /> },
      { path: 'bookings/:id', element: <BookingDetailView /> },
      { path: 'disputes', element: <DisputesView /> },
      { path: 'withdrawals', element: <WithdrawalsView /> },
      { path: 'audit-logs', element: <AuditLogsView /> },
      { path: 'profile', element: <ProfileView /> },
      { path: 'settings', element: <SettingsView /> },
    ],
  },
  { path: '404', element: <Page404 /> },
  { path: '*', element: <Page404 /> },
];
