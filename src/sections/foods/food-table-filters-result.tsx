import type { StackProps } from '@mui/material/Stack';

import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

import { LucideIcon } from 'src/components/lucide-icons';

// ----------------------------------------------------------------------

type Props = StackProps & {
  filters: {
    name: string;
    category: string;
    available: string;
  };
  onFilters: (name: string, value: string) => void;
  onResetFilters: VoidFunction;
  results: number;
};

export function FoodTableFiltersResult({
  filters,
  onFilters,
  onResetFilters,
  results,
  ...other
}: Props) {
  const handleRemoveKeyword = () => {
    onFilters('name', '');
  };

  const handleRemoveCategory = () => {
    onFilters('category', 'all');
  };

  const handleRemoveAvailable = () => {
    onFilters('available', 'all');
  };

  const hasFilter = filters.name !== '' || filters.category !== 'all' || filters.available !== 'all';

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
          {filters.name !== '' && (
            <Block label="Name:">
              <Chip size="small" label={filters.name} onDelete={handleRemoveKeyword} />
            </Block>
          )}

          {filters.category !== 'all' && (
            <Block label="Category:">
              <Chip size="small" label={filters.category} onDelete={handleRemoveCategory} />
            </Block>
          )}

          {filters.available !== 'all' && (
            <Block label="Available:">
              <Chip
                size="small"
                label={filters.available === 'true' ? 'Available' : 'Unavailable'}
                onDelete={handleRemoveAvailable}
              />
            </Block>
          )}

          <Button
            color="error"
            onClick={onResetFilters}
            startIcon={<LucideIcon icon="solar:trash-bin-trash-bold" />}
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
