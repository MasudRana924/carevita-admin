import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { DashboardContent } from 'src/layouts/dashboard';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { PageHeader } from 'src/components/page-header';
import { DetailSkeleton, ErrorState } from 'src/components/page-states';
import { DetailRow, InfoTile, ProfileHero, SectionCard, type ToneColor } from 'src/components/detail-ui';
import { StatusBadge } from 'src/components/status-badge';
import { Iconify } from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { adminCaregiversService } from 'src/api/admin-services';
import type {
  CaregiverEkycDetail,
  CaregiverEkycFeatureItem,
  CredentialStatus,
} from 'src/api/admin-types';
import { getErrorMessage } from 'src/lib/utils';
import { fDateTime } from 'src/utils/format-time';

import { CAREGIVERS_QUERY_KEY } from './verification-utils';

const CREDENTIAL_STATUSES: CredentialStatus[] = [
  'VERIFIED',
  'REJECTED',
  'PENDING',
  'SUSPENDED',
  'REVERIFY_REQUIRED',
];

function FeatureList({
  title,
  icon,
  color,
  items,
}: {
  title: string;
  icon: string;
  color: ToneColor;
  items?: CaregiverEkycFeatureItem[] | null;
}) {
  return (
    <SectionCard icon={icon} color={color} title={title} count={items?.length || 0}>
      {items?.length ? (
        <Stack spacing={1}>
          {items.map((item, index) => (
            <Stack
              key={`${title}-${index}`}
              direction="row"
              spacing={1.5}
              alignItems="center"
              justifyContent="space-between"
              sx={{ px: 1.5, py: 1.25, borderRadius: 1.5, bgcolor: 'background.neutral' }}
            >
              <Typography variant="body2" sx={{ fontWeight: 500 }}>
                {item.document_type || `${title.replace(/s$/, '')} ${index + 1}`}
              </Typography>
              <StatusBadge value={item.status || '—'} />
            </Stack>
          ))}
        </Stack>
      ) : (
        <Typography variant="body2" sx={{ color: 'text.secondary', py: 1 }}>
          No checks recorded
        </Typography>
      )}
    </SectionCard>
  );
}

export function CaregiverEkycDetailView() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const { showSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [action, setAction] = useState<'approve' | 'decline' | null>(null);
  const [comment, setComment] = useState('');
  const [credentialStatus, setCredentialStatus] = useState<CredentialStatus>('VERIFIED');
  const [credentialNote, setCredentialNote] = useState('');
  const [credentialExpiresAt, setCredentialExpiresAt] = useState('');

  const query = useQuery({
    queryKey: ['admin-caregiver-ekyc', id],
    queryFn: () => adminCaregiversService.getEkyc(id),
    enabled: Boolean(id),
  });

  const detail = query.data as CaregiverEkycDetail | undefined;
  const decision = detail?.decision;

  useEffect(() => {
    if (!detail) return;
    if (window.location.hash !== '#credentials') return;
    document.getElementById('credentials')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, [detail]);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!action) throw new Error('No action selected');
      const payload = comment.trim() ? { comment: comment.trim() } : undefined;
      return action === 'approve'
        ? adminCaregiversService.approveEkyc(id, payload)
        : adminCaregiversService.declineEkyc(id, payload);
    },
    onSuccess: (result) => {
      showSnackbar(result.message || (action === 'approve' ? 'eKYC approved' : 'eKYC declined'), 'success');
      setAction(null);
      setComment('');
      queryClient.invalidateQueries({ queryKey: ['admin-caregiver-ekyc', id] });
      queryClient.invalidateQueries({ queryKey: CAREGIVERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: ['admin-caregiver-verification'] });
      query.refetch();
    },
    onError: (error) => showSnackbar(getErrorMessage(error), 'error'),
  });

  const credentialsMutation = useMutation({
    mutationFn: () =>
      adminCaregiversService.reviewCredentials(id, {
        credential_status: credentialStatus,
        ...(credentialNote.trim() ? { note: credentialNote.trim() } : {}),
        ...(credentialExpiresAt.trim()
          ? { credential_expires_at: credentialExpiresAt.trim() }
          : {}),
      }),
    onSuccess: () => {
      showSnackbar('Credentials reviewed', 'success');
      queryClient.invalidateQueries({ queryKey: CAREGIVERS_QUERY_KEY });
    },
    onError: (error) => showSnackbar(getErrorMessage(error), 'error'),
  });

  if (query.isLoading) {
    return (
      <DashboardContent>
        <DetailSkeleton />
      </DashboardContent>
    );
  }

  const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Caregivers', href: '/caregivers' },
    { title: detail?.name || 'Caregiver', href: `/caregivers/${id}/verification` },
    { title: 'eKYC' },
  ];

  if (query.error || !detail) {
    return (
      <DashboardContent>
        <PageHeader title="eKYC review" breadcrumbs={breadcrumbs} />
        <ErrorState
          message={query.error ? getErrorMessage(query.error) : 'eKYC details not found'}
          onRetry={() => query.refetch()}
        />
      </DashboardContent>
    );
  }

  const reviewable = detail.can_approve || detail.can_decline;

  const handleCopy = async (value: string, label: string) => {
    try {
      await navigator.clipboard.writeText(value);
      showSnackbar(`${label} copied`, 'success');
    } catch {
      showSnackbar('Could not copy', 'error');
    }
  };

  const copyAction = (value: string | null | undefined, label: string) =>
    value ? (
      <Tooltip title={`Copy ${label}`}>
        <IconButton size="small" onClick={() => handleCopy(value, label)}>
          <Iconify icon="solar:copy-linear" width={16} />
        </IconButton>
      </Tooltip>
    ) : undefined;

  return (
    <DashboardContent>
      <PageHeader title="eKYC review" breadcrumbs={breadcrumbs} />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Stack spacing={3}>
            <ProfileHero
              avatarIcon="solar:shield-user-bold-duotone"
              name={detail.name || 'Caregiver'}
              subtitle={[detail.email, detail.phone].filter(Boolean).join('  ·  ') || undefined}
              badges={
                <>
                  <StatusBadge value={detail.ekyc_session_status} />
                  <StatusBadge
                    value={Boolean(detail.ekyc_status)}
                    label={detail.ekyc_status ? 'Identity verified' : 'Not verified'}
                  />
                  {decision?.status && <StatusBadge value={decision.status} />}
                </>
              }
              tiles={
                <>
                  <InfoTile
                    icon="solar:qr-code-bold-duotone"
                    label="Session ID"
                    value={detail.session_id || '—'}
                    action={copyAction(detail.session_id, 'Session ID')}
                  />
                  <InfoTile
                    icon="solar:card-bold-duotone"
                    label="Caregiver ID"
                    value={detail.caregiver_id || id}
                    action={copyAction(detail.caregiver_id || id, 'Caregiver ID')}
                  />
                  <InfoTile
                    icon="solar:user-rounded-bold-duotone"
                    label="User ID"
                    value={detail.user_id || '—'}
                    action={copyAction(detail.user_id, 'User ID')}
                  />
                  <InfoTile
                    icon="solar:calendar-mark-bold-duotone"
                    label="Verified at"
                    value={detail.ekyc_verified_at ? fDateTime(String(detail.ekyc_verified_at)) : '—'}
                  />
                </>
              }
            />

            <Box>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Decision checks
              </Typography>
              <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' } }}>
                <FeatureList
                  title="ID verifications"
                  icon="solar:card-search-bold-duotone"
                  color="primary"
                  items={decision?.id_verifications}
                />
                <FeatureList
                  title="Liveness checks"
                  icon="solar:eye-scan-bold-duotone"
                  color="info"
                  items={decision?.liveness_checks}
                />
                <FeatureList
                  title="Face matches"
                  icon="solar:face-scan-circle-bold-duotone"
                  color="secondary"
                  items={decision?.face_matches}
                />
                <FeatureList
                  title="Reviews"
                  icon="solar:clipboard-check-bold-duotone"
                  color="warning"
                  items={decision?.reviews}
                />
              </Box>
            </Box>

            <SectionCard
              id="credentials"
              icon="solar:diploma-verified-bold-duotone"
              color="success"
              title="Professional credentials"
              subtitle="Manual review of BNMC / professional credentials (separate from Didit eKYC)"
            >
              <Stack spacing={2.5}>
                <Box sx={{ display: 'grid', gap: 2.5, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
                  <TextField
                    select
                    label="Credential status"
                    value={credentialStatus}
                    onChange={(event) => setCredentialStatus(event.target.value as CredentialStatus)}
                  >
                    {CREDENTIAL_STATUSES.map((value) => (
                      <MenuItem key={value} value={value}>
                        {value.replace(/_/g, ' ')}
                      </MenuItem>
                    ))}
                  </TextField>
                  <TextField
                    label="Expires at (optional)"
                    type="date"
                    value={credentialExpiresAt}
                    onChange={(event) => setCredentialExpiresAt(event.target.value)}
                    InputLabelProps={{ shrink: true }}
                  />
                </Box>
                <TextField
                  label="Note (optional)"
                  value={credentialNote}
                  onChange={(event) => setCredentialNote(event.target.value)}
                  multiline
                  minRows={3}
                  placeholder="BNMC card checked"
                />
                <Stack direction="row" justifyContent="flex-end">
                  <Button
                    variant="contained"
                    disabled={credentialsMutation.isPending}
                    startIcon={
                      credentialsMutation.isPending ? (
                        <CircularProgress size={16} color="inherit" />
                      ) : (
                        <Iconify icon="solar:diskette-bold" />
                      )
                    }
                    onClick={() => credentialsMutation.mutate()}
                  >
                    Save credentials review
                  </Button>
                </Stack>
              </Stack>
            </SectionCard>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Stack spacing={3} sx={{ position: { lg: 'sticky' }, top: { lg: 88 } }}>
            <SectionCard icon="solar:checklist-minimalistic-bold-duotone" color="success" title="Didit decision">
              <Stack spacing={1.75}>
                <DetailRow label="Session status" value={<StatusBadge value={detail.ekyc_session_status} />} />
                <DetailRow
                  label="Identity verified"
                  value={
                    <StatusBadge value={Boolean(detail.ekyc_status)} label={detail.ekyc_status ? 'Yes' : 'No'} />
                  }
                />
                <DetailRow label="Decision" value={<StatusBadge value={decision?.status || '—'} />} />
              </Stack>

              <Divider sx={{ my: 2.5, borderStyle: 'dashed' }} />

              {reviewable ? (
                <Stack spacing={1.5}>
                  <Button
                    fullWidth
                    size="large"
                    variant="contained"
                    color="success"
                    disabled={!detail.can_approve || mutation.isPending}
                    startIcon={<Iconify icon="solar:check-circle-bold" />}
                    onClick={() => setAction('approve')}
                  >
                    Approve identity
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="error"
                    disabled={!detail.can_decline || mutation.isPending}
                    startIcon={<Iconify icon="solar:close-circle-bold" />}
                    onClick={() => setAction('decline')}
                  >
                    Decline
                  </Button>
                </Stack>
              ) : (
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                  sx={{ p: 1.5, borderRadius: 1.5, bgcolor: 'background.neutral' }}
                >
                  <Iconify icon="solar:lock-keyhole-bold-duotone" width={22} sx={{ color: 'text.secondary' }} />
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    This session is not currently reviewable from the admin panel.
                  </Typography>
                </Stack>
              )}

              <Typography
                variant="caption"
                component="p"
                sx={{ color: 'text.secondary', mt: 2, p: 1.5, borderRadius: 1, bgcolor: 'background.neutral' }}
              >
                Approve / Decline updates Didit as the source of truth, then syncs Nirapod. Account approval
                still happens on the verification page.
              </Typography>

              <Button
                fullWidth
                color="inherit"
                sx={{ mt: 1.5 }}
                endIcon={<Iconify icon="solar:alt-arrow-right-linear" />}
                onClick={() => navigate(`/caregivers/${id}/verification`)}
              >
                Open verification page
              </Button>
            </SectionCard>
          </Stack>
        </Grid>
      </Grid>

      <ConfirmDialog
        open={!!action}
        onClose={() => !mutation.isPending && setAction(null)}
        title={action === 'approve' ? 'Approve eKYC' : 'Decline eKYC'}
        content={
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Typography>
              {action === 'approve'
                ? 'Approve this Didit session? The caregiver identity will be marked verified; the account still needs admin approval.'
                : 'Decline this Didit session? The caregiver will be marked declined in Nirapod.'}
            </Typography>
            <TextField
              fullWidth
              multiline
              minRows={3}
              label="Comment (optional)"
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder={
                action === 'approve'
                  ? 'Face match reviewed and accepted'
                  : 'Document mismatch / face not matching'
              }
            />
          </Stack>
        }
        action={
          <Button
            variant="contained"
            color={action === 'approve' ? 'success' : 'error'}
            disabled={mutation.isPending}
            startIcon={mutation.isPending ? <CircularProgress size={16} /> : null}
            onClick={() => mutation.mutate()}
          >
            {action === 'approve' ? 'Approve' : 'Decline'}
          </Button>
        }
      />
    </DashboardContent>
  );
}
