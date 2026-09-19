import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';
import { PageHeader } from 'src/components/page-header';
import { DetailSkeleton, ErrorState } from 'src/components/page-states';
import { InfoCard, InfoField } from 'src/components/record-fields';
import { StatusBadge } from 'src/components/status-badge';
import { LucideIcon } from 'src/components/lucide-icons';
import { useSnackbar } from 'src/components/snackbar';
import { usersApi } from 'src/lib/api';
import { getErrorMessage, getRecordId, pickString } from 'src/lib/utils';
import { fDateTime } from 'src/utils/format-time';

const STATUS_OPTIONS = ['active', 'blocked'];

function formatValue(value: unknown) {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

function findCachedUser(queryClient: ReturnType<typeof useQueryClient>, id: string) {
  const queries = queryClient.getQueriesData({ queryKey: ['admin-users'] });
  for (const [, data] of queries) {
    const items = (data as { items?: Record<string, unknown>[] } | undefined)?.items || [];
    const match = items.find((item) => getRecordId(item) === id);
    if (match) return match;
  }
  return undefined;
}

async function fetchUserById(id: string) {
  for (let page = 1; page <= 20; page += 1) {
    const result = await usersApi.list({ page, limit: 50 });
    const match = result.items.find((item) => getRecordId(item) === id);
    if (match) return match;
    if (result.items.length < 50) break;
  }
  return null;
}

export function UserDetailView() {
  const { id = '' } = useParams();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const editing = params.get('edit') === '1';
  const cachedUser = useMemo(() => findCachedUser(queryClient, id), [queryClient, id]);

  const query = useQuery({
    queryKey: ['admin-user', id],
    queryFn: () => fetchUserById(id),
    placeholderData: cachedUser,
  });

  const user = query.data || undefined;
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('');
  const [verified, setVerified] = useState('false');
  const [ekyc, setEkyc] = useState('false');

  useEffect(() => {
    if (!user) return;
    setRole(pickString(user, ['role'], ''));
    setStatus(pickString(user, ['status'], ''));
    setVerified(user.is_verified ? 'true' : 'false');
    setEkyc(user.ekyc_status ? 'true' : 'false');
  }, [user]);

  const mutation = useMutation({
    mutationFn: () => usersApi.updateStatus(id, status),
    onSuccess: () => {
      showSnackbar('User status updated successfully', 'success');
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-user', id] });
      navigate(`/users/${id}`, { replace: true });
    },
    onError: (error) => showSnackbar(getErrorMessage(error), 'error'),
  });

  const name = pickString(user, ['name', 'full_name'], 'User details');
  const email = pickString(user, ['email'], '');
  const phone = pickString(user, ['phone'], '');
  const photo = pickString(user, ['profile_photo', 'avatar', 'photo'], '');
  const created = pickString(user, ['created_at'], '');
  const updated = pickString(user, ['updated_at'], '');

  return (
    <DashboardContent maxWidth="xl">
      {query.isLoading && !user ? (
        <DetailSkeleton />
      ) : query.error || (!user && !query.isLoading) ? (
        <>
          <PageHeader title="User details" />
          <ErrorState
            message={query.error ? getErrorMessage(query.error) : 'User not found.'}
            onRetry={() => query.refetch()}
          />
        </>
      ) : (
        <>
          <PageHeader
            title={editing ? 'Edit user' : 'User details'}
            description={email !== '—' ? email : phone}
            action={
              <Stack direction="row" spacing={1.5}>
                <Button
                  variant="outlined"
                  color="inherit"
                  startIcon={<LucideIcon icon="eva:arrow-ios-back-fill" />}
                  onClick={() => navigate('/users')}
                >
                  Back
                </Button>
                {editing ? (
                  <>
                    <Button
                      variant="outlined"
                      color="inherit"
                      disabled={mutation.isPending}
                      onClick={() => navigate(`/users/${id}`)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      disabled={mutation.isPending}
                      onClick={() => mutation.mutate()}
                    >
                      {mutation.isPending ? 'Saving...' : 'Save changes'}
                    </Button>
                  </>
                ) : (
                  <Button
                    variant="contained"
                    startIcon={<LucideIcon icon="solar:pen-bold" />}
                    onClick={() => navigate(`/users/${id}?edit=1`)}
                  >
                    Edit
                  </Button>
                )}
              </Stack>
            }
          />

          <Stack spacing={3}>
            <Card
              sx={{
                p: 3,
                borderRadius: 2,
                border: '1px solid',
                borderColor: 'divider',
                boxShadow: 'none',
              }}
            >
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2.5} alignItems={{ sm: 'center' }}>
                <Avatar src={photo || undefined} alt={name} sx={{ width: 88, height: 88, fontSize: 32 }}>
                  {name.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography variant="h5">{name}</Typography>
                  <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
                    {[email !== '—' ? email : null, phone !== '—' ? phone : null].filter(Boolean).join('  ·  ') ||
                      'No contact details'}
                  </Typography>
                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1.5 }}>
                    <StatusBadge value={pickString(user, ['role'], '')} />
                    <StatusBadge value={pickString(user, ['status'], '')} />
                    <StatusBadge
                      value={Boolean(user?.is_verified)}
                      label={user?.is_verified ? 'Verified' : 'Unverified'}
                    />
                    <StatusBadge
                      value={Boolean(user?.ekyc_status)}
                      label={user?.ekyc_status ? 'eKYC verified' : 'eKYC pending'}
                    />
                  </Stack>
                </Box>
              </Stack>
            </Card>

            <Box
              sx={{
                display: 'grid',
                gap: 3,
                gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
              }}
            >
              <InfoCard title="Contact">
                <Box
                  sx={{
                    display: 'grid',
                    gap: 2.5,
                    gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                  }}
                >
                  <InfoField label="Name" value={name} />
                  <InfoField label="Email" value={email} />
                  <InfoField label="Phone" value={phone} />
                  <InfoField label="Language" value={pickString(user, ['language_preference'], '—')} />
                  <InfoField label="Emergency contact" value={formatValue(user?.emergency_contact)} />
                  <InfoField label="Address" value={formatValue(user?.address)} />
                </Box>
              </InfoCard>

              <InfoCard title="Account">
                {editing ? (
                  <Box sx={{ maxWidth: 320 }}>
                    <TextField
                      select
                      fullWidth
                      label="Status"
                      value={status}
                      onChange={(event) => setStatus(event.target.value)}
                    >
                      {STATUS_OPTIONS.map((item) => (
                        <MenuItem key={item} value={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: 'grid',
                      gap: 2.5,
                      gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                    }}
                  >
                    <InfoField label="Role" value={<StatusBadge value={pickString(user, ['role'], '')} />} />
                    <InfoField label="Status" value={<StatusBadge value={pickString(user, ['status'], '')} />} />
                    <InfoField
                      label="Email verified"
                      value={<StatusBadge value={Boolean(user?.is_verified)} label={user?.is_verified ? 'Verified' : 'Unverified'} />}
                    />
                    <InfoField
                      label="eKYC"
                      value={
                        <StatusBadge
                          value={Boolean(user?.ekyc_status)}
                          label={user?.ekyc_status ? 'Verified' : 'Pending'}
                        />
                      }
                    />
                    <InfoField label="Created" value={created ? fDateTime(created) : '—'} />
                    <InfoField label="Updated" value={updated ? fDateTime(updated) : '—'} />
                    <InfoField label="User ID" value={pickString(user, ['id'], id)} />
                  </Box>
                )}
              </InfoCard>
            </Box>
          </Stack>
        </>
      )}
    </DashboardContent>
  );
}
