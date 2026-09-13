import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

export function PageHeader({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }} sx={{ mb: 3, width: 1 }}>
      <Box sx={{ flexGrow: 1 }}>
        <Typography variant="h4">{title}</Typography>
        {description && (
          <Typography variant="body2" sx={{ color: 'text.secondary', mt: 0.5 }}>
            {description}
          </Typography>
        )}
      </Box>
      {action}
    </Stack>
  );
}
