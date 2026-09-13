import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Stack, { StackProps } from '@mui/material/Stack';

import { LucideIcon } from 'src/components/lucide-icons';

// ----------------------------------------------------------------------

type Props = StackProps & {
  filters: {
    name: string;
    status: string;
  };
  onFilters: (name: string, value: string) => void;
  onResetFilters: VoidFunction;
  results: number;
};

export function CategoriesTableFiltersResult({
  filters,
  onFilters,
  onResetFilters,
  results,
  ...other
}: Props) {
  const handleRemoveKeyword = () => {
    onFilters('name', '');
  };

  const handleRemoveStatus = () => {
    onFilters('status', 'all');
  };

  const hasFilter = !!filters.name || filters.status !== 'all';

  return (
    <Stack spacing={1.5} {...other}>
      <Box sx={{ typography: 'body2' }}>
        <strong>{results}</strong>
        <Box component="span" sx={{ color: 'text.secondary', ml: 0.25 }}>
          results found
        </Box>
      </Box>

      {hasFilter && (
        <Stack flexGrow={1} spacing={1} direction="row" flexWrap="wrap" alignItems="center">
          {!!filters.name && (
            <Block label="Name:">
              <Chip size="small" label={filters.name} onDelete={handleRemoveKeyword} />
            </Block>
          )}

          {filters.status !== 'all' && (
            <Block label="Status:">
              <Chip size="small" label={filters.status} onDelete={handleRemoveStatus} />
            </Block>
          )}

          <Button
            color="error"
            onClick={onResetFilters}
            startIcon={<LucideIcon icon="eva:close-fill" />}
          >
            Clear
          </Button>
        </Stack>
      )}
    </Stack>
  );
}

// ----------------------------------------------------------------------

type BlockProps = {
  label: string;
  children: React.ReactNode;
};

function Block({ label, children }: BlockProps) {
  return (
    <Stack
      component={Paper}
      variant="outlined"
      spacing={1}
      direction="row"
      sx={{
        p: 1,
        borderRadius: 1,
        overflow: 'hidden',
        borderStyle: 'dashed',
      }}
    >
      <Box component="span" sx={{ typography: 'subtitle2' }}>
        {label}
      </Box>

      <Stack spacing={1} direction="row" flexWrap="wrap">
        {children}
      </Stack>
    </Stack>
  );
}
