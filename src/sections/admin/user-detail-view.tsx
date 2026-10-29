import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';
import { PageHeader } from 'src/components/page-header';
import { DetailSkeleton, ErrorState } from 'src/components/page-states';
import { InfoField } from 'src/components/record-fields';
import { DetailRow, InfoTile, ProfileHero, SectionCard } from 'src/components/detail-ui';
import { StatusBadge } from 'src/components/status-badge';
import { Iconify } from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { usersApi } from 'src/lib/api';
import { adminConversationsService } from 'src/api/admin-services';
import { getErrorMessage, getRecordId, pickString } from 'src/lib/utils';
import { fDate, fDateTime } from 'src/utils/format-time';

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

  const messageUser = useMutation({
    mutationFn: () => adminConversationsService.getConversationByUser(id),
    onSuccess: (conversation) => navigate(`/support-chat/${conversation.id}`),
    onError: (error) => showSnackbar(getErrorMessage(error, 'Failed to open conversation'), 'error'),
  });

  const name = pickString(user, ['name', 'full_name'], 'User details');
  const email = pickString(user, ['email'], '');
  const phone = pickString(user, ['phone'], '');
  const photo = pickString(user, ['profile_photo', 'avatar', 'photo'], '');
  const created = pickString(user, ['created_at'], '');
  const updated = pickString(user, ['updated_at'], '');

  const userId = pickString(user, ['id'], id);
  const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Users', href: '/users' },
    { title: user ? name : 'User details' },
  ];

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(userId);
      showSnackbar('User ID copied', 'success');
    } catch {
      showSnackbar('Could not copy the ID', 'error');
    }
  };

  return (
    <DashboardContent>
      {query.isLoading && !user ? (
        <DetailSkeleton />
      ) : query.error || (!user && !query.isLoading) ? (
        <>
          <PageHeader title="User details" breadcrumbs={breadcrumbs} />
          <ErrorState
            message={query.error ? getErrorMessage(query.error) : 'User not found.'}
            onRetry={() => query.refetch()}
          />
        </>
      ) : (
        <>
          <PageHeader title={editing ? 'Edit user' : 'User details'} breadcrumbs={breadcrumbs} />

          <Stack spacing={3}>
            <ProfileHero
              avatarSrc={photo}
              name={name}
              subtitle={
                [email !== '—' ? email : null, phone !== '—' ? phone : null].filter(Boolean).join('  ·  ') ||
                'No contact details'
              }
              badges={
                <>
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
                </>
              }
              actions={
                editing ? (
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
                      startIcon={<Iconify icon="solar:diskette-bold" />}
                      onClick={() => mutation.mutate()}
                    >
                      {mutation.isPending ? 'Saving...' : 'Save changes'}
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      variant="outlined"
                      startIcon={<Iconify icon="solar:chat-round-dots-bold" width={18} />}
                      disabled={messageUser.isPending}
                      onClick={() => messageUser.mutate()}
                    >
                      {messageUser.isPending ? 'Opening...' : 'Message user'}
                    </Button>
                    <Button
                      variant="contained"
                      startIcon={<Iconify icon="solar:pen-bold" />}
                      onClick={() => navigate(`/users/${id}?edit=1`)}
                    >
                      Edit
                    </Button>
                  </>
                )
              }
              tiles={
                <>
                  <InfoTile icon="solar:letter-bold-duotone" label="Email" value={email || '—'} />
                  <InfoTile icon="solar:phone-bold-duotone" label="Phone" value={phone || '—'} />
                  <InfoTile
                    icon="solar:calendar-bold-duotone"
                    label="Member since"
                    value={created ? fDate(created) : '—'}
                  />
                  <InfoTile
                    icon="solar:card-bold-duotone"
                    label="User ID"
                    value={userId}
                    action={
                      <Tooltip title="Copy ID">
                        <IconButton size="small" onClick={handleCopyId}>
                          <Iconify icon="solar:copy-linear" width={16} />
                        </IconButton>
                      </Tooltip>
                    }
                  />
                </>
              }
            />

            <Grid container spacing={3}>
              <Grid size={{ xs: 12, lg: 7 }}>
                <SectionCard
                  icon="solar:user-id-bold-duotone"
                  color="primary"
                  title="Personal details"
                  subtitle="Contact information shared by the user"
                >
                  <Box sx={{ display: 'grid', gap: 2.5, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
                    <InfoField label="Full name" value={name} />
                    <InfoField label="Email" value={email} />
                    <InfoField label="Phone" value={phone} />
                    <InfoField label="Language" value={pickString(user, ['language_preference'], '—')} />
                    <InfoField label="Emergency contact" value={formatValue(user?.emergency_contact)} />
                    <InfoField label="Address" value={formatValue(user?.address)} />
                  </Box>
                </SectionCard>
              </Grid>

              <Grid size={{ xs: 12, lg: 5 }}>
                <SectionCard
                  icon="solar:shield-user-bold-duotone"
                  color="info"
                  title="Account"
                  subtitle={editing ? 'Change the account status' : 'Role, verification and activity'}
                >
                  {editing ? (
                    <Stack spacing={1.5}>
                      {STATUS_OPTIONS.map((item) => {
                        const active = status === item;
                        const tone = item === 'blocked' ? 'error' : 'success';
                        return (
                          <Box
                            key={item}
                            role="radio"
                            aria-checked={active}
                            tabIndex={0}
                            onClick={() => setStatus(item)}
                            onKeyDown={(event) => {
                              if (event.key === 'Enter' || event.key === ' ') setStatus(item);
                            }}
                            sx={{
                              p: 2,
                              gap: 1.5,
                              display: 'flex',
                              alignItems: 'center',
                              cursor: 'pointer',
                              borderRadius: 1.5,
                              border: '1px solid',
                              borderColor: active ? `${tone}.main` : 'divider',
                              bgcolor: active ? `${tone}.lighter` : 'transparent',
                              transition: 'all 160ms ease',
                            }}
                          >
                            <Iconify
                              icon={item === 'blocked' ? 'solar:forbidden-circle-bold' : 'solar:check-circle-bold'}
                              width={24}
                              sx={{ color: active ? `${tone}.main` : 'text.disabled' }}
                            />
                            <Box sx={{ flexGrow: 1 }}>
                              <Typography variant="subtitle2" sx={{ textTransform: 'capitalize' }}>
                                {item}
                              </Typography>
                              <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                                {item === 'blocked'
                                  ? 'The user cannot sign in or make bookings'
                                  : 'The user can sign in and book caregivers'}
                              </Typography>
                            </Box>
                          </Box>
                        );
                      })}
                    </Stack>
                  ) : (
                    <Stack spacing={1.75}>
                      <DetailRow label="Role" value={<StatusBadge value={pickString(user, ['role'], '')} />} />
                      <DetailRow label="Status" value={<StatusBadge value={pickString(user, ['status'], '')} />} />
                      <DetailRow
                        label="Email verified"
                        value={
                          <StatusBadge
                            value={Boolean(user?.is_verified)}
                            label={user?.is_verified ? 'Verified' : 'Unverified'}
                          />
                        }
                      />
                      <DetailRow
                        label="eKYC"
                        value={
                          <StatusBadge
                            value={Boolean(user?.ekyc_status)}
                            label={user?.ekyc_status ? 'Verified' : 'Pending'}
                          />
                        }
                      />
                      <Divider sx={{ borderStyle: 'dashed' }} />
                      <DetailRow label="Created" value={created ? fDateTime(created) : '—'} />
                      <DetailRow label="Updated" value={updated ? fDateTime(updated) : '—'} />
                    </Stack>
                  )}
                </SectionCard>
              </Grid>
            </Grid>
          </Stack>
        </>
      )}
    </DashboardContent>
  );
}
