import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import Skeleton from '@mui/material/Skeleton';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';
import CardActionArea from '@mui/material/CardActionArea';
import InputAdornment from '@mui/material/InputAdornment';
import TableContainer from '@mui/material/TableContainer';
import TablePagination from '@mui/material/TablePagination';

import { RouterLink } from 'src/routes/components';
import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { TableHeadCustom } from 'src/components/table';
import { PageHeader } from 'src/components/page-header';
import { StatusBadge } from 'src/components/status-badge';
import { EmptyState, ErrorState, TableSkeleton } from 'src/components/page-states';
import { useDebouncedValue } from 'src/hooks/use-resource-list';
import { adminPaymentsService } from 'src/api/admin-services';
import { getErrorMessage } from 'src/lib/utils';

import type { AdminPayment, PaymentsQueryParams, PaymentsSummary } from 'src/api/admin-types';

import { SendPaymentDialog } from './send-payment-dialog';
import { PayoutStatusBadge } from './payout-status-badge';
import { PaymentDetailDrawer } from './payment-detail-drawer';
import {
  DEFAULT_PAGE_SIZE,
  DEFAULT_PAYMENTS_TAB,
  PAGE_SIZE_OPTIONS,
  PAYMENTS_LIST_QUERY_KEY,
  PAYMENT_STATUS_OPTIONS,
  PAYMENT_TABS,
  type PaymentsTab,
  fDateTimeOrDash,
  formatBDT,
} from './payment-utils';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
  { id: 'booking_number', label: 'Booking #' },
  { id: 'user', label: 'User', minWidth: 150 },
  { id: 'caregiver', label: 'Caregiver', minWidth: 150 },
  { id: 'amount', label: 'Paid', align: 'right' },
  { id: 'platform_fee', label: 'Platform fee', align: 'right' },
  { id: 'caregiver_amount', label: 'Caregiver amount', align: 'right', minWidth: 140 },
  { id: 'status', label: 'Payment status' },
  { id: 'payout_status', label: 'Payout status', minWidth: 150 },
  { id: 'paid_at', label: 'Paid at', minWidth: 150 },
  { id: 'action', label: 'Action', align: 'right', minWidth: 220 },
];

const CARD_SX = {
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'divider',
  boxShadow: 'none',
} as const;

type ParamPatch = Record<string, string | number | null | undefined>;

// ----------------------------------------------------------------------

export function PaymentsView() {
  const [searchParams, setSearchParams] = useSearchParams();

  const tabParam = searchParams.get('tab');
  const tab: PaymentsTab = PAYMENT_TABS.some((item) => item.value === tabParam)
    ? (tabParam as PaymentsTab)
    : DEFAULT_PAYMENTS_TAB;
  const activeTab = PAYMENT_TABS.find((item) => item.value === tab)!;
  const urlSearch = searchParams.get('search') ?? '';
  const dateFrom = searchParams.get('date_from') ?? '';
  const dateTo = searchParams.get('date_to') ?? '';
  const status = searchParams.get('status') ?? '';
  const page = Math.max(1, Number(searchParams.get('page')) || 1);
  const limitParam = Number(searchParams.get('limit'));
  const limit = PAGE_SIZE_OPTIONS.includes(limitParam) ? limitParam : DEFAULT_PAGE_SIZE;
  const viewId = searchParams.get('view');

  const updateParams = useCallback(
    (patch: ParamPatch, resetPage = true) => {
      setSearchParams(
        (previous) => {
          const next = new URLSearchParams(previous);
          Object.entries(patch).forEach(([key, value]) => {
            if (value === null || value === undefined || value === '') next.delete(key);
            else next.set(key, String(value));
          });
          if (resetPage && !('page' in patch)) next.delete('page');
          return next;
        },
        { replace: true }
      );
    },
    [setSearchParams]
  );

  const [searchInput, setSearchInput] = useState(urlSearch);
  const debouncedSearch = useDebouncedValue(searchInput.trim(), 400);

  useEffect(() => {
    if (debouncedSearch !== urlSearch) updateParams({ search: debouncedSearch });
    // Only push typed input to the URL; URL changes are synced back below.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch]);

  useEffect(() => {
    setSearchInput((current) => (current.trim() === urlSearch ? current : urlSearch));
  }, [urlSearch]);

  const params: PaymentsQueryParams = {
    payout_status: activeTab.payoutStatus,
    status: (status || undefined) as PaymentsQueryParams['status'],
    search: urlSearch || undefined,
    date_from: dateFrom || undefined,
    date_to: dateTo || undefined,
    page,
    limit,
  };

  const query = useQuery({
    queryKey: [...PAYMENTS_LIST_QUERY_KEY, params],
    queryFn: () => adminPaymentsService.getPayments(params),
    placeholderData: keepPreviousData,
    staleTime: 15_000,
  });

  const rows = useMemo(() => query.data?.data ?? [], [query.data]);
  const pagination = query.data?.meta;
  const summary = query.data?.summary ?? null;

  useEffect(() => {
    if (query.isFetching || !pagination) return;
    if (!rows.length && page > 1 && pagination.totalPages > 0 && page > pagination.totalPages) {
      updateParams({ page: pagination.totalPages }, false);
    }
  }, [query.isFetching, rows.length, page, pagination, updateParams]);

  const [sendTarget, setSendTarget] = useState<AdminPayment | null>(null);

  const hasFilters = Boolean(urlSearch || dateFrom || dateTo || status);

  const clearFilters = () => {
    setSearchInput('');
    updateParams({ search: null, date_from: null, date_to: null, status: null });
  };

  const openDetail = (row: AdminPayment) => updateParams({ view: row.id }, false);
  const closeDetail = () => updateParams({ view: null }, false);

  const renderBody = () => {
    if (query.isLoading) {
      return (
        <TableRow>
          <TableCell colSpan={TABLE_HEAD.length} sx={{ p: 0 }}>
            <TableSkeleton rows={6} />
          </TableCell>
        </TableRow>
      );
    }

    if (query.error) {
      return (
        <TableRow>
          <TableCell colSpan={TABLE_HEAD.length}>
            <ErrorState message={getErrorMessage(query.error)} onRetry={() => query.refetch()} />
          </TableCell>
        </TableRow>
      );
    }

    if (!rows.length) {
      return (
        <TableRow>
          <TableCell colSpan={TABLE_HEAD.length}>
            {tab === 'ready' && !hasFilters ? (
              <EmptyState title="No caregiver is waiting for payment." />
            ) : (
              <EmptyState
                title="No payments found"
                description="Try another tab or clear the filters."
              />
            )}
          </TableCell>
        </TableRow>
      );
    }

    return rows.map((row) => (
      <TableRow hover key={row.id}>
        <TableCell>
          {row.booking_id ? (
            <Link
              component={RouterLink}
              href={`/bookings/${row.booking_id}`}
              underline="hover"
              sx={{ fontWeight: 600, whiteSpace: 'nowrap' }}
            >
              {row.booking_number || row.booking_id}
            </Link>
          ) : (
            row.booking_number || '—'
          )}
        </TableCell>
        <TableCell>
          <NameAndPhone name={row.user_name} phone={row.user_phone} />
        </TableCell>
        <TableCell>
          <NameAndPhone name={row.caregiver_name} phone={row.caregiver_phone} />
        </TableCell>
        <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
          <Typography variant="body2">{formatBDT(row.amount)}</Typography>
          {Number(row.refunded_amount) > 0 && (
            <Typography variant="caption" sx={{ color: 'error.main', display: 'block' }}>
              refunded {formatBDT(row.refunded_amount)}
            </Typography>
          )}
        </TableCell>
        <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
          {formatBDT(row.platform_fee)}
        </TableCell>
        <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
          <Typography variant="subtitle2">{formatBDT(row.caregiver_amount)}</Typography>
        </TableCell>
        <TableCell>
          <StatusBadge value={row.status} />
        </TableCell>
        <TableCell>
          <PayoutStatusBadge status={row.payout_status} />
        </TableCell>
        <TableCell sx={{ whiteSpace: 'nowrap' }}>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {fDateTimeOrDash(row.paid_at)}
          </Typography>
        </TableCell>
        <TableCell align="right">
          <Stack direction="row" spacing={1} alignItems="center" justifyContent="flex-end">
            <PayoutAction row={row} onSend={setSendTarget} />
            <Button size="small" color="inherit" variant="outlined" onClick={() => openDetail(row)}>
              View
            </Button>
          </Stack>
        </TableCell>
      </TableRow>
    ));
  };

  return (
    <DashboardContent maxWidth="xl">
      <PageHeader
        title="Payments"
        description="Every user payment (new bookings are FULL_PREPAY — no remaining balance to collect), and caregiver payouts after service ends."
        breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }, { title: 'Payments' }]}
      />

      <SummaryCards
        summary={summary}
        loading={query.isLoading}
        onReadyClick={() => updateParams({ tab: null })}
      />

      <Card sx={CARD_SX}>
        <Tabs
          value={tab}
          onChange={(_event, value: PaymentsTab) =>
            updateParams({ tab: value === DEFAULT_PAYMENTS_TAB ? null : value })
          }
          variant="scrollable"
          scrollButtons="auto"
          sx={{ px: 2.5, borderBottom: 1, borderColor: 'divider' }}
        >
          {PAYMENT_TABS.map((item) => (
            <Tab
              key={item.value}
              value={item.value}
              label={item.label}
              iconPosition="end"
              icon={
                item.value === 'ready' && summary && summary.ready_count > 0 ? (
                  <Label variant="filled" color="warning" sx={{ ml: 1 }}>
                    {summary.ready_count > 99 ? '99+' : summary.ready_count}
                  </Label>
                ) : undefined
              }
            />
          ))}
        </Tabs>

        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2}
          alignItems={{ md: 'center' }}
          sx={{ p: 2.5 }}
        >
          <TextField
            size="small"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Booking #, trxID, user or caregiver name / phone"
            sx={{ minWidth: { md: 360 } }}
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Iconify
                      icon="solar:magnifer-linear"
                      width={18}
                      sx={{ color: 'text.disabled' }}
                    />
                  </InputAdornment>
                ),
              },
            }}
          />
          <TextField
            size="small"
            type="date"
            label="From"
            value={dateFrom}
            onChange={(event) => updateParams({ date_from: event.target.value })}
            slotProps={{ inputLabel: { shrink: true }, htmlInput: { max: dateTo || undefined } }}
            sx={{ minWidth: 170 }}
          />
          <TextField
            size="small"
            type="date"
            label="To"
            value={dateTo}
            onChange={(event) => updateParams({ date_to: event.target.value })}
            slotProps={{ inputLabel: { shrink: true }, htmlInput: { min: dateFrom || undefined } }}
            sx={{ minWidth: 170 }}
          />
          <TextField
            select
            size="small"
            label="Payment status"
            value={status}
            onChange={(event) => updateParams({ status: event.target.value })}
            slotProps={{ select: { displayEmpty: true }, inputLabel: { shrink: true } }}
            sx={{ minWidth: 200 }}
          >
            {PAYMENT_STATUS_OPTIONS.map((option) => (
              <MenuItem key={option.value || 'default'} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField>
          <Box sx={{ flexGrow: 1 }} />
          {hasFilters && (
            <Button color="error" variant="outlined" onClick={clearFilters} sx={{ flexShrink: 0 }}>
              Clear filters
            </Button>
          )}
        </Stack>

        <TableContainer
          sx={{ overflowX: 'auto', opacity: query.isFetching && !query.isLoading ? 0.6 : 1 }}
        >
          <Table sx={{ minWidth: 1400 }}>
            <TableHeadCustom headLabel={TABLE_HEAD} />
            <TableBody>{renderBody()}</TableBody>
          </Table>
        </TableContainer>

        <TablePagination
          component="div"
          page={Math.max(0, page - 1)}
          count={pagination?.total ?? 0}
          rowsPerPage={limit}
          rowsPerPageOptions={PAGE_SIZE_OPTIONS}
          onPageChange={(_event, next) => updateParams({ page: next + 1 }, false)}
          onRowsPerPageChange={(event) =>
            updateParams({ limit: parseInt(event.target.value, 10), page: null })
          }
        />
      </Card>

      <PaymentDetailDrawer
        paymentId={viewId}
        initialRow={rows.find((row) => row.id === viewId)}
        onClose={closeDetail}
        onSendPayment={setSendTarget}
      />

      <SendPaymentDialog payment={sendTarget} onClose={() => setSendTarget(null)} />
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

function NameAndPhone({ name, phone }: { name?: string | null; phone?: string | null }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="subtitle2" noWrap>
        {name || '—'}
      </Typography>
      {phone && (
        <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
          {phone}
        </Typography>
      )}
    </Box>
  );
}

function PayoutAction({ row, onSend }: { row: AdminPayment; onSend: (row: AdminPayment) => void }) {
  if (row.payout_status === 'READY_FOR_PAYOUT') {
    if (row.payout_frozen) {
      return (
        <Stack direction="row" spacing={1} alignItems="center">
          <Label color="error" variant="soft">
            Frozen
          </Label>
          <Tooltip
            title={
              <>
                Payout is frozen by a safety incident. Resolve it in{' '}
                <Link
                  component={RouterLink}
                  href="/safety-incidents"
                  color="inherit"
                  underline="always"
                >
                  Safety incidents
                </Link>{' '}
                first.
              </>
            }
          >
            <span>
              <Button size="small" variant="contained" disabled sx={{ whiteSpace: 'nowrap' }}>
                Send payment
              </Button>
            </span>
          </Tooltip>
        </Stack>
      );
    }

    return (
      <Button
        size="small"
        variant="contained"
        onClick={() => onSend(row)}
        sx={{ whiteSpace: 'nowrap' }}
      >
        Send payment
      </Button>
    );
  }

  if (row.payout_status === 'PAID_TO_CAREGIVER') {
    return (
      <Typography variant="caption" sx={{ color: 'success.dark', textAlign: 'right' }}>
        Paid · {fDateTimeOrDash(row.paid_out_at)} · {row.payout_trx_id || '—'}
      </Typography>
    );
  }

  return null;
}

function SummaryCards({
  summary,
  loading,
  onReadyClick,
}: {
  summary: PaymentsSummary | null;
  loading: boolean;
  onReadyClick: () => void;
}) {
  const cards = [
    {
      key: 'ready',
      title: 'Ready to pay',
      icon: 'solar:hand-money-bold-duotone',
      color: '#F59E0B',
      value: summary ? formatBDT(summary.ready_amount) : '—',
      caption: summary
        ? `${summary.ready_count} booking${summary.ready_count === 1 ? '' : 's'}`
        : '',
      onClick: onReadyClick,
    },
    {
      key: 'paid',
      title: 'Paid to caregivers',
      icon: 'solar:wallet-money-bold-duotone',
      color: '#16A34A',
      value: summary ? formatBDT(summary.paid_amount) : '—',
      caption: summary ? `${summary.paid_count} payout${summary.paid_count === 1 ? '' : 's'}` : '',
    },
    {
      key: 'fee',
      title: 'Platform fee earned',
      icon: 'solar:graph-up-bold-duotone',
      color: '#4F46E5',
      value: summary ? formatBDT(summary.platform_fee_earned) : '—',
      caption: '',
    },
  ];

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
        mb: 3,
      }}
    >
      {cards.map((card) => {
        const body = (
          <Stack direction="row" alignItems="center" spacing={2} sx={{ p: 2.5 }}>
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                {card.title}
              </Typography>
              {loading ? (
                <Skeleton variant="text" width="60%" height={40} />
              ) : (
                <Typography variant="h4" sx={{ mt: 0.5 }}>
                  {card.value}
                </Typography>
              )}
              {card.caption && !loading && (
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  {card.caption}
                </Typography>
              )}
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
                color: card.color,
                bgcolor: `${card.color}1A`,
              }}
            >
              <Iconify icon={card.icon} width={26} />
            </Box>
          </Stack>
        );

        return (
          <Card key={card.key} sx={CARD_SX}>
            {card.onClick ? <CardActionArea onClick={card.onClick}>{body}</CardActionArea> : body}
          </Card>
        );
      })}
    </Box>
  );
}
