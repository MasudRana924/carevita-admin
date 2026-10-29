import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect, useMemo, useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CircularProgress from '@mui/material/CircularProgress';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';
import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';
import { PremiumSwitch } from 'src/components/detail-ui';
import { PageHeader } from 'src/components/page-header';
import { DetailSkeleton, ErrorState } from 'src/components/page-states';
import { useSnackbar } from 'src/components/snackbar';
import { privacyPoliciesApi } from 'src/lib/api';
import { asList, getErrorMessage, pickString } from 'src/lib/utils';
import { fDateTime } from 'src/utils/format-time';

const AUDIENCES = ['USER', 'CAREGIVER'] as const;

const AUDIENCE_TABS: Record<(typeof AUDIENCES)[number], { label: string; icon: string }> = {
  USER: { label: 'User', icon: 'solar:users-group-rounded-bold-duotone' },
  CAREGIVER: { label: 'Caregiver', icon: 'solar:hand-heart-bold-duotone' },
};

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
      setTitle(
        audience === 'USER' ? 'Privacy Policy for Families' : 'Privacy Policy for Caregivers'
      );
      setContent('');
      setVersion('1.0');
      setIsPublished(true);
      return;
    }
    setTitle(pickString(selected, ['title'], ''));
    setContent(
      pickString(selected, ['content'], '') === '—' ? '' : pickString(selected, ['content'], '')
    );
    setVersion(
      pickString(selected, ['version'], '1.0') === '—'
        ? '1.0'
        : pickString(selected, ['version'], '1.0')
    );
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
    <DashboardContent>
      <PageHeader
        title="Privacy policies"
        description="Manage USER and CAREGIVER privacy policy content shown in the apps"
        breadcrumbs={[{ title: 'Dashboard', href: '/dashboard' }, { title: 'Privacy policies' }]}
      />

      {query.isLoading ? (
        <DetailSkeleton />
      ) : query.error ? (
        <ErrorState message={getErrorMessage(query.error)} onRetry={() => query.refetch()} />
      ) : (
        <Card sx={{ border: '1px solid', borderColor: 'divider', boxShadow: 'none' }}>
          <Tabs value={audience} onChange={(_event, value) => setAudience(value)} sx={{ px: 3 }}>
            {AUDIENCES.map((value) => {
              const row = policies.find((item) => pickString(item, ['audience']) === value);
              const isDraft = row && asRecord(row).is_published === false;
              return (
                <Tab
                  key={value}
                  value={value}
                  iconPosition="start"
                  icon={<Iconify icon={AUDIENCE_TABS[value].icon} width={22} />}
                  label={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {AUDIENCE_TABS[value].label}
                      <Label
                        variant="soft"
                        color={!row ? 'default' : isDraft ? 'warning' : 'success'}
                      >
                        {!row ? 'New' : isDraft ? 'Draft' : 'Published'}
                      </Label>
                    </Box>
                  }
                />
              );
            })}
          </Tabs>

          <Stack spacing={2.5} sx={{ p: 3 }}>
            <Stack
              direction={{ xs: 'column', md: 'row' }}
              spacing={2}
              alignItems={{ md: 'center' }}
            >
              <TextField
                label="Title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
                sx={{ flexGrow: 1 }}
              />
              <TextField
                label="Version"
                value={version}
                onChange={(event) => setVersion(event.target.value)}
                sx={{ width: { md: 160 } }}
              />
              <Box
                component="label"
                sx={{
                  px: 2,
                  gap: 1.5,
                  height: 54,
                  flexShrink: 0,
                  display: 'flex',
                  cursor: 'pointer',
                  alignItems: 'center',
                  borderRadius: 1,
                  border: '1px solid',
                  borderColor: isPublished ? 'success.light' : 'divider',
                  bgcolor: isPublished ? 'success.lighter' : 'background.neutral',
                  transition: 'all 200ms ease',
                }}
              >
                <Box>
                  <Typography
                    variant="subtitle2"
                    sx={{ color: isPublished ? 'success.darker' : 'text.primary' }}
                  >
                    {isPublished ? 'Published' : 'Draft'}
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{ color: 'text.secondary', display: 'block', lineHeight: 1.2 }}
                  >
                    {isPublished ? 'Visible in the apps' : 'Hidden from users'}
                  </Typography>
                </Box>
                <PremiumSwitch
                  checked={isPublished}
                  onChange={(event) => setIsPublished(event.target.checked)}
                  inputProps={{ 'aria-label': 'Published' }}
                />
              </Box>
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
      )}
    </DashboardContent>
  );
}
