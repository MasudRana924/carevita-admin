import { useQuery } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';
import { adminDashboardService } from 'src/api/admin-services';
import { getErrorMessage } from 'src/lib/utils';
import { EmptyState, ErrorState } from 'src/components/page-states';
import { PageHeader } from 'src/components/page-header';
import { Chart, useChart } from 'src/components/chart';

const KPI_LABELS: Record<string, string> = {
  total_bookings: 'Total Bookings',
  pending_payment: 'Pending Payment',
  paid: 'Paid',
  today_bookings: 'Today Bookings',
  weekly_bookings: 'Weekly Bookings',
  total_users: 'Total Users',
  total_caregivers: 'Total Caregivers',
  caregiver_payment_done: 'Caregiver Payment Done',
  platform_wallet_balance: 'Platform Wallet Balance',
  total_paid_revenue: 'Total Paid Revenue',
};

const PIE_COLORS = ['#2065D1', '#00A76F', '#FFAB00', '#FF5630', '#7635DC', '#078DEE'];

const CARD_GRADIENTS = [
  'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
  'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
  'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
  'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
  'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
  'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
  'linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)',
  'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
];

const KPI_GRID_SX = {
  display: 'grid',
  gap: 2,
  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(5, 1fr)' },
  mb: 3,
} as const;

const KPI_SKELETON_COUNT = 14;

function getKpiCardSx(index: number) {
  return {
    p: 2.5,
    borderRadius: 2,
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    background: CARD_GRADIENTS[index % CARD_GRADIENTS.length],
    color: 'white',
  };
}

function isNumeric(value: unknown) {
  return typeof value === 'number' || (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value)));
}

function DashboardKpiSkeleton() {
  return (
    <Box sx={KPI_GRID_SX}>
      {Array.from({ length: KPI_SKELETON_COUNT }).map((_, index) => (
        <Card key={index} sx={getKpiCardSx(index)}>
          <Skeleton
            variant="text"
            width="62%"
            height={20}
            sx={{ bgcolor: 'rgba(255,255,255,0.38)' }}
          />
          <Skeleton
            variant="rounded"
            width="48%"
            height={36}
            sx={{ mt: 1, bgcolor: 'rgba(255,255,255,0.5)' }}
          />
        </Card>
      ))}
    </Box>
  );
}

export default function DashboardView() {
  const dashboardQuery = useQuery({ 
    queryKey: ['admin-dashboard'], 
    queryFn: () => adminDashboardService.getDashboard() 
  });

  const stats = dashboardQuery.data || {} as Record<string, unknown>;
  const charts = (stats as any).charts || {} as Record<string, unknown>;
  
  const kpis = Object.entries(KPI_LABELS)
    .filter(([key]) => isNumeric((stats as any)[key]))
    .map(([key, label]) => ({ key, label, value: Number((stats as any)[key]) }));

  const extraKpis = Object.entries(stats)
    .filter(
      ([key, value]) =>
        isNumeric(value) && !KPI_LABELS[key] && !['page', 'limit', 'total', 'charts'].includes(key)
    )
    .map(([key, value]) => ({
      key,
      label: key.replace(/_/g, ' ').replace(/([A-Z])/g, ' $1'),
      value: Number(value),
    }));

  const allKpis = [...kpis, ...extraKpis];
  
  // Extract chart data from API response
  const bookingsLast7Days = (charts as any).bookings_last_7_days || [] as Array<{ date: string; count: number }>;
  const paymentsLast7Days = (charts as any).payments_last_7_days || [] as Array<{ date: string; paid: number; pending: number }>;

  const bookingStatusData = (() => {
    // Since we don't have individual booking data, create mock data for demo
    return [
      { name: 'Confirmed', value: 45 },
      { name: 'Pending', value: 25 },
      { name: 'Completed', value: 30 },
    ];
  })();

  const isDashboardLoading =
    dashboardQuery.isLoading || (dashboardQuery.isFetching && !dashboardQuery.data);

  return (
    <DashboardContent>
      <PageHeader title="Dashboard" description="CareMate healthcare administration overview" />

      {isDashboardLoading ? (
        <DashboardKpiSkeleton />
      ) : dashboardQuery.error ? (
        <ErrorState message={getErrorMessage(dashboardQuery.error)} onRetry={() => dashboardQuery.refetch()} />
      ) : !allKpis.length ? (
        <EmptyState title="No dashboard statistics available" />
      ) : (
        <Box sx={KPI_GRID_SX}>
          {allKpis.map((item, index) => (
            <Card
              key={item.key}
              sx={getKpiCardSx(index)}
            >
              <Typography variant="body2" sx={{ color: 'rgba(255,255,255,0.9)' }}>
                {item.label}
              </Typography>
              <Typography variant="h4" sx={{ mt: 1, color: 'white' }}>
                {item.key.toLowerCase().includes('revenue') ? `৳${item.value.toLocaleString()}` : item.value.toLocaleString()}
              </Typography>
            </Card>
          ))}
        </Box>
      )}

      {!isDashboardLoading && bookingsLast7Days.length > 0 && (
        <BookingsLineCard rows={bookingsLast7Days} />
      )}

      {!isDashboardLoading && paymentsLast7Days.length > 0 && (
        <PaymentsBarCard rows={paymentsLast7Days} />
      )}

      {!isDashboardLoading && bookingStatusData.length > 1 && (
        <BookingPieCard data={bookingStatusData} />
      )}
    </DashboardContent>
  );
}

function BookingsLineCard({ rows }: { rows: Array<{ date: string; count: number }> }) {
  const categories = rows.map((row) => row.date);
  const data = rows.map((row) => row.count);
  const options = useChart({
    xaxis: { categories },
    tooltip: { y: { formatter: (value: number) => `${value} bookings` } },
  });

  return (
    <Card sx={{ p: 2.5, mb: 3 }}>
      <CardHeader title="Bookings (Last 7 Days)" sx={{ px: 0, pt: 0 }} />
      <Chart type="line" series={[{ name: 'Bookings', data }]} options={options} sx={{ height: 320 }} />
    </Card>
  );
}

function BookingPieCard({ data }: { data: Array<{ name: string; value: number }> }) {
  const options = useChart({
    labels: data.map((item) => item.name),
    colors: PIE_COLORS,
    legend: { show: true },
  });

  return (
    <Card sx={{ p: 2.5, mb: 3 }}>
      <CardHeader title="Recent booking status distribution" sx={{ px: 0, pt: 0 }} />
      <Chart type="pie" series={data.map((item) => item.value)} options={options} sx={{ height: 280 }} />
    </Card>
  );
}

function PaymentsBarCard({ rows }: { rows: Array<{ date: string; paid: number; pending: number }> }) {
  const categories = rows.map((row) => row.date);
  const paidData = rows.map((row) => row.paid);
  const pendingData = rows.map((row) => row.pending);
  const options = useChart({
    xaxis: { categories },
    tooltip: { y: { formatter: (value: number) => `৳${value}` } },
    plotOptions: { bar: { columnWidth: '40%' } },
  });

  return (
    <Card sx={{ p: 2.5, mb: 3 }}>
      <CardHeader title="Payments (Last 7 Days)" sx={{ px: 0, pt: 0 }} />
      <Chart type="bar" series={[{ name: 'Paid', data: paidData }, { name: 'Pending', data: pendingData }]} options={options} sx={{ height: 280 }} />
    </Card>
  );
}
