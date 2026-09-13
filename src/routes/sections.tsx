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
const ProvidersView = lazy(() => import('src/sections/admin/list-views').then((m) => ({ default: m.ProvidersView })));
const NursesView = lazy(() => import('src/sections/admin/list-views').then((m) => ({ default: m.NursesView })));
const CaregiversView = lazy(() => import('src/sections/admin/caregivers').then((m) => ({ default: m.CaregiversView })));
const DoctorsView = lazy(() => import('src/sections/admin/list-views').then((m) => ({ default: m.DoctorsView })));
const DocumentsView = lazy(() => import('src/sections/admin/list-views').then((m) => ({ default: m.DocumentsView })));
const BookingsView = lazy(() => import('src/sections/admin/list-views').then((m) => ({ default: m.BookingsView })));
const PaymentsView = lazy(() => import('src/sections/admin/list-views').then((m) => ({ default: m.PaymentsView })));
const HospitalsView = lazy(() => import('src/sections/admin/hospitals').then((m) => ({ default: m.HospitalsView })));
const MedicinesView = lazy(() => import('src/sections/admin/list-views').then((m) => ({ default: m.MedicinesView })));
const OrdersView = lazy(() => import('src/sections/admin/list-views').then((m) => ({ default: m.OrdersView })));
const DisputesView = lazy(() => import('src/sections/admin/list-views').then((m) => ({ default: m.DisputesView })));
const WithdrawalsView = lazy(() => import('src/sections/admin/list-views').then((m) => ({ default: m.WithdrawalsView })));
const SupportView = lazy(() => import('src/sections/admin/list-views').then((m) => ({ default: m.SupportView })));
const ReviewsView = lazy(() => import('src/sections/admin/list-views').then((m) => ({ default: m.ReviewsView })));
const NotificationsView = lazy(() => import('src/sections/admin/list-views').then((m) => ({ default: m.NotificationsView })));
const AmbulanceView = lazy(() => import('src/sections/admin/list-views').then((m) => ({ default: m.AmbulanceView })));
const DiagnosticsView = lazy(() => import('src/sections/admin/list-views').then((m) => ({ default: m.DiagnosticsView })));
const EmergencyView = lazy(() => import('src/sections/admin/list-views').then((m) => ({ default: m.EmergencyView })));
const HelpingHandsView = lazy(() => import('src/sections/admin/list-views').then((m) => ({ default: m.HelpingHandsView })));

const UserDetailView = lazy(() => import('src/sections/admin/detail-views').then((m) => ({ default: m.UserDetailView })));
const ProviderDetailView = lazy(() => import('src/sections/admin/detail-views').then((m) => ({ default: () => <m.ProviderDetailView type="provider" /> })));
const NurseDetailView = lazy(() => import('src/sections/admin/detail-views').then((m) => ({ default: () => <m.ProviderDetailView type="nurse" /> })));
const CaregiverDetailView = lazy(() => import('src/sections/admin/detail-views').then((m) => ({ default: () => <m.ProviderDetailView type="caregiver" /> })));
const DoctorDetailView = lazy(() => import('src/sections/admin/detail-views').then((m) => ({ default: m.DoctorDetailView })));
const BookingDetailView = lazy(() => import('src/sections/admin/detail-views').then((m) => ({ default: m.BookingDetailView })));
const PaymentDetailView = lazy(() => import('src/sections/admin/detail-views').then((m) => ({ default: m.PaymentDetailView })));
const HospitalDetailView = lazy(() => import('src/sections/admin/detail-views').then((m) => ({ default: m.HospitalDetailView })));
const HospitalFormView = lazy(() => import('src/sections/admin/detail-views').then((m) => ({ default: m.HospitalFormView })));
const MedicineFormView = lazy(() => import('src/sections/admin/detail-views').then((m) => ({ default: m.MedicineFormView })));
const OrderDetailView = lazy(() => import('src/sections/admin/detail-views').then((m) => ({ default: m.OrderDetailView })));
const DisputeDetailView = lazy(() => import('src/sections/admin/detail-views').then((m) => ({ default: m.DisputeDetailView })));
const WithdrawalDetailView = lazy(() => import('src/sections/admin/detail-views').then((m) => ({ default: m.WithdrawalDetailView })));
const SupportDetailView = lazy(() => import('src/sections/admin/detail-views').then((m) => ({ default: m.SupportDetailView })));
const AmbulanceDetailView = lazy(() => import('src/sections/admin/detail-views').then((m) => ({ default: m.AmbulanceDetailView })));
const DiagnosticDetailView = lazy(() => import('src/sections/admin/detail-views').then((m) => ({ default: m.DiagnosticDetailView })));
const EmergencyDetailView = lazy(() => import('src/sections/admin/detail-views').then((m) => ({ default: m.EmergencyDetailView })));
const HelpingHandDetailView = lazy(() => import('src/sections/admin/detail-views').then((m) => ({ default: m.HelpingHandDetailView })));
const AppointmentDetailView = lazy(() => import('src/sections/admin/detail-views').then((m) => ({ default: m.AppointmentDetailView })));

const RevenueView = lazy(() => import('src/sections/admin/other-views').then((m) => ({ default: m.RevenueView })));
const EkycView = lazy(() => import('src/sections/admin/other-views').then((m) => ({ default: m.EkycView })));
const ProfileView = lazy(() => import('src/sections/admin/profile').then((m) => ({ default: m.ProfileView })));
const SettingsView = lazy(() => import('src/sections/admin/settings').then((m) => ({ default: m.SettingsView })));
const ServicesView = lazy(() => import('src/sections/admin/other-views').then((m) => ({ default: m.ServicesView })));
const WalletView = lazy(() => import('src/sections/admin/other-views').then((m) => ({ default: m.WalletView })));
const AppointmentsView = lazy(() => import('src/sections/admin/other-views').then((m) => ({ default: m.AppointmentsView })));
const NewHospitalView = lazy(() => import('src/sections/admin/hospitals').then((m) => ({ default: m.NewHospitalView })));

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
      { path: 'providers', element: <ProvidersView /> },
      { path: 'providers/:id', element: <ProviderDetailView /> },
      { path: 'nurses', element: <NursesView /> },
      { path: 'nurses/:id', element: <NurseDetailView /> },
      { path: 'caregivers', element: <CaregiversView /> },
      { path: 'caregivers/:id', element: <CaregiverDetailView /> },
      { path: 'doctors', element: <DoctorsView /> },
      { path: 'doctors/:id', element: <DoctorDetailView /> },
      { path: 'documents', element: <DocumentsView /> },
      { path: 'ekyc', element: <EkycView /> },
      { path: 'bookings', element: <BookingsView /> },
      { path: 'bookings/:id', element: <BookingDetailView /> },
      { path: 'payments', element: <PaymentsView /> },
      { path: 'payments/:id', element: <PaymentDetailView /> },
      { path: 'revenue', element: <RevenueView /> },
      { path: 'hospitals', element: <HospitalsView /> },
      { path: 'hospitals/new', element: <NewHospitalView /> },
      { path: 'hospitals/:id', element: <HospitalDetailView /> },
      { path: 'medicines', element: <MedicinesView /> },
      { path: 'medicines/new', element: <MedicineFormView /> },
      { path: 'medicines/:id', element: <MedicineFormView /> },
      { path: 'orders', element: <OrdersView /> },
      { path: 'orders/:id', element: <OrderDetailView /> },
      { path: 'disputes', element: <DisputesView /> },
      { path: 'disputes/:id', element: <DisputeDetailView /> },
      { path: 'withdrawals', element: <WithdrawalsView /> },
      { path: 'withdrawals/:id', element: <WithdrawalDetailView /> },
      { path: 'support', element: <SupportView /> },
      { path: 'support/:id', element: <SupportDetailView /> },
      { path: 'reviews', element: <ReviewsView /> },
      { path: 'notifications', element: <NotificationsView /> },
      { path: 'ambulance', element: <AmbulanceView /> },
      { path: 'ambulance/:id', element: <AmbulanceDetailView /> },
      { path: 'diagnostics', element: <DiagnosticsView /> },
      { path: 'diagnostics/:id', element: <DiagnosticDetailView /> },
      { path: 'emergency', element: <EmergencyView /> },
      { path: 'emergency/:id', element: <EmergencyDetailView /> },
      { path: 'helping-hands', element: <HelpingHandsView /> },
      { path: 'helping-hands/:id', element: <HelpingHandDetailView /> },
      { path: 'appointments', element: <AppointmentsView /> },
      { path: 'appointments/:id', element: <AppointmentDetailView /> },
      { path: 'services', element: <ServicesView /> },
      { path: 'wallet', element: <WalletView /> },
      { path: 'profile', element: <ProfileView /> },
      { path: 'settings', element: <SettingsView /> },
    ],
  },
  { path: '404', element: <Page404 /> },
  { path: '*', element: <Page404 /> },
];
