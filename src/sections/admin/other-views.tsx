import { DashboardContent } from 'src/layouts/dashboard';
import { PageHeader } from 'src/components/page-header';
import { EmptyState } from 'src/components/page-states';

function Unavailable({ title }: { title: string }) {
  return (
    <DashboardContent>
      <PageHeader title={title} />
      <EmptyState title="This module is not part of the CareMate admin API." />
    </DashboardContent>
  );
}

export function RevenueView() {
  return <Unavailable title="Revenue" />;
}
export function EkycView() {
  return <Unavailable title="eKYC" />;
}
export function ServicesView() {
  return <Unavailable title="Services" />;
}
export function WalletView() {
  return <Unavailable title="Wallet" />;
}
export function AppointmentsView() {
  return <Unavailable title="Appointments" />;
}
