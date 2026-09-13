import { useCallback } from 'react';

import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import { LucideIcon } from 'src/components/lucide-icons';

// ----------------------------------------------------------------------

// Review period data for autocomplete
const reviewPeriods = [
  { id: '1', name: 'Q1 2024' },
  { id: '2', name: 'Q2 2024' },
  { id: '3', name: 'Q3 2024' },
  { id: '4', name: 'Q4 2024' },
  { id: '5', name: 'Annual 2024' },
];

// Review status data for autocomplete
const reviewStatuses = [
  { id: '1', name: 'Draft' },
  { id: '2', name: 'In Progress' },
  { id: '3', name: 'Completed' },
  { id: '4', name: 'Approved' },
];

type Props = {
  numSelected: number;
  filterName: string;
  filterPeriod: string;
  filterPerformance: string;
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFilterPeriod: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFilterPerformance: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClearFilters: VoidFunction;
  onDeleteRows: VoidFunction;
};

export function PerformanceReviewsTableToolbar({
  numSelected,
  filterName,
  filterPeriod,
  filterPerformance,
  onFilterName,
  onFilterPeriod,
  onFilterPerformance,
  onClearFilters,
  onDeleteRows,
}: Props) {
  const handleClearFilters = useCallback(() => {
    onClearFilters();
  }, [onClearFilters]);

  const handlePeriodChange = useCallback((event: any, newValue: any) => {
    const syntheticEvent = {
      target: {
        value: newValue ? newValue.name : 'all'
      }
    } as React.ChangeEvent<HTMLInputElement>;
    onFilterPeriod(syntheticEvent);
  }, [onFilterPeriod]);

  const handlePerformanceChange = useCallback((event: any, newValue: any) => {
    const syntheticEvent = {
      target: {
        value: newValue ? newValue.name : 'all'
      }
    } as React.ChangeEvent<HTMLInputElement>;
    onFilterPerformance(syntheticEvent);
  }, [onFilterPerformance]);

  const selectedPeriod = filterPeriod !== 'all' 
    ? reviewPeriods.find(period => period.name === filterPeriod) 
    : null;

  const selectedPerformance = filterPerformance !== 'all' 
    ? reviewStatuses.find(status => status.name === filterPerformance) 
    : null;

  const hasActiveFilters = filterName || filterPeriod !== 'all' || filterPerformance !== 'all';

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
          placeholder="Search employees..."
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LucideIcon icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 320 }}
        />

        <Autocomplete
          options={reviewPeriods}
          getOptionLabel={(option) => option.name}
          value={selectedPeriod}
          onChange={handlePeriodChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Review Period"
              placeholder="Search periods..."
            />
          )}
          sx={{ minWidth: 200 }}
        />

        <Autocomplete
          options={reviewStatuses}
          getOptionLabel={(option) => option.name}
          value={selectedPerformance}
          onChange={handlePerformanceChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Performance"
              placeholder="Search performance..."
            />
          )}
          sx={{ minWidth: 200 }}
        />
      </Stack>

      {!!numSelected && (
        <Button
          color="error"
          variant="outlined"
          startIcon={<LucideIcon icon="eva:trash-2-fill" />}
          onClick={onDeleteRows}
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
