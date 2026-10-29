import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState, type ReactNode } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import AlertTitle from '@mui/material/AlertTitle';
import CircularProgress from '@mui/material/CircularProgress';

import { DashboardContent } from 'src/layouts/dashboard';
import { Label } from 'src/components/label';
import { ConfirmDialog } from 'src/components/custom-dialog';
import { PageHeader } from 'src/components/page-header';
import { DetailSkeleton, ErrorState } from 'src/components/page-states';
import { InfoField } from 'src/components/record-fields';
import { StatusBadge } from 'src/components/status-badge';
import { Iconify } from 'src/components/iconify';
import { useSnackbar } from 'src/components/snackbar';
import { adminAuditLogsService, adminCaregiversService } from 'src/api/admin-services';
import { getErrorMessage, pickString } from 'src/lib/utils';

import type { AuditLog, CaregiverDocument, CaregiverVerificationDetail } from 'src/api/admin-types';

import {
  DocumentLightbox,
  DocumentTile,
  MissingDocumentTile,
  type LightboxItem,
} from './caregiver-document-viewer';
import {
  CAREGIVERS_QUERY_KEY,
  REJECT_REASON_PRESETS,
  REVIEW_AUDIT_ACTIONS,
  caregiverReviewHistoryQueryKey,
  caregiverVerificationQueryKey,
  documentTypeLabel,
  fDateTimeOrDash,
  getVerificationActionError,
  onboardingStepLabel,
} from './verification-utils';

// ----------------------------------------------------------------------

type ReviewAction = 'approve' | 'reject' | 'block' | 'unblock';

const SUCCESS_MESSAGES: Record<ReviewAction, string> = {
  approve: 'Caregiver approved. They can now be booked.',
  reject: 'Caregiver rejected. They have been notified with your reason.',
  block: 'Caregiver blocked',
  unblock: 'Caregiver unblocked',
};

const AUDIT_ACTION_LABELS: Record<string, string> = {
  CAREGIVER_APPROVED: 'Approved',
  CAREGIVER_REJECTED: 'Rejected',
  CAREGIVER_DOCUMENTS_UPLOADED: 'Documents uploaded',
};

const DOCUMENTS_GRID_SX = {
  display: 'grid',
  gap: 2,
  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', md: 'repeat(3, 1fr)' },
} as const;

const SECTION_CARD_SX = {
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'divider',
  boxShadow: 'none',
} as const;

type PaletteKey = 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';

type ChecklistStep = { state: 'done' | 'pending' | 'failed'; title: string; caption: string };

const STEP_STYLES: Record<ChecklistStep['state'], { icon: string; color: PaletteKey | 'grey' }> = {
  done: { icon: 'solar:check-circle-bold', color: 'success' },
  pending: { icon: 'solar:clock-circle-bold', color: 'grey' },
  failed: { icon: 'solar:close-circle-bold', color: 'error' },
};

const TIMELINE_COLORS: Record<string, PaletteKey> = {
  CAREGIVER_APPROVED: 'success',
  CAREGIVER_REJECTED: 'error',
  CAREGIVER_DOCUMENTS_UPLOADED: 'info',
};

function adminDisplayName(value: CaregiverVerificationDetail['approved_by']) {
  if (!value) return null;
  if (typeof value === 'string') return value;
  return value.name || value.email || value.id || null;
}

function approveBlockedReason(detail: CaregiverVerificationDetail) {
  if (detail.verification_status === 'APPROVED') return 'Already approved';
  if (detail.verification_status === 'SUSPENDED') return 'Unblock the caregiver before reviewing';
  if (!detail.ekyc_status) return 'Didit identity verification is not approved yet';
  if (!detail.documents_summary?.complete) return 'Required documents are missing';
  return 'Not available for this caregiver right now';
}

function auditMetaText(log: AuditLog) {
  const meta = log.meta;
  if (!meta) return '';
  if (typeof meta === 'string') return meta;
  if (typeof meta === 'object') return pickString(meta as Record<string, unknown>, ['reason', 'note'], '');
  return '';
}

// ----------------------------------------------------------------------

export function CaregiverVerificationView() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { showSnackbar } = useSnackbar();

  const [action, setAction] = useState<ReviewAction | null>(null);
  const [approveNote, setApproveNote] = useState('');
  const [rejectReason, setRejectReason] = useState('');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const query = useQuery({
    queryKey: caregiverVerificationQueryKey(id),
    queryFn: () => adminCaregiversService.getVerification(id),
    enabled: Boolean(id),
    // Document URLs are sensitive (family NID): keep them only while this page is mounted.
    staleTime: 0,
    gcTime: 0,
  });

  const detail = query.data;
  const caregiverId = detail?.caregiver_id || id;

  const historyQuery = useQuery({
    queryKey: caregiverReviewHistoryQueryKey(caregiverId),
    queryFn: () => adminAuditLogsService.getAuditLogs({ entity_id: caregiverId, limit: 50 }),
    enabled: Boolean(detail?.caregiver_id),
    retry: false,
    staleTime: 0,
  });

  const reviewEvents = useMemo(
    () =>
      (historyQuery.data?.data || []).filter((log) =>
        (REVIEW_AUDIT_ACTIONS as readonly string[]).includes(String(log.action))
      ),
    [historyQuery.data]
  );

  const lightboxItems = useMemo<LightboxItem[]>(() => {
    if (!detail) return [];
    const { documents } = detail;
    const items: LightboxItem[] = [];
    if (documents?.family_nid_front) items.push({ doc: documents.family_nid_front, label: 'Family member NID (front)' });
    if (documents?.family_nid_back) items.push({ doc: documents.family_nid_back, label: 'Family member NID (back)' });
    (documents?.academic_certificates || []).forEach((doc) => items.push({ doc, label: 'Academic certificate' }));
    (documents?.professional_certificates || []).forEach((doc) =>
      items.push({ doc, label: 'Professional certificate' })
    );
    return items;
  }, [detail]);

  const openDocument = (doc: CaregiverDocument) => {
    const index = lightboxItems.findIndex((item) => item.doc.id === doc.id);
    if (index >= 0) setLightboxIndex(index);
  };

  const closeDialog = () => {
    setAction(null);
    setApproveNote('');
    setRejectReason('');
  };

  const mutation = useMutation({
    mutationFn: async (kind: ReviewAction): Promise<{ message?: string }> => {
      switch (kind) {
        case 'approve':
          return adminCaregiversService.approve(caregiverId, { note: approveNote.trim() || undefined });
        case 'reject':
          return adminCaregiversService.reject(caregiverId, { reason: rejectReason.trim() });
        case 'block':
          await adminCaregiversService.blockCaregiver(caregiverId);
          return {};
        case 'unblock':
          await adminCaregiversService.unblockCaregiver(caregiverId);
          return {};
        default:
          throw new Error('Unknown action');
      }
    },
    onSuccess: (result, kind) => {
      showSnackbar(result.message || SUCCESS_MESSAGES[kind], 'success');
      closeDialog();
    },
    onError: (error, kind) => {
      showSnackbar(getVerificationActionError(error), 'error');
      if (kind === 'approve') closeDialog();
    },
    onSettled: () => {
      query.refetch();
      queryClient.invalidateQueries({ queryKey: CAREGIVERS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: caregiverReviewHistoryQueryKey(caregiverId) });
    },
  });

  const applyPreset = (preset: string) => {
    setRejectReason((previous) => {
      const trimmed = previous.trim();
      if (!trimmed) return preset;
      if (trimmed.includes(preset)) return previous;
      return `${trimmed}\n${preset}`;
    });
  };

  if (query.isLoading) {
    return (
      <DashboardContent>
        <DetailSkeleton />
      </DashboardContent>
    );
  }

  if (query.error || !detail) {
    return (
      <DashboardContent>
        <PageHeader title="Caregiver verification" />
        <ErrorState
          message={query.error ? getErrorMessage(query.error) : 'Caregiver not found'}
          onRetry={() => query.refetch()}
        />
      </DashboardContent>
    );
  }

  const documents = detail.documents || {
    family_nid_front: null,
    family_nid_back: null,
    academic_certificates: [],
    professional_certificates: [],
  };
  const missing = detail.documents_summary?.missing || [];
  const isSuspended = detail.verification_status === 'SUSPENDED';
  const approvedBy = adminDisplayName(detail.approved_by);
  const familyDoc = documents.family_nid_front || documents.family_nid_back;
  const busy = mutation.isPending;

  const approveButton = (
    <Button
      fullWidth
      size="large"
      variant="contained"
      color="success"
      disabled={!detail.can_approve || busy}
      startIcon={<Iconify icon="solar:check-circle-bold" />}
      onClick={() => setAction('approve')}
    >
      Approve
    </Button>
  );

  const location = [detail.district, detail.thana].filter(Boolean).join(', ');
  const academicCount = documents.academic_certificates?.length || 0;
  const professionalCount = documents.professional_certificates?.length || 0;

  const reviewStep: ChecklistStep =
    detail.verification_status === 'APPROVED'
      ? { state: 'done', title: 'Admin approval', caption: `Approved ${fDateTimeOrDash(detail.approved_at)}` }
      : detail.verification_status === 'REJECTED'
        ? { state: 'failed', title: 'Admin approval', caption: `Rejected ${fDateTimeOrDash(detail.rejected_at)}` }
        : isSuspended
          ? { state: 'failed', title: 'Admin approval', caption: 'Account is suspended' }
          : { state: 'pending', title: 'Admin approval', caption: 'Waiting for your decision' };

  const checklist: ChecklistStep[] = [
    {
      state: detail.ekyc_status ? 'done' : 'pending',
      title: 'Identity verified (Didit)',
      caption: detail.ekyc_status ? `Verified ${fDateTimeOrDash(detail.ekyc_verified_at)}` : 'Not verified yet',
    },
    {
      state: detail.documents_summary?.complete ? 'done' : 'pending',
      title: 'Required documents',
      caption: detail.documents_summary?.complete
        ? 'All required documents uploaded'
        : `${missing.length} missing`,
    },
    reviewStep,
  ];

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(detail.caregiver_id);
      showSnackbar('Caregiver ID copied', 'success');
    } catch {
      showSnackbar('Could not copy the ID', 'error');
    }
  };

  return (
    <DashboardContent>
      <PageHeader
        title="Caregiver verification"
        breadcrumbs={[
          { title: 'Dashboard', href: '/dashboard' },
          { title: 'Caregivers', href: '/caregivers' },
          { title: detail.name || 'Verification' },
        ]}
      />

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, lg: 8 }}>
          <Stack spacing={3}>
            <Card sx={{ ...SECTION_CARD_SX, overflow: 'hidden' }}>
              <Box
                sx={{
                  height: 96,
                  background: (theme) =>
                    `linear-gradient(135deg, ${theme.vars.palette.primary.lighter} 0%, ${theme.vars.palette.info.lighter} 100%)`,
                }}
              />
              <Box sx={{ px: 3, pb: 3 }}>
                <Stack
                  direction={{ xs: 'column', sm: 'row' }}
                  spacing={2.5}
                  alignItems={{ xs: 'flex-start', sm: 'flex-end' }}
                  sx={{ mt: -5 }}
                >
                  <Avatar
                    src={detail.profile_photo || undefined}
                    alt={detail.name}
                    slotProps={{ img: { referrerPolicy: 'no-referrer' } }}
                    sx={{
                      width: 96,
                      height: 96,
                      fontSize: 36,
                      border: '4px solid',
                      borderColor: 'background.paper',
                      boxShadow: (theme) => theme.vars.customShadows?.z8,
                    }}
                  >
                    {detail.name?.charAt(0)?.toUpperCase()}
                  </Avatar>
                  <Box sx={{ flexGrow: 1, minWidth: 0, pb: 0.5 }}>
                    <Typography variant="h5" noWrap>
                      {detail.name || 'Caregiver'}
                    </Typography>
                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
                      <StatusBadge value={detail.verification_status} />
                      <Label variant="soft" color="info">
                        {onboardingStepLabel(detail.onboarding_step)}
                      </Label>
                      {detail.provider_type && (
                        <Label variant="soft" color="default">
                          {detail.provider_type.replace(/_/g, ' ')}
                        </Label>
                      )}
                    </Stack>
                  </Box>
                </Stack>

                <Box
                  sx={{
                    mt: 3,
                    display: 'grid',
                    gap: 2,
                    gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', xl: 'repeat(4, 1fr)' },
                  }}
                >
                  <ContactItem icon="solar:phone-bold-duotone" label="Phone" value={detail.phone || '—'} />
                  <ContactItem icon="solar:letter-bold-duotone" label="Email" value={detail.email || '—'} />
                  <ContactItem icon="solar:map-point-bold-duotone" label="District / Thana" value={location || '—'} />
                  <ContactItem
                    icon="solar:card-bold-duotone"
                    label="Caregiver ID"
                    value={detail.caregiver_id}
                    action={
                      <Tooltip title="Copy ID">
                        <IconButton size="small" onClick={handleCopyId}>
                          <Iconify icon="solar:copy-linear" width={16} />
                        </IconButton>
                      </Tooltip>
                    }
                  />
                </Box>
              </Box>
            </Card>

            {missing.length > 0 && (
              <Alert severity="warning" variant="outlined">
                <AlertTitle>Missing documents</AlertTitle>
                The caregiver cannot be approved until these are uploaded: {missing.map(documentTypeLabel).join(', ')}.
              </Alert>
            )}

            {detail.verification_status === 'REJECTED' && (
              <Alert severity="error" variant="outlined">
                <AlertTitle>Rejected {detail.rejected_at ? `on ${fDateTimeOrDash(detail.rejected_at)}` : ''}</AlertTitle>
                {detail.verification_note || 'No reason recorded.'} The caregiver can re-upload documents and will
                return to the pending queue automatically.
              </Alert>
            )}

            <SectionCard
              icon="solar:user-id-bold-duotone"
              color="primary"
              title="Family member NID"
              subtitle="Front and back of a close family member's national ID"
            >
              <Box sx={{ display: 'grid', gap: 2, gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' } }}>
                {documents.family_nid_front ? (
                  <DocumentTile doc={documents.family_nid_front} label="Front side" onOpen={openDocument} />
                ) : (
                  <MissingDocumentTile label="Front side" />
                )}
                {documents.family_nid_back ? (
                  <DocumentTile doc={documents.family_nid_back} label="Back side" onOpen={openDocument} />
                ) : (
                  <MissingDocumentTile label="Back side" />
                )}
              </Box>
              <Box
                sx={{
                  mt: 2.5,
                  p: 2,
                  gap: 2,
                  display: 'grid',
                  borderRadius: 1.5,
                  bgcolor: 'background.neutral',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
                }}
              >
                <InfoField label="Family member name" value={familyDoc?.family_member_name || '—'} />
                <InfoField label="Relation" value={familyDoc?.family_member_relation || '—'} />
              </Box>
            </SectionCard>

            <SectionCard
              icon="solar:square-academic-cap-bold-duotone"
              color="info"
              title="Academic certificates"
              subtitle="Required — at least one certificate"
              count={academicCount}
            >
              {academicCount ? (
                <Box sx={DOCUMENTS_GRID_SX}>
                  {documents.academic_certificates.map((doc) => (
                    <DocumentTile key={doc.id} doc={doc} onOpen={openDocument} />
                  ))}
                </Box>
              ) : (
                <EmptyDocuments tone="warning" text="No academic certificates uploaded." />
              )}
            </SectionCard>

            <SectionCard
              icon="solar:diploma-verified-bold-duotone"
              color="secondary"
              title="Professional certificates"
              subtitle="Optional — nursing, caregiving or training certificates"
              count={professionalCount}
            >
              {professionalCount ? (
                <Box sx={DOCUMENTS_GRID_SX}>
                  {documents.professional_certificates.map((doc) => (
                    <DocumentTile key={doc.id} doc={doc} onOpen={openDocument} />
                  ))}
                </Box>
              ) : (
                <EmptyDocuments tone="default" text="No professional certificates uploaded (optional)." />
              )}
            </SectionCard>
          </Stack>
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <Stack spacing={3} sx={{ position: { lg: 'sticky' }, top: { lg: 88 } }}>
            <SectionCard icon="solar:checklist-minimalistic-bold-duotone" color="success" title="Review decision">
              <Stack spacing={0}>
                {checklist.map((step, index) => (
                  <ChecklistRow key={step.title} step={step} last={index === checklist.length - 1} />
                ))}
              </Stack>

              <Divider sx={{ my: 2.5, borderStyle: 'dashed' }} />

              <Stack spacing={1.5}>
                {detail.can_approve ? (
                  approveButton
                ) : (
                  <Tooltip title={approveBlockedReason(detail)}>
                    <span>{approveButton}</span>
                  </Tooltip>
                )}
                <Stack direction="row" spacing={1.5}>
                  <Button
                    fullWidth
                    variant="outlined"
                    color="error"
                    disabled={!detail.can_reject || busy}
                    startIcon={<Iconify icon="solar:close-circle-bold" />}
                    onClick={() => setAction('reject')}
                  >
                    Reject
                  </Button>
                  <Button
                    fullWidth
                    variant="outlined"
                    color={isSuspended ? 'success' : 'warning'}
                    disabled={busy}
                    startIcon={
                      <Iconify icon={isSuspended ? 'solar:shield-check-bold' : 'solar:shield-cross-bold'} />
                    }
                    onClick={() => setAction(isSuspended ? 'unblock' : 'block')}
                  >
                    {isSuspended ? 'Unblock' : 'Block'}
                  </Button>
                </Stack>
              </Stack>
            </SectionCard>

            <SectionCard
              icon="solar:shield-user-bold-duotone"
              color="info"
              title="Identity (Didit)"
              action={
                <Tooltip title="View Didit details">
                  <IconButton size="small" onClick={() => navigate(`/caregivers/${caregiverId}/ekyc`)}>
                    <Iconify icon="solar:square-arrow-right-up-linear" width={18} />
                  </IconButton>
                </Tooltip>
              }
            >
              <Stack spacing={1.75}>
                <DetailRow
                  label="eKYC status"
                  value={
                    <StatusBadge
                      value={Boolean(detail.ekyc_status)}
                      label={detail.ekyc_status ? 'Verified' : 'Not verified'}
                    />
                  }
                />
                <DetailRow label="Session status" value={<StatusBadge value={detail.ekyc_session_status || '—'} />} />
                <DetailRow label="Verified at" value={fDateTimeOrDash(detail.ekyc_verified_at)} />
              </Stack>
              <Typography
                variant="caption"
                component="p"
                sx={{ color: 'text.secondary', mt: 2, p: 1.5, borderRadius: 1, bgcolor: 'background.neutral' }}
              >
                Didit approval only confirms identity. The account stays PENDING until you approve it here.
              </Typography>
            </SectionCard>

            <SectionCard icon="solar:history-bold-duotone" color="warning" title="Review history">
              <Stack spacing={1.75}>
                <DetailRow label="Approved at" value={fDateTimeOrDash(detail.approved_at)} />
                <DetailRow label="Approved by" value={approvedBy || '—'} />
                <DetailRow label="Rejected at" value={fDateTimeOrDash(detail.rejected_at)} />
              </Stack>
              {detail.verification_note && (
                <Box sx={{ mt: 2, p: 1.5, borderRadius: 1, bgcolor: 'background.neutral' }}>
                  <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                    Last note / reason
                  </Typography>
                  <Typography variant="body2" sx={{ mt: 0.5, wordBreak: 'break-word' }}>
                    {detail.verification_note}
                  </Typography>
                </Box>
              )}

              {reviewEvents.length > 0 && (
                <>
                  <Divider sx={{ my: 2.5, borderStyle: 'dashed' }} />
                  <Stack>
                    {reviewEvents.map((log, index) => (
                      <TimelineRow
                        key={log.id || index}
                        log={log}
                        last={index === reviewEvents.length - 1}
                      />
                    ))}
                  </Stack>
                </>
              )}
            </SectionCard>
          </Stack>
        </Grid>
      </Grid>

      <DocumentLightbox
        items={lightboxItems}
        index={lightboxIndex}
        onIndexChange={setLightboxIndex}
        onClose={() => setLightboxIndex(null)}
      />

      <ConfirmDialog
        open={action === 'approve'}
        onClose={() => !busy && closeDialog()}
        title="Approve caregiver"
        content={
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Typography>
              Approve <strong>{detail.name}</strong>? They will become bookable, eligible for auto-assignment and
              visible in search, and will receive a push and inbox notification.
            </Typography>
            <TextField
              fullWidth
              multiline
              minRows={3}
              label="Note (optional)"
              value={approveNote}
              onChange={(event) => setApproveNote(event.target.value)}
              placeholder="NID and certificates checked"
            />
          </Stack>
        }
        action={
          <Button
            variant="contained"
            color="success"
            disabled={busy}
            startIcon={busy ? <CircularProgress size={16} /> : null}
            onClick={() => mutation.mutate('approve')}
          >
            Approve
          </Button>
        }
      />

      <ConfirmDialog
        open={action === 'reject'}
        onClose={() => !busy && closeDialog()}
        title="Reject caregiver"
        content={
          <Stack spacing={2} sx={{ pt: 1 }}>
            <Typography>
              The caregiver sees this reason in the app, can re-upload documents, and then returns to the pending
              queue automatically.
            </Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
              {REJECT_REASON_PRESETS.map((preset) => {
                const active = rejectReason.includes(preset);
                return (
                  <Chip
                    key={preset}
                    label={preset}
                    size="small"
                    color={active ? 'error' : 'default'}
                    variant={active ? 'filled' : 'outlined'}
                    onClick={() => applyPreset(preset)}
                  />
                );
              })}
            </Stack>
            <TextField
              fullWidth
              required
              multiline
              minRows={3}
              label="Reason"
              value={rejectReason}
              onChange={(event) => setRejectReason(event.target.value)}
              error={action === 'reject' && rejectReason.length > 0 && !rejectReason.trim()}
              helperText="Required. Be specific so the caregiver knows what to fix."
            />
          </Stack>
        }
        action={
          <Button
            variant="contained"
            color="error"
            disabled={busy || !rejectReason.trim()}
            startIcon={busy ? <CircularProgress size={16} /> : null}
            onClick={() => mutation.mutate('reject')}
          >
            Reject
          </Button>
        }
      />

      <ConfirmDialog
        open={action === 'block' || action === 'unblock'}
        onClose={() => !busy && closeDialog()}
        title={action === 'unblock' ? 'Unblock caregiver' : 'Block caregiver'}
        content={
          <Typography>
            {action === 'unblock'
              ? 'Unblock this caregiver? They return to APPROVED only if an admin approved them before; otherwise they go back to PENDING review.'
              : 'Block this caregiver? They will be suspended and cannot be booked.'}
          </Typography>
        }
        action={
          <Button
            variant="contained"
            color={action === 'unblock' ? 'success' : 'error'}
            disabled={busy}
            startIcon={busy ? <CircularProgress size={16} /> : null}
            onClick={() => action && mutation.mutate(action)}
          >
            {action === 'unblock' ? 'Unblock' : 'Block'}
          </Button>
        }
      />
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

function SectionCard({
  icon,
  color,
  title,
  subtitle,
  count,
  action,
  children,
}: {
  icon: string;
  color: PaletteKey;
  title: string;
  subtitle?: string;
  count?: number;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <Card sx={{ ...SECTION_CARD_SX, p: 3 }}>
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2.5 }}>
        <Box
          sx={{
            width: 40,
            height: 40,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: 1.25,
            color: `${color}.main`,
            bgcolor: `${color}.lighter`,
          }}
        >
          <Iconify icon={icon} width={22} />
        </Box>
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="subtitle1">{title}</Typography>
            {count !== undefined && (
              <Label variant="soft" color={count ? color : 'default'}>
                {count}
              </Label>
            )}
          </Stack>
          {subtitle && (
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {action}
      </Stack>
      {children}
    </Card>
  );
}

function ContactItem({
  icon,
  label,
  value,
  action,
}: {
  icon: string;
  label: string;
  value: string;
  action?: ReactNode;
}) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1.5}
      sx={{ p: 1.5, minWidth: 0, borderRadius: 1.5, bgcolor: 'background.neutral' }}
    >
      <Iconify icon={icon} width={22} sx={{ color: 'text.secondary' }} />
      <Box sx={{ minWidth: 0, flexGrow: 1 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
          {label}
        </Typography>
        <Typography variant="subtitle2" noWrap title={value}>
          {value}
        </Typography>
      </Box>
      {action}
    </Stack>
  );
}

function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={2}>
      <Typography variant="body2" sx={{ color: 'text.secondary', flexShrink: 0 }}>
        {label}
      </Typography>
      {typeof value === 'string' ? (
        <Typography variant="subtitle2" sx={{ textAlign: 'right', wordBreak: 'break-word' }}>
          {value}
        </Typography>
      ) : (
        value
      )}
    </Stack>
  );
}

function ChecklistRow({ step, last }: { step: ChecklistStep; last: boolean }) {
  const { icon, color } = STEP_STYLES[step.state];
  const tone = color === 'grey' ? 'text.disabled' : `${color}.main`;

  return (
    <Stack direction="row" spacing={1.5}>
      <Stack alignItems="center">
        <Iconify icon={icon} width={26} sx={{ color: tone }} />
        {!last && <Box sx={{ width: 2, flexGrow: 1, my: 0.5, borderRadius: 1, bgcolor: 'divider' }} />}
      </Stack>
      <Box sx={{ pb: last ? 0 : 2, minWidth: 0 }}>
        <Typography variant="subtitle2">{step.title}</Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {step.caption}
        </Typography>
      </Box>
    </Stack>
  );
}

function TimelineRow({ log, last }: { log: AuditLog; last: boolean }) {
  const color = TIMELINE_COLORS[String(log.action)] || 'info';
  const metaText = auditMetaText(log);

  return (
    <Stack direction="row" spacing={1.5}>
      <Stack alignItems="center" sx={{ pt: 0.5 }}>
        <Box
          sx={{
            width: 12,
            height: 12,
            borderRadius: '50%',
            bgcolor: `${color}.main`,
            boxShadow: (theme) => `0 0 0 4px ${theme.vars.palette[color].lighter}`,
          }}
        />
        {!last && <Box sx={{ width: 2, flexGrow: 1, my: 1, bgcolor: 'divider' }} />}
      </Stack>
      <Box sx={{ pb: last ? 0 : 2, minWidth: 0 }}>
        <Typography variant="subtitle2">{AUDIT_ACTION_LABELS[String(log.action)] || String(log.action)}</Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
          {fDateTimeOrDash(log.created_at)}
          {log.actor_name ? ` · ${log.actor_name}` : ''}
        </Typography>
        {metaText && (
          <Typography variant="body2" sx={{ mt: 0.5, wordBreak: 'break-word' }}>
            {metaText}
          </Typography>
        )}
      </Box>
    </Stack>
  );
}

function EmptyDocuments({ tone, text }: { tone: 'warning' | 'default'; text: string }) {
  return (
    <Stack
      alignItems="center"
      spacing={1}
      sx={{
        py: 4,
        borderRadius: 1.5,
        border: '1px dashed',
        textAlign: 'center',
        borderColor: tone === 'warning' ? 'warning.main' : 'divider',
        color: tone === 'warning' ? 'warning.dark' : 'text.secondary',
        bgcolor: tone === 'warning' ? 'warning.lighter' : 'background.neutral',
      }}
    >
      <Iconify icon="solar:file-remove-bold-duotone" width={32} />
      <Typography variant="body2">{text}</Typography>
    </Stack>
  );
}
