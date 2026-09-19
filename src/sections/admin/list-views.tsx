import { DashboardContent } from 'src/layouts/dashboard';
import { PageHeader } from 'src/components/page-header';
import { EmptyState } from 'src/components/page-states';

export { BookingsView } from './bookings';
export { DisputesView } from './disputes';
export { WithdrawalsView } from './withdrawals';

function Unavailable({ title }: { title: string }) {
  return (
    <DashboardContent>
      <PageHeader title={title} />
      <EmptyState title="This module is not part of the CareMate admin API." />
    </DashboardContent>
  );
}

export function ProvidersView() {
  return <Unavailable title="Providers" />;
}
export function NursesView() {
  return <Unavailable title="Nurses" />;
}
export function DoctorsView() {
  return <Unavailable title="Doctors" />;
}
export function DocumentsView() {
  return <Unavailable title="Documents" />;
}
export function PaymentsView() {
  return <Unavailable title="Payments" />;
}
export function MedicinesView() {
  return <Unavailable title="Medicines" />;
}
export function OrdersView() {
  return <Unavailable title="Orders" />;
}
export function SupportView() {
  return <Unavailable title="Support" />;
}
export function ReviewsView() {
  return <Unavailable title="Reviews" />;
}
export function NotificationsView() {
  return <Unavailable title="Notifications" />;
}
export function AmbulanceView() {
  return <Unavailable title="Ambulance" />;
}
export function DiagnosticsView() {
  return <Unavailable title="Diagnostics" />;
}
export function EmergencyView() {
  return <Unavailable title="Emergency" />;
}
export function HelpingHandsView() {
  return <Unavailable title="Helping Hands" />;
}
