import { useCallback } from 'react';

import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import { LucideIcon } from 'src/components/lucide-icons';

// ----------------------------------------------------------------------

type Props = {
  numSelected: number;
  filterName: string;
  filterCategory: string;
  filterStatus: string;
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFilterCategory: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFilterStatus: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClearFilters: VoidFunction;
};

export function InventoryTableToolbar({
  numSelected,
  filterName,
  filterCategory,
  filterStatus,
  onFilterName,
  onFilterCategory,
  onFilterStatus,
  onClearFilters,
}: Props) {
  const handleClearFilters = useCallback(() => {
    onClearFilters();
  }, [onClearFilters]);

  // Check if any filters are active
  const hasActiveFilters = filterName || filterCategory !== 'all' || filterStatus !== 'all';

  return (
    <Stack
      spacing={2}
      alignItems={{ xs: 'flex-end', md: 'center' }}
      direction={{
        xs: 'column',
        md: 'row',
      }}
      sx={{
        p: 2.5,
        pr: { xs: 2.5, md: 1 },
      }}
    >
      <Stack direction="row" alignItems="center" spacing={2} flexGrow={1} sx={{ width: 1 }}>
        <TextField
          value={filterName}
          onChange={onFilterName}
          placeholder="Search inventory..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LucideIcon icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 320 }}
        />

        <TextField
          select
          label="Category"
          value={filterCategory}
          onChange={onFilterCategory}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="all">All Categories</MenuItem>
          <MenuItem value="Electronics">Electronics</MenuItem>
          <MenuItem value="Clothing">Clothing</MenuItem>
          <MenuItem value="Home & Garden">Home & Garden</MenuItem>
          <MenuItem value="Sports">Sports</MenuItem>
          <MenuItem value="Books">Books</MenuItem>
          <MenuItem value="Automotive">Automotive</MenuItem>
        </TextField>

        <TextField
          select
          label="Status"
          value={filterStatus}
          onChange={onFilterStatus}
          sx={{ minWidth: 200 }}
        >
          <MenuItem value="all">All Status</MenuItem>
          <MenuItem value="In Stock">In Stock</MenuItem>
          <MenuItem value="Low Stock">Low Stock</MenuItem>
          <MenuItem value="Out of Stock">Out of Stock</MenuItem>
          <MenuItem value="Discontinued">Discontinued</MenuItem>
        </TextField>
      </Stack>

      {!!numSelected && (
        <Button
          color="error"
          variant="outlined"
          startIcon={<LucideIcon icon="eva:trash-2-fill" />}
          sx={{
            borderRadius: 2,
            px: 3,
            py: 1.5,
            fontWeight: 600,
            borderWidth: 2,
            whiteSpace: 'nowrap',
            '&:hover': {
              borderWidth: 2,
              backgroundColor: 'error.main',
              color: 'white',
            },
          }}
        >
          Delete ({numSelected})
        </Button>
      )}

      {hasActiveFilters && (
        <Button
          color="error"
          variant="outlined"
          startIcon={<LucideIcon icon="eva:close-fill" />}
          onClick={handleClearFilters}
          sx={{
            borderRadius: 2,
            px: 4,
            py: 1.5,
            minWidth: 160,
            fontWeight: 600,
            borderWidth: 2,
            whiteSpace: 'nowrap',
            '&:hover': {
              borderWidth: 2,
              backgroundColor: 'error.main',
              color: 'white',
            },
          }}
        >
          Clear Filters
        </Button>
      )}
    </Stack>
  );
}
