import type { ReactNode } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

function humanize(key: string) {
  return key.replace(/_/g, ' ').replace(/\b\w/g, (char) => char.toUpperCase());
}

function stringify(value: unknown): string {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (Array.isArray(value)) return value.length ? value.map(stringify).join(', ') : '—';
  if (typeof value === 'object') return JSON.stringify(value);
  return String(value);
}

export function InfoField({ label, value }: { label: string; value?: ReactNode }) {
  const empty = value === undefined || value === null || value === '';

  return (
    <Stack spacing={0.5} sx={{ minWidth: 0 }}>
      <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 600, letterSpacing: 0.2 }}>
        {label}
      </Typography>
      {empty || typeof value === 'string' || typeof value === 'number' ? (
        <Typography variant="body2" sx={{ color: 'text.primary', wordBreak: 'break-word' }}>
          {empty ? '—' : value}
        </Typography>
      ) : (
        <Box sx={{ minHeight: 22 }}>{value}</Box>
      )}
    </Stack>
  );
}

export function InfoCard({
  title,
  children,
  action,
}: {
  title: string;
  children: ReactNode;
  action?: ReactNode;
}) {
  return (
    <Card
      sx={{
        p: 3,
        height: 1,
        borderRadius: 2,
        border: '1px solid',
        borderColor: 'divider',
        boxShadow: 'none',
      }}
    >
      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2.5 }}>
        <Typography variant="h6">{title}</Typography>
        {action}
      </Stack>
      {children}
    </Card>
  );
}

export function RecordFields({
  title,
  record,
  exclude = ['password', 'token', 'refreshToken', 'accessToken'],
}: {
  title?: string;
  record?: Record<string, unknown> | null;
  exclude?: string[];
}) {
  const entries = Object.entries(record || {}).filter(
    ([key, value]) => !exclude.includes(key) && typeof value !== 'object'
  );

  if (!entries.length) {
    return null;
  }

  const body = (
    <Box
      sx={{
        display: 'grid',
        gap: 2.5,
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
      }}
    >
      {entries.map(([key, value]) => (
        <InfoField key={key} label={humanize(key)} value={stringify(value)} />
      ))}
    </Box>
  );

  if (!title) {
    return (
      <Card
        sx={{
          p: 3,
          borderRadius: 2,
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: 'none',
        }}
      >
        {body}
      </Card>
    );
  }

  return <InfoCard title={title}>{body}</InfoCard>;
}
