import type { ReactNode } from 'react';

import { keyframes } from '@emotion/react';
import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';

import { DashboardContent } from 'src/layouts/dashboard';

import { fDate } from 'src/utils/format-time';
import { Iconify } from 'src/components/iconify';
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
  caregiver_payment_done: 'Caregiver Payments Done',
  platform_wallet_balance: 'Platform Wallet Balance',
  total_paid_revenue: 'Total Paid Revenue',
};

const MONEY_KEYS = ['platform_wallet_balance', 'total_paid_revenue'];

const KPI_ICONS: Record<string, { icon: string; color: string }> = {
  total_bookings: { icon: 'solar:calendar-bold-duotone', color: '#2563EB' },
  pending_payment: { icon: 'solar:hourglass-line-bold-duotone', color: '#F59E0B' },
  paid: { icon: 'solar:verified-check-bold-duotone', color: '#16A34A' },
  today_bookings: { icon: 'solar:calendar-mark-bold-duotone', color: '#0891B2' },
  weekly_bookings: { icon: 'solar:calendar-date-bold-duotone', color: '#7C3AED' },
  total_users: { icon: 'solar:users-group-rounded-bold-duotone', color: '#DB2777' },
  total_caregivers: { icon: 'solar:hand-heart-bold-duotone', color: '#E11D48' },
  caregiver_payment_done: { icon: 'solar:hand-money-bold-duotone', color: '#059669' },
  platform_wallet_balance: { icon: 'solar:wallet-money-bold-duotone', color: '#4F46E5' },
  total_paid_revenue: { icon: 'solar:graph-up-bold-duotone', color: '#0D9488' },
};

const KPI_GRID_SX = {
  display: 'grid',
  gap: 2,
  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(5, 1fr)' },
  mb: 3,
} as const;

const KPI_SKELETON_COUNT = 9;

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: none; }
`;

function enterSx(index: number) {
  return {
    animation: `${fadeUp} 640ms cubic-bezier(0.22, 1, 0.36, 1) both`,
    animationDelay: `${index * 60}ms`,
    '@media (prefers-reduced-motion: reduce)': { animation: 'none' },
  };
}

const CARD_SX = {
  borderRadius: 2,
  bgcolor: 'common.white',
  border: 1,
  borderColor: 'divider',
  boxShadow: 'none',
} as const;

const KPI_CARD_SX = {
  ...CARD_SX,
  p: 2.5,
  gap: 2,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  transition: 'transform 200ms ease, box-shadow 200ms ease',
  '&:hover': { transform: 'translateY(-2px)', boxShadow: '0 12px 24px -12px rgba(15, 23, 42, 0.18)' },
} as const;

const CHART_ANIMATION = {
  enabled: true,
  speed: 1000,
  animateGradually: { enabled: true, delay: 120 },
  dynamicAnimation: { enabled: true, speed: 450 },
};

type BookingsRow = { date: string; count: number };
type PaymentsRow = { date: string; paid: number; pending: number };

function isNumeric(value: unknown) {
  return typeof value === 'number' || (typeof value === 'string' && value.trim() !== '' && !Number.isNaN(Number(value)));
}

function dayLabel(value: string) {
  const formatted = fDate(value, 'DD MMM');
  return formatted === 'Invalid date' ? value : formatted;
}

function formatMoney(value: number) {
  return `৳${value.toLocaleString()}`;
}

function useCountUp(target: number, duration = 1000) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (window.matchMedia?.('(prefers-reduced-motion: reduce)').matches) {
      setValue(target);
      return undefined;
    }

    let frame = 0;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      setValue(progress === 1 ? target : target * (1 - (1 - progress) ** 3));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, duration]);

  return value;
}

function AnimatedNumber({ value, format }: { value: number; format?: (value: number) => string }) {
  const current = useCountUp(value);
  const display = current === value ? value : Math.round(current);
  return <>{format ? format(display) : display.toLocaleString()}</>;
}

function DashboardKpiSkeleton() {
  return (
    <Box sx={KPI_GRID_SX}>
      {Array.from({ length: KPI_SKELETON_COUNT }).map((_, index) => (
        <Card key={index} sx={KPI_CARD_SX}>
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width="62%" height={20} />
            <Skeleton variant="rounded" width="48%" height={36} sx={{ mt: 1 }} />
          </Box>
          <Skeleton variant="rounded" width={48} height={48} sx={{ borderRadius: 1.5 }} />
        </Card>
      ))}
    </Box>
  );
}

export default function DashboardView() {
  const dashboardQuery = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: () => adminDashboardService.getDashboard(),
  });

  const stats = dashboardQuery.data || ({} as Record<string, unknown>);
  const charts = (stats as any).charts || ({} as Record<string, unknown>);

  const normalizedStats: Record<string, unknown> = {
    ...stats,
    total_bookings: (stats as any).total_bookings ?? (stats as any).totalBookings,
    today_bookings: (stats as any).today_bookings ?? (stats as any).todayBookings,
    total_users: (stats as any).total_users ?? (stats as any).totalUsers,
    total_caregivers: (stats as any).total_caregivers ?? (stats as any).totalCaregivers,
  };

  const kpis = Object.entries(KPI_LABELS)
    .filter(([key]) => isNumeric(normalizedStats[key]))
    .map(([key, label]) => ({ key, label, value: Number(normalizedStats[key]) }));

  const bookingsLast7Days: BookingsRow[] = (charts as any).bookings_last_7_days || [];
  const paymentsLast7Days: PaymentsRow[] = (charts as any).payments_last_7_days || [];
  const hasBookings = bookingsLast7Days.length > 0;
  const hasPayments = paymentsLast7Days.length > 0;

  const isDashboardLoading =
    dashboardQuery.isLoading || (dashboardQuery.isFetching && !dashboardQuery.data);

  return (
    <DashboardContent>
      <PageHeader title="Dashboard" description="Nirapod healthcare administration overview" />

      {isDashboardLoading ? (
        <DashboardKpiSkeleton />
      ) : dashboardQuery.error ? (
        <ErrorState message={getErrorMessage(dashboardQuery.error)} onRetry={() => dashboardQuery.refetch()} />
      ) : !kpis.length ? (
        <EmptyState title="No dashboard statistics available" />
      ) : (
        <Box sx={KPI_GRID_SX}>
          {kpis.map((item, index) => {
            const { icon, color } = KPI_ICONS[item.key];
            return (
              <Card key={item.key} sx={[KPI_CARD_SX, enterSx(index)]}>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    {item.label}
                  </Typography>
                  <Typography variant="h4" sx={{ mt: 1, color: 'text.primary' }}>
                    <AnimatedNumber value={item.value} format={MONEY_KEYS.includes(item.key) ? formatMoney : undefined} />
                  </Typography>
                </Box>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    flexShrink: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: 1.5,
                    color,
                    bgcolor: `${color}1A`,
                  }}
                >
                  <Iconify icon={icon} width={26} />
                </Box>
              </Card>
            );
          })}
        </Box>
      )}

      {!isDashboardLoading && (hasBookings || hasPayments) && (
        <Grid container spacing={3}>
          {hasBookings && (
            <Grid size={{ xs: 12, md: hasPayments ? 6 : 12 }}>
              <BookingsChartCard rows={bookingsLast7Days} enterIndex={kpis.length} />
            </Grid>
          )}
          {hasPayments && (
            <Grid size={{ xs: 12, md: hasBookings ? 6 : 12 }}>
              <PaymentsChartCard rows={paymentsLast7Days} enterIndex={kpis.length + 1} />
            </Grid>
          )}
        </Grid>
      )}
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

function ChartCard({
  icon,
  color,
  title,
  subtitle,
  summary,
  enterIndex,
  children,
}: {
  icon: string;
  color: string;
  title: string;
  subtitle: string;
  summary: ReactNode;
  enterIndex: number;
  children: ReactNode;
}) {
  return (
    <Card sx={[CARD_SX, { p: 3, height: 1, display: 'flex', flexDirection: 'column' }, enterSx(enterIndex)]}>
      <Stack direction="row" alignItems="flex-start" spacing={1.5} sx={{ mb: 2.5 }}>
        <Box
          sx={{
            width: 44,
            height: 44,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 1.5,
            color,
            bgcolor: `${color}1A`,
          }}
        >
          <Iconify icon={icon} width={24} />
        </Box>
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Typography variant="subtitle1">{title}</Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {subtitle}
          </Typography>
        </Box>
        {summary}
      </Stack>
      <Box sx={{ flexGrow: 1 }}>{children}</Box>
    </Card>
  );
}

function LegendStat({ color, label, value }: { color: string; label: string; value: ReactNode }) {
  return (
    <Box sx={{ textAlign: 'right' }}>
      <Stack direction="row" alignItems="center" justifyContent="flex-end" spacing={0.75}>
        <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: color }} />
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {label}
        </Typography>
      </Stack>
      <Typography variant="subtitle1">{value}</Typography>
    </Box>
  );
}

function BookingsChartCard({ rows, enterIndex }: { rows: BookingsRow[]; enterIndex: number }) {
  const theme = useTheme();
  const color = theme.palette.primary.main;

  const data = rows.map((row) => Number(row.count) || 0);
  const total = data.reduce((sum, value) => sum + value, 0);
  const average = rows.length ? total / rows.length : 0;

  const options = useChart({
    chart: { animations: CHART_ANIMATION },
    colors: [color],
    stroke: { width: 3 },
    fill: {
      type: 'gradient',
      gradient: { shadeIntensity: 1, opacityFrom: 0.45, opacityTo: 0.02, stops: [0, 95, 100] },
    },
    markers: { size: 0, hover: { size: 6 } },
    xaxis: { categories: rows.map((row) => dayLabel(row.date)) },
    yaxis: { tickAmount: 4, labels: { formatter: (value: number) => `${Math.round(value)}` } },
    tooltip: { y: { formatter: (value: number) => `${value} bookings` } },
  });

  return (
    <ChartCard
      icon="solar:chart-2-bold-duotone"
      color={color}
      title="Bookings"
      subtitle="Last 7 days"
      enterIndex={enterIndex}
      summary={
        <Box sx={{ textAlign: 'right' }}>
          <Typography variant="h4">
            <AnimatedNumber value={total} />
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            ~{average.toFixed(1)} per day
          </Typography>
        </Box>
      }
    >
      <Chart type="area" series={[{ name: 'Bookings', data }]} options={options} sx={{ height: 300 }} />
    </ChartCard>
  );
}

function PaymentsChartCard({ rows, enterIndex }: { rows: PaymentsRow[]; enterIndex: number }) {
  const theme = useTheme();
  const paidColor = theme.palette.success.main;
  const pendingColor = theme.palette.warning.main;

  const paidData = rows.map((row) => Number(row.paid) || 0);
  const pendingData = rows.map((row) => Number(row.pending) || 0);
  const totalPaid = paidData.reduce((sum, value) => sum + value, 0);
  const totalPending = pendingData.reduce((sum, value) => sum + value, 0);

  const options = useChart({
    chart: { animations: CHART_ANIMATION },
    colors: [paidColor, pendingColor],
    stroke: { width: 2, colors: ['transparent'] },
    fill: { type: 'solid', opacity: 1 },
    plotOptions: { bar: { columnWidth: '52%', borderRadius: 6, borderRadiusApplication: 'end' } },
    xaxis: { categories: rows.map((row) => dayLabel(row.date)) },
    yaxis: { tickAmount: 4, labels: { formatter: (value: number) => `৳${Math.round(value).toLocaleString()}` } },
    tooltip: { shared: true, intersect: false, y: { formatter: (value: number) => formatMoney(value) } },
  });

  return (
    <ChartCard
      icon="solar:wallet-money-bold-duotone"
      color={paidColor}
      title="Payments"
      subtitle="Last 7 days"
      enterIndex={enterIndex}
      summary={
        <Stack direction="row" spacing={3}>
          <LegendStat color={paidColor} label="Paid" value={<AnimatedNumber value={totalPaid} format={formatMoney} />} />
          <LegendStat
            color={pendingColor}
            label="Pending"
            value={<AnimatedNumber value={totalPending} format={formatMoney} />}
          />
        </Stack>
      }
    >
      <Chart
        type="bar"
        series={[
          { name: 'Paid', data: paidData },
          { name: 'Pending', data: pendingData },
        ]}
        options={options}
        sx={{ height: 300 }}
      />
    </ChartCard>
  );
}
