import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { PageHeader } from 'src/components/page-header';
import { DetailSkeleton, ErrorState } from 'src/components/page-states';
import { InfoCard, InfoField } from 'src/components/record-fields';
import { StatusBadge } from 'src/components/status-badge';
import { LucideIcon } from 'src/components/lucide-icons';
import { useSnackbar } from 'src/components/snackbar';
import { adminCaregiversService } from 'src/api/admin-services';
import type {
  CaregiverEkycDetail,
  CaregiverEkycFeatureItem,
  CredentialStatus,
} from 'src/api/admin-types';
import { getErrorMessage } from 'src/lib/utils';
import { fDateTime } from 'src/utils/format-time';

const CREDENTIAL_STATUSES: CredentialStatus[] = [
  'VERIFIED',
  'REJECTED',
  'PENDING',
  'SUSPENDED',
  'REVERIFY_REQUIRED',
];

function FeatureList({
  title,
  items,
}: {
  title: string;
  items?: CaregiverEkycFeatureItem[] | null;
}) {
  if (!items?.length) {
    return (
      <InfoCard title={title}>
        <Typography variant="body2" color="text.secondary">
          No items
        </Typography>
      </InfoCard>
    );
  }

  return (
    <InfoCard title={title}>
      <Stack spacing={1.5}>
        {items.map((item, index) => (
          <Stack
            key={`${title}-${index}`}
            direction="row"
            spacing={1.5}
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="body2">
              {item.document_type || `${title.replace(/s$/, '')} ${index + 1}`}
            </Typography>
            <StatusBadge value={item.status || '—'} />
          </Stack>
        ))}
      </Stack>
    </InfoCard>
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
      queryClient.invalidateQueries({ queryKey: ['admin-caregivers'] });
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
      queryClient.invalidateQueries({ queryKey: ['admin-caregivers'] });
    },
    onError: (error) => showSnackbar(getErrorMessage(error), 'error'),
  });

  if (query.isLoading) {
    return (
      <DashboardContent maxWidth="xl">
        <DetailSkeleton />
      </DashboardContent>
    );
  }

  if (query.error || !detail) {
    return (
      <DashboardContent maxWidth="xl">
        <PageHeader title="eKYC review" />
        <ErrorState
          message={query.error ? getErrorMessage(query.error) : 'eKYC details not found'}
          onRetry={() => query.refetch()}
        />
      </DashboardContent>
    );
  }

  return (
    <DashboardContent maxWidth="xl">
      <PageHeader
        title={`eKYC · ${detail.name || 'Caregiver'}`}
        description={detail.email || detail.phone || undefined}
        action={
          <Stack direction="row" spacing={1.5}>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<LucideIcon icon="eva:arrow-ios-back-fill" />}
              onClick={() => navigate('/caregivers')}
            >
              Back
            </Button>
            <Button
              variant="outlined"
              color="error"
              disabled={!detail.can_decline || mutation.isPending}
              onClick={() => setAction('decline')}
            >
              Decline
            </Button>
            <Button
              variant="contained"
              color="success"
              disabled={!detail.can_approve || mutation.isPending}
              onClick={() => setAction('approve')}
            >
              Approve
            </Button>
          </Stack>
        }
      />

      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, mb: 3 }}>
        <InfoCard title="Session">
          <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
            <InfoField label="Session status" value={<StatusBadge value={detail.ekyc_session_status} />} />
            <InfoField
              label="Verified"
              value={
                <StatusBadge
                  value={Boolean(detail.ekyc_status)}
                  label={detail.ekyc_status ? 'Yes' : 'No'}
                />
              }
            />
            <InfoField label="Session ID" value={detail.session_id || '—'} />
            <InfoField label="Decision status" value={<StatusBadge value={decision?.status || '—'} />} />
            <InfoField label="Caregiver ID" value={detail.caregiver_id || id} />
            <InfoField label="User ID" value={detail.user_id || '—'} />
          </Box>
        </InfoCard>

        <InfoCard title="Actions">
          <Stack spacing={1.5}>
            <Typography variant="body2" color="text.secondary">
              Approve / Decline updates Didit as the source of truth, then syncs CareMate. Use these
              only when the session is reviewable.
            </Typography>
            <Stack direction="row" spacing={1}>
              <StatusBadge
                value={detail.can_approve}
                label={detail.can_approve ? 'Can approve' : 'Cannot approve'}
              />
              <StatusBadge
                value={detail.can_decline}
                label={detail.can_decline ? 'Can decline' : 'Cannot decline'}
              />
            </Stack>
            {detail.ekyc_verified_at ? (
              <Typography variant="caption" color="text.secondary">
                Verified at {fDateTime(String(detail.ekyc_verified_at))}
              </Typography>
            ) : null}
          </Stack>
        </InfoCard>
      </Box>

      <Typography variant="h6" sx={{ mb: 2 }}>
        Decision features
      </Typography>
      <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, mb: 3 }}>
        <FeatureList title="ID verifications" items={decision?.id_verifications} />
        <FeatureList title="Liveness checks" items={decision?.liveness_checks} />
        <FeatureList title="Face matches" items={decision?.face_matches} />
        <FeatureList title="Reviews" items={decision?.reviews} />
      </Box>

      <Card
        id="credentials"
        sx={{ p: 3, mb: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}
      >
        <Typography variant="h6" sx={{ mb: 1 }}>
          Professional credentials
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
          Manual review of BNMC / professional credentials (separate from Didit eKYC).
        </Typography>
        <Stack spacing={2}>
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
            label="Note (optional)"
            value={credentialNote}
            onChange={(event) => setCredentialNote(event.target.value)}
            multiline
            minRows={2}
            placeholder="BNMC card checked"
          />
          <TextField
            label="Expires at (optional)"
            type="date"
            value={credentialExpiresAt}
            onChange={(event) => setCredentialExpiresAt(event.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ maxWidth: 280 }}
          />
          <Stack direction="row" justifyContent="flex-end">
            <Button
              variant="contained"
              disabled={credentialsMutation.isPending}
              startIcon={credentialsMutation.isPending ? <CircularProgress size={16} /> : null}
              onClick={() => credentialsMutation.mutate()}
            >
              Save credentials review
            </Button>
          </Stack>
        </Stack>
      </Card>

      {!detail.can_approve && !detail.can_decline && (
        <Card sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
          <Typography variant="body2" color="text.secondary">
            This session is not currently reviewable from the admin panel.
          </Typography>
        </Card>
      )}

      <ConfirmDialog
        open={!!action}
        onClose={() => !mutation.isPending && setAction(null)}
        title={action === 'approve' ? 'Approve eKYC' : 'Decline eKYC'}
        content={
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Typography>
              {action === 'approve'
                ? 'Approve this Didit session? The caregiver will be marked verified in CareMate.'
                : 'Decline this Didit session? The caregiver will be marked declined in CareMate.'}
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
