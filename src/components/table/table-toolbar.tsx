import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { LucideIcon } from 'src/components/lucide-icons';

// ----------------------------------------------------------------------

type Props = {
  filters?: React.ReactNode;
  actions?: React.ReactNode;
  onFilters?: VoidFunction;
  onResetFilters?: VoidFunction;
  results?: number;
  sx?: object;
};

export function TableToolbar({ filters, actions, onFilters, onResetFilters, results, sx, ...other }: Props) {
  return (
    <Stack
      spacing={2.5}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      direction={{
        xs: 'column',
        md: 'row',
      }}
      sx={{
        p: 2.5,
        pr: { xs: 2.5, md: 1 },
        ...sx,
      }}
      {...other}
    >
      <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
        {filters && (
          <Button
            color="inherit"
            variant="outlined"
            startIcon={<LucideIcon icon="ic:round-filter-list" />}
            onClick={onFilters}
          >
            Filters
          </Button>
        )}

        <Box sx={{ flexGrow: 1 }} />

        {actions}
      </Stack>
    </Stack>
  );
}
