import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import FormControlLabel from '@mui/material/FormControlLabel';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';
import { PageHeader } from 'src/components/page-header';
import { DetailSkeleton, EmptyState, ErrorState } from 'src/components/page-states';
import { StatusBadge } from 'src/components/status-badge';
import { useSnackbar } from 'src/components/snackbar';
import { privacyPoliciesApi } from 'src/lib/api';
import { asList, getErrorMessage, pickString } from 'src/lib/utils';
import { fDateTime } from 'src/utils/format-time';

const AUDIENCES = ['USER', 'CAREGIVER'] as const;

function asRecord(value: unknown): Record<string, unknown> {
  if (value && typeof value === 'object' && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return {};
}

export function PrivacyPoliciesView() {
  const { showSnackbar } = useSnackbar();
  const queryClient = useQueryClient();
  const [audience, setAudience] = useState<(typeof AUDIENCES)[number]>('USER');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [version, setVersion] = useState('1.0');
  const [isPublished, setIsPublished] = useState(true);

  const query = useQuery({
    queryKey: ['admin-privacy-policies'],
    queryFn: async () => {
      const result = await privacyPoliciesApi.list();
      return asList(result);
    },
  });

  const policies = query.data || [];

  const selected = useMemo(() => {
    const match = policies.find((item) => pickString(item, ['audience']) === audience);
    return match ? asRecord(match) : null;
  }, [policies, audience]);

  useEffect(() => {
    if (!selected) {
      setTitle(audience === 'USER' ? 'Privacy Policy for Families' : 'Privacy Policy for Caregivers');
      setContent('');
      setVersion('1.0');
      setIsPublished(true);
      return;
    }
    setTitle(pickString(selected, ['title'], ''));
    setContent(pickString(selected, ['content'], '') === '—' ? '' : pickString(selected, ['content'], ''));
    setVersion(pickString(selected, ['version'], '1.0') === '—' ? '1.0' : pickString(selected, ['version'], '1.0'));
    setIsPublished(selected.is_published !== false);
  }, [selected, audience]);

  const mutation = useMutation({
    mutationFn: () =>
      privacyPoliciesApi.upsert({
        audience,
        title: title.trim(),
        content: content.trim(),
        version: version.trim() || '1.0',
        is_published: isPublished,
      }),
    onSuccess: () => {
      showSnackbar('Privacy policy saved', 'success');
      queryClient.invalidateQueries({ queryKey: ['admin-privacy-policies'] });
    },
    onError: (error) => showSnackbar(getErrorMessage(error), 'error'),
  });

  return (
    <DashboardContent maxWidth="xl">
      <PageHeader
        title="Privacy policies"
        description="Manage USER and CAREGIVER privacy policy content shown in the apps"
      />

      {query.isLoading ? (
        <DetailSkeleton />
      ) : query.error ? (
        <ErrorState message={getErrorMessage(query.error)} onRetry={() => query.refetch()} />
      ) : (
        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: '280px 1fr' } }}>
          <Card sx={{ p: 2.5, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
            <Typography variant="subtitle2" sx={{ mb: 2 }}>
              Audiences
            </Typography>
            <Stack spacing={1.5}>
              {AUDIENCES.map((value) => {
                const row = policies.find((item) => pickString(item, ['audience']) === value);
                return (
                  <Button
                    key={value}
                    variant={audience === value ? 'contained' : 'outlined'}
                    color={audience === value ? 'primary' : 'inherit'}
                    onClick={() => setAudience(value)}
                    sx={{ justifyContent: 'space-between' }}
                  >
                    {value}
                    {row ? (
                      <StatusBadge
                        value={Boolean(asRecord(row).is_published !== false)}
                        label={asRecord(row).is_published === false ? 'Draft' : 'Published'}
                      />
                    ) : (
                      <Typography variant="caption">New</Typography>
                    )}
                  </Button>
                );
              })}
            </Stack>
            {!policies.length && (
              <EmptyState title="No policies yet" description="Create the first audience policy." />
            )}
          </Card>

          <Card sx={{ p: 3, border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
            <Stack spacing={2.5}>
              <TextField
                select
                label="Audience"
                value={audience}
                onChange={(event) => setAudience(event.target.value as (typeof AUDIENCES)[number])}
              >
                {AUDIENCES.map((value) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                label="Title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
              />
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  label="Version"
                  value={version}
                  onChange={(event) => setVersion(event.target.value)}
                  sx={{ maxWidth: 180 }}
                />
                <FormControlLabel
                  control={
                    <Switch
                      checked={isPublished}
                      onChange={(event) => setIsPublished(event.target.checked)}
                    />
                  }
                  label="Published"
                />
              </Stack>
              <TextField
                label="Content"
                value={content}
                onChange={(event) => setContent(event.target.value)}
                multiline
                minRows={14}
                required
                helperText="Markdown, HTML, or plain text (max ~200000 chars)"
              />
              {selected?.updated_at ? (
                <Typography variant="caption" color="text.secondary">
                  Last updated {fDateTime(String(selected.updated_at))}
                </Typography>
              ) : null}
              <Stack direction="row" justifyContent="flex-end">
                <Button
                  variant="contained"
                  disabled={mutation.isPending || !title.trim() || !content.trim()}
                  startIcon={mutation.isPending ? <CircularProgress size={16} /> : null}
                  onClick={() => mutation.mutate()}
                >
                  Save policy
                </Button>
              </Stack>
            </Stack>
          </Card>
        </Box>
      )}
    </DashboardContent>
  );
}
