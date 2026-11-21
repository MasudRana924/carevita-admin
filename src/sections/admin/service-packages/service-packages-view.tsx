import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import TableRow from '@mui/material/TableRow';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import TableContainer from '@mui/material/TableContainer';
import CircularProgress from '@mui/material/CircularProgress';

import { DashboardContent } from 'src/layouts/dashboard';
import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { PageHeader } from 'src/components/page-header';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { DetailSkeleton, EmptyState, ErrorState } from 'src/components/page-states';
import { StatusBadge } from 'src/components/status-badge';
import { useSnackbar } from 'src/components/snackbar';
import { servicePackagesApi } from 'src/lib/api';
import { getErrorMessage, pickNumber, pickString } from 'src/lib/utils';

import { PackageCreateDialog } from './package-create-dialog';
import { PackageEditDrawer } from './package-edit-drawer';
import {
  formatMoney,
  formatServiceType,
  type ServicePackageTab,
} from './package-constants';

// ----------------------------------------------------------------------

const TABS: { value: ServicePackageTab; label: string; icon: string }[] = [
  { value: 'ALL', label: 'All', icon: 'solar:clipboard-list-bold-duotone' },
  { value: 'HOME_CARE', label: 'Home Care', icon: 'solar:hand-heart-bold-duotone' },
  { value: 'HOSPITAL_ASSISTANCE', label: 'Outdoor Assistance', icon: 'solar:map-point-bold-duotone' },
];

export function ServicePackagesView() {
  const { showSnackbar } = useSnackbar();
  const queryClient = useQueryClient();

  const [tab, setTab] = useState<ServicePackageTab>('ALL');
  const [createOpen, setCreateOpen] = useState(false);
  const [editRow, setEditRow] = useState<Record<string, unknown> | null>(null);
  const [deactivateRow, setDeactivateRow] = useState<Record<string, unknown> | null>(null);
  const [showCatalog, setShowCatalog] = useState(false);

  const query = useQuery({
    queryKey: ['admin-service-packages', tab],
    queryFn: async () => {
      const params: Record<string, string | number | boolean | undefined> = {
        active_only: false,
      };
      if (tab !== 'ALL') params.service_type = tab;
      const result = await servicePackagesApi.list(params);
      return result.items;
    },
  });

  const catalogQuery = useQuery({
    queryKey: ['services-catalog'],
    queryFn: () => servicePackagesApi.catalog(),
    enabled: showCatalog,
  });

  const rows = useMemo(() => {
    const items = query.data || [];
    return [...items].sort((a, b) => {
      const orderA = pickNumber(a, ['sort_order']) ?? 0;
      const orderB = pickNumber(b, ['sort_order']) ?? 0;
      if (orderA !== orderB) return orderA - orderB;
      return pickString(a, ['code'], '').localeCompare(pickString(b, ['code'], ''));
    });
  }, [query.data]);

  const deactivateMutation = useMutation({
    mutationFn: async () => {
      if (!deactivateRow) return;
      const code = pickString(deactivateRow, ['code'], '');
      return servicePackagesApi.update(code, { is_active: false });
    },
    onSuccess: () => {
      showSnackbar('Package deactivated', 'success');
      setDeactivateRow(null);
      queryClient.invalidateQueries({ queryKey: ['admin-service-packages'] });
      queryClient.invalidateQueries({ queryKey: ['services-catalog'] });
    },
    onError: (error) => showSnackbar(getErrorMessage(error), 'error'),
  });

  const activateMutation = useMutation({
    mutationFn: (row: Record<string, unknown>) =>
      servicePackagesApi.update(pickString(row, ['code'], ''), { is_active: true }),
    onSuccess: () => {
      showSnackbar('Package activated', 'success');
      queryClient.invalidateQueries({ queryKey: ['admin-service-packages'] });
      queryClient.invalidateQueries({ queryKey: ['services-catalog'] });
    },
    onError: (error) => showSnackbar(getErrorMessage(error), 'error'),
  });

  return (
    <DashboardContent>
      <PageHeader
        title="Service Packages"
        description="Manage Home Care and Outdoor Assistance package base prices. Final user price = base_price + caregiver_hourly_rate × duration_hours + platform fee."
        breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }, { title: 'Service Packages' }]}
        action={
          <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<Iconify icon="solar:eye-bold" />}
              onClick={() => setShowCatalog((value) => !value)}
            >
              {showCatalog ? 'Hide catalog' : 'Public catalog'}
            </Button>
            <Button
              variant="contained"
              startIcon={<Iconify icon="solar:add-circle-bold" />}
              onClick={() => setCreateOpen(true)}
            >
              Upsert package
            </Button>
          </Stack>
        }
      />

      <Alert severity="info" sx={{ mb: 3 }}>
        Packages are disabled with <strong>is_active=false</strong> — there is no delete. New bookings use
        FULL_PREPAY (100%), so remaining_amount is 0.
      </Alert>

      {showCatalog && (
        <Card sx={{ mb: 3, p: 2.5, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
          <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1.5 }}>
            <Typography variant="subtitle1">Public catalog preview</Typography>
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              GET /services/catalog
            </Typography>
          </Stack>
          {catalogQuery.isLoading ? (
            <CircularProgress size={22} />
          ) : catalogQuery.error ? (
            <Typography variant="body2" color="error">
              {getErrorMessage(catalogQuery.error)}
            </Typography>
          ) : (
            <Box
              component="pre"
              sx={{
                m: 0,
                p: 2,
                maxHeight: 280,
                overflow: 'auto',
                borderRadius: 1.5,
                bgcolor: 'background.neutral',
                typography: 'caption',
                fontFamily: 'monospace',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {JSON.stringify(catalogQuery.data, null, 2)}
            </Box>
          )}
        </Card>
      )}

      <Card sx={{ border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
        <Tabs
          value={tab}
          onChange={(_event, value: ServicePackageTab) => setTab(value)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ px: 2, borderBottom: 1, borderColor: 'divider' }}
        >
          {TABS.map((item) => (
            <Tab
              key={item.value}
              value={item.value}
              label={item.label}
              icon={<Iconify icon={item.icon} width={18} />}
              iconPosition="start"
            />
          ))}
        </Tabs>

        {query.isLoading ? (
          <Box sx={{ p: 3 }}>
            <DetailSkeleton />
          </Box>
        ) : query.error ? (
          <Box sx={{ p: 3 }}>
            <ErrorState message={getErrorMessage(query.error)} onRetry={() => query.refetch()} />
          </Box>
        ) : !rows.length ? (
          <Box sx={{ p: 3 }}>
            <EmptyState
              title="No packages found"
              description="Upsert a Home Care or Outdoor Assistance package to get started."
            />
            <Stack alignItems="center" sx={{ mt: -4, pb: 4 }}>
              <Button variant="contained" onClick={() => setCreateOpen(true)}>
                Upsert package
              </Button>
            </Stack>
          </Box>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Code</TableCell>
                  <TableCell>Label</TableCell>
                  <TableCell>Type</TableCell>
                  <TableCell>Duration</TableCell>
                  <TableCell align="right">Base price</TableCell>
                  <TableCell>Active</TableCell>
                  <TableCell align="right">Sort</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => {
                  const code = pickString(row, ['code'], '');
                  const active = row.is_active !== false;
                  return (
                    <TableRow key={code} hover>
                      <TableCell sx={{ fontFamily: 'monospace', fontWeight: 600 }}>{code}</TableCell>
                      <TableCell>
                        <Typography variant="subtitle2">{pickString(row, ['label'])}</Typography>
                        {pickString(row, ['description'], '') !== '—' && (
                          <Typography variant="caption" sx={{ color: 'text.secondary' }} noWrap>
                            {pickString(row, ['description'])}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell>
                        <Label color={pickString(row, ['service_type']) === 'HOME_CARE' ? 'info' : 'warning'}>
                          {formatServiceType(pickString(row, ['service_type'], ''))}
                        </Label>
                      </TableCell>
                      <TableCell>
                        {pickNumber(row, ['duration_hours']) != null
                          ? `${pickNumber(row, ['duration_hours'])}h`
                          : '—'}
                      </TableCell>
                      <TableCell align="right" sx={{ fontWeight: 600 }}>
                        {formatMoney(pickNumber(row, ['base_price']))}
                      </TableCell>
                      <TableCell>
                        <StatusBadge value={active} label={active ? 'Active' : 'Inactive'} />
                      </TableCell>
                      <TableCell align="right">{pickNumber(row, ['sort_order']) ?? '—'}</TableCell>
                      <TableCell align="right">
                        <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                          <IconButton size="small" onClick={() => setEditRow(row)} title="Edit">
                            <Iconify icon="solar:pen-bold" width={18} />
                          </IconButton>
                          {active ? (
                            <IconButton
                              size="small"
                              color="warning"
                              onClick={() => setDeactivateRow(row)}
                              title="Deactivate"
                            >
                              <Iconify icon="solar:close-circle-bold" width={18} />
                            </IconButton>
                          ) : (
                            <IconButton
                              size="small"
                              color="success"
                              disabled={activateMutation.isPending}
                              onClick={() => activateMutation.mutate(row)}
                              title="Activate"
                            >
                              <Iconify icon="solar:check-circle-bold" width={18} />
                            </IconButton>
                          )}
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </Card>

      <PackageCreateDialog
        open={createOpen}
        defaultServiceType={tab === 'HOSPITAL_ASSISTANCE' ? 'HOSPITAL_ASSISTANCE' : 'HOME_CARE'}
        onClose={() => setCreateOpen(false)}
      />

      <PackageEditDrawer
        open={Boolean(editRow)}
        packageRow={editRow}
        onClose={() => setEditRow(null)}
      />

      <ConfirmDialog
        open={Boolean(deactivateRow)}
        onClose={() => !deactivateMutation.isPending && setDeactivateRow(null)}
        title="Deactivate package"
        content={`Disable ${pickString(deactivateRow, ['code'], 'this package')}? Apps will stop offering it. Existing bookings are unchanged.`}
        action={
          <Button
            color="warning"
            variant="contained"
            disabled={deactivateMutation.isPending}
            startIcon={
              deactivateMutation.isPending ? <CircularProgress size={16} color="inherit" /> : null
            }
            onClick={() => deactivateMutation.mutate()}
          >
            Deactivate
          </Button>
        }
      />
    </DashboardContent>
  );
}
