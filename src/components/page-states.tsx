import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import Skeleton from '@mui/material/Skeleton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { PageLoader } from './page-loader';

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
  return <PageLoader minHeight={Math.max(rows, 4) * 56} />;
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
  return <PageLoader minHeight="60vh" />;
}
