import { DashboardContent } from 'src/layouts/dashboard';
import { PageHeader } from 'src/components/page-header';
import { EmptyState } from 'src/components/page-states';

export { UserDetailView } from './user-detail-view';
export { BookingDetailView } from './bookings';

function Unavailable({ title }: { title: string }) {
  return (
    <DashboardContent>
      <PageHeader title={title} />
      <EmptyState title="This detail screen is not part of the CareMate admin API." />
    </DashboardContent>
  );
}

export function ProviderDetailView() {
  return <Unavailable title="Provider details" />;
}
export function DoctorDetailView() {
  return <Unavailable title="Doctor details" />;
}
export function PaymentDetailView() {
  return <Unavailable title="Payment details" />;
}
export function HospitalDetailView() {
  return <Unavailable title="Hospital details" />;
}
export function HospitalFormView() {
  return <Unavailable title="Hospital form" />;
}
export function MedicineFormView() {
  return <Unavailable title="Medicine form" />;
}
export function OrderDetailView() {
  return <Unavailable title="Order details" />;
}
export function DisputeDetailView() {
  return <Unavailable title="Dispute details" />;
}
export function WithdrawalDetailView() {
  return <Unavailable title="Withdrawal details" />;
}
export function SupportDetailView() {
  return <Unavailable title="Support ticket" />;
}
export function AmbulanceDetailView() {
  return <Unavailable title="Ambulance booking" />;
}
export function DiagnosticDetailView() {
  return <Unavailable title="Diagnostic booking" />;
}
export function EmergencyDetailView() {
  return <Unavailable title="Emergency request" />;
}
export function HelpingHandDetailView() {
  return <Unavailable title="Helping hand details" />;
}
export function AppointmentDetailView() {
  return <Unavailable title="Appointment details" />;
}
