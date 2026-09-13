import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export function ErrorState({
  message,
  onRetry,
}: {
  message?: string;
  onRetry?: () => void;
}) {
  return (
    <Alert
      severity="error"
      action={
        onRetry ? (
          <Button color="inherit" size="small" onClick={onRetry}>
            Retry
          </Button>
        ) : undefined
      }
    >
      {message || 'Something went wrong. Please try again.'}
    </Alert>
  );
}

export function EmptyState({
  title,
  description,
}: {
  title: string;
  description?: string;
}) {
  return (
    <Box sx={{ py: 8, textAlign: 'center' }}>
      <Typography variant="h6">{title}</Typography>
      {description && (
        <Typography variant="body2" sx={{ color: 'text.secondary', mt: 1 }}>
          {description}
        </Typography>
      )}
    </Box>
  );
}

export function TableSkeleton({ rows = 6 }: { rows?: number }) {
  return (
    <Stack spacing={1.5} sx={{ p: 2 }}>
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton key={index} variant="rounded" height={44} />
      ))}
    </Stack>
  );
}

export function CardSkeletonGrid({ count = 5 }: { count?: number }) {
  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: 'repeat(5, 1fr)' },
      }}
    >
      {Array.from({ length: count }).map((_, index) => (
        <Card key={index} sx={{ p: 2.5 }}>
          <Skeleton width="40%" />
          <Skeleton height={36} sx={{ mt: 1.5 }} />
        </Card>
      ))}
    </Box>
  );
}

export function DetailSkeleton() {
  return (
    <Stack spacing={3} sx={{ width: 1 }}>
      <Stack spacing={1}>
        <Skeleton variant="text" width={220} height={40} />
        <Skeleton variant="text" width={320} height={24} />
      </Stack>

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
          <Skeleton variant="circular" width={88} height={88} />
          <Stack spacing={1} sx={{ flexGrow: 1 }}>
            <Skeleton variant="text" width={240} height={32} />
            <Skeleton variant="text" width={280} height={20} />
            <Stack direction="row" spacing={1}>
              <Skeleton variant="rounded" width={72} height={24} />
              <Skeleton variant="rounded" width={72} height={24} />
              <Skeleton variant="rounded" width={96} height={24} />
            </Stack>
          </Stack>
        </Stack>
      </Card>

      <Box
        sx={{
          display: 'grid',
          gap: 3,
          gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' },
        }}
      >
        {[0, 1].map((card) => (
          <Card
            key={card}
            sx={{
              p: 3,
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              boxShadow: 'none',
            }}
          >
            <Skeleton variant="text" width={160} height={28} sx={{ mb: 2 }} />
            <Box
              sx={{
                display: 'grid',
                gap: 2,
                gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' },
              }}
            >
              {Array.from({ length: 6 }).map((_, index) => (
                <Stack key={index} spacing={0.75}>
                  <Skeleton variant="text" width={88} height={16} />
                  <Skeleton variant="rounded" height={40} />
                </Stack>
              ))}
            </Box>
          </Card>
        ))}
      </Box>
    </Stack>
  );
}
