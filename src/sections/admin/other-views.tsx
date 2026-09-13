import { useMutation, useQuery } from '@tanstack/react-query';
import { useState } from 'react';

import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import { DashboardContent } from 'src/layouts/dashboard';
import { PageHeader } from 'src/components/page-header';
import { StatusBadge } from 'src/components/status-badge';
import { EmptyState, ErrorState, TableSkeleton } from 'src/components/page-states';
import { DataTable } from 'src/components/data-table';
import { useSnackbar } from 'src/components/snackbar';
import { useAuth } from 'src/contexts/AuthContext';
import { useResourceList } from 'src/hooks/use-resource-list';
import { appointmentsApi, revenueApi, usersApi, walletApi } from 'src/lib/api';
import * as authApi from 'src/lib/api/auth';
import { Chart, useChart } from 'src/components/chart';
import { asList, getErrorMessage, getRecordId, pickNumber, pickString } from 'src/lib/utils';
import { fDate } from 'src/utils/format-time';
import apiClient from 'src/lib/api/client';

export function RevenueView() {
  const query = useQuery({ queryKey: ['admin-revenue-page'], queryFn: () => revenueApi.get() });
  const rows = asList(query.data?.data ?? query.data);

  return (
    <DashboardContent maxWidth="xl">
      <PageHeader title="Revenue" description="Completed payment totals from the CareMate API" />
      {query.isLoading ? (
        <TableSkeleton />
      ) : query.error ? (
        <ErrorState message={getErrorMessage(query.error)} onRetry={() => query.refetch()} />
      ) : !rows.length ? (
        <EmptyState title="No revenue data available" />
      ) : (
        <Stack spacing={3}>
          <RevenueChart rows={rows} />
          <DataTable
            columns={[
              { id: 'date', label: 'Date', render: (row) => pickString(row, ['date']) },
              { id: 'transactions', label: 'Transactions' },
              { id: 'revenue', label: 'Revenue', render: (row) => `৳${pickString(row, ['revenue', 'amount'], '0')}` },
            ]}
            rows={rows}
            page={0}
            rowsPerPage={50}
            onPageChange={() => undefined}
            onRowsPerPageChange={() => undefined}
            getRowId={(row) => pickString(row, ['date', 'id'])}
            emptyTitle="No revenue transactions"
          />
        </Stack>
      )}
    </DashboardContent>
  );
}

function RevenueChart({ rows }: { rows: Record<string, unknown>[] }) {
  const categories = rows.map((row) => pickString(row, ['date', 'day']));
  const data = rows.map((row) => pickNumber(row, ['revenue', 'amount', 'total']) || 0);
  const options = useChart({
    xaxis: { categories },
    tooltip: { y: { formatter: (value: number) => `৳${value}` } },
  });

  return (
    <Card sx={{ p: 2.5 }}>
      <CardHeader title="Revenue chart" sx={{ px: 0, pt: 0 }} />
      <Chart type="line" series={[{ name: 'Revenue', data }]} options={options} sx={{ height: 320 }} />
    </Card>
  );
}

export function EkycView() {
  const list = useResourceList('ekyc-users', usersApi.list);
  return (
    <DashboardContent maxWidth="xl">
      <PageHeader title="eKYC" description="eKYC status is shown from user records. The webhook is backend-only and is not called here." />
      <DataTable
        columns={[
          { id: 'name', label: 'User' },
          { id: 'email', label: 'Email' },
          { id: 'phone', label: 'Phone' },
          {
            id: 'ekyc_status',
            label: 'eKYC',
            render: (row) => {
              const raw = row.ekyc_status;
              const label =
                raw === true || raw === 'true' || raw === 'APPROVED'
                  ? 'Approved'
                  : raw === false || raw === 'false' || raw === 'PENDING' || !raw
                    ? 'Pending'
                    : String(raw);
              return <StatusBadge value={String(label).toUpperCase()} />;
            },
          },
          { id: 'is_verified', label: 'Verified', render: (row) => <StatusBadge value={Boolean(row.is_verified)} /> },
        ]}
        rows={list.items}
        loading={list.isLoading}
        error={list.errorMessage}
        onRetry={() => list.refetch()}
        searchValue={list.search}
        onSearchChange={list.setSearch}
        page={list.page}
        rowsPerPage={list.rowsPerPage}
        onPageChange={list.setPage}
        onRowsPerPageChange={list.setRowsPerPage}
        serverMode
        hasNextPage={list.hasNextPage}
        getRowId={(row) => getRecordId(row)}
        emptyTitle="No users found"
        clientSearchKeys={['name', 'email', 'phone']}
      />
    </DashboardContent>
  );
}

export function ProfileView() {
  const { user, refreshProfile } = useAuth();
  const { showSnackbar } = useSnackbar();
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const mutation = useMutation({
    mutationFn: () => authApi.updateProfile({ name, email }),
    onSuccess: async () => {
      showSnackbar('Profile updated successfully', 'success');
      await refreshProfile();
    },
    onError: (error) => showSnackbar(getErrorMessage(error), 'error'),
  });

  return (
    <DashboardContent maxWidth="sm">
      <PageHeader title="Admin profile" />
      <Card sx={{ p: 3 }}>
        <Stack spacing={2}>
          <TextField label="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <TextField label="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextField label="Phone" value={user?.phone || ''} disabled />
          <TextField label="Role" value={user?.role || ''} disabled />
          <Button variant="contained" disabled={mutation.isPending} onClick={() => mutation.mutate()}>
            Save
          </Button>
        </Stack>
      </Card>
    </DashboardContent>
  );
}

export function SettingsView() {
  const { showSnackbar } = useSnackbar();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const mutation = useMutation({
    mutationFn: () => authApi.updatePassword({ currentPassword, newPassword }),
    onSuccess: () => showSnackbar('Password updated successfully', 'success'),
    onError: (error) => showSnackbar(getErrorMessage(error), 'error'),
  });

  return (
    <DashboardContent maxWidth="sm">
      <PageHeader title="Settings" description="Update the authenticated admin password" />
      <Card sx={{ p: 3 }}>
        <Stack spacing={2}>
          <TextField type="password" label="Current password" value={currentPassword} onChange={(e) => setCurrentPassword(e.target.value)} />
          <TextField type="password" label="New password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
          <Button
            variant="contained"
            disabled={mutation.isPending || !currentPassword || !newPassword}
            onClick={() => mutation.mutate()}
          >
            Update password
          </Button>
        </Stack>
      </Card>
    </DashboardContent>
  );
}

export function ServicesView() {
  const query = useQuery({
    queryKey: ['services'],
    queryFn: async () => {
      const response = await apiClient.get('/services/services');
      return asList(response.data);
    },
  });

  return (
    <DashboardContent maxWidth="xl">
      <PageHeader title="Services" />
      <DataTable
        columns={[
          { id: 'name', label: 'Name', render: (row) => pickString(row, ['name', 'title']) },
          { id: 'category', label: 'Category', render: (row) => pickString(row, ['category', 'type']) },
          { id: 'status', label: 'Status', render: (row) => <StatusBadge value={pickString(row, ['status'], '')} /> },
        ]}
        rows={query.data || []}
        loading={query.isLoading}
        error={query.error ? getErrorMessage(query.error) : null}
        onRetry={() => query.refetch()}
        page={0}
        rowsPerPage={20}
        onPageChange={() => undefined}
        onRowsPerPageChange={() => undefined}
        getRowId={(row) => getRecordId(row)}
        emptyTitle="No services found"
      />
    </DashboardContent>
  );
}

export function WalletView() {
  const list = useResourceList('wallet-transactions', walletApi.transactions);
  return (
    <DashboardContent maxWidth="xl">
      <PageHeader title="Wallet transactions" />
      <DataTable
        columns={[
          { id: 'id', label: 'ID' },
          { id: 'amount', label: 'Amount', render: (row) => pickString(row, ['amount']) },
          { id: 'type', label: 'Type', render: (row) => pickString(row, ['type', 'transaction_type']) },
          { id: 'status', label: 'Status', render: (row) => <StatusBadge value={pickString(row, ['status'], '')} /> },
          { id: 'created_at', label: 'Date', render: (row) => fDate(pickString(row, ['created_at'], '')) },
        ]}
        rows={list.items}
        loading={list.isLoading}
        error={list.errorMessage}
        onRetry={() => list.refetch()}
        page={list.page}
        rowsPerPage={list.rowsPerPage}
        onPageChange={list.setPage}
        onRowsPerPageChange={list.setRowsPerPage}
        serverMode
        hasNextPage={list.hasNextPage}
        getRowId={(row) => getRecordId(row)}
        emptyTitle="No wallet transactions"
      />
    </DashboardContent>
  );
}

export function AppointmentsView() {
  const list = useResourceList('appointments', appointmentsApi.list);
  return (
    <DashboardContent maxWidth="xl">
      <PageHeader title="Appointments" />
      <DataTable
        columns={[
          { id: 'id', label: 'ID' },
          { id: 'doctor', label: 'Doctor', render: (row) => pickString(row, ['doctor_name', 'doctor_id']) },
          { id: 'user_id', label: 'Patient' },
          { id: 'appointment_date', label: 'Date', render: (row) => fDate(pickString(row, ['appointment_date', 'date', 'created_at'], '')) },
          { id: 'status', label: 'Status', render: (row) => <StatusBadge value={pickString(row, ['status'], '')} /> },
        ]}
        rows={list.items}
        loading={list.isLoading}
        error={list.errorMessage}
        onRetry={() => list.refetch()}
        page={list.page}
        rowsPerPage={list.rowsPerPage}
        onPageChange={list.setPage}
        onRowsPerPageChange={list.setRowsPerPage}
        serverMode
        hasNextPage={list.hasNextPage}
        getRowId={(row) => getRecordId(row)}
        emptyTitle="No appointments found"
      />
    </DashboardContent>
  );
}
