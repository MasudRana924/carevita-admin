import { useCallback } from 'react';

import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import { LucideIcon } from 'src/components/lucide-icons';

// ----------------------------------------------------------------------

// Year data for autocomplete
const years = [
  { id: '1', name: '2024' },
  { id: '2', name: '2023' },
  { id: '3', name: '2022' },
  { id: '4', name: '2021' },
];

type Props = {
  numSelected: number;
  filters: {
    name: string;
    year: string;
  };
  onFilters: (name: string, value: string) => void;
  onDeleteSelected?: VoidFunction;
};

export function SalesReportsTableToolbar({ 
  numSelected, 
  filters, 
  onFilters, 
  onDeleteSelected 
}: Props) {
  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters('name', event.target.value);
    },
    [onFilters]
  );

  const handleYearChange = useCallback((event: any, newValue: any) => {
    const syntheticEvent = {
      target: {
        value: newValue ? newValue.name : 'all'
      }
    } as React.ChangeEvent<HTMLInputElement>;
    onFilters('year', syntheticEvent.target.value);
  }, [onFilters]);

  // Get the selected year object
  const selectedYear = filters.year !== 'all' 
    ? years.find(year => year.name === filters.year) 
    : null;

  // Check if any filters are active
  const hasActiveFilters = filters.name || filters.year !== 'all';

  const handleClearFilters = useCallback(() => {
    onFilters('name', '');
    onFilters('year', 'all');
  }, [onFilters]);

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
          value={filters.name}
          onChange={handleFilterName}
          placeholder="Search reports..."
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
          options={years}
          getOptionLabel={(option) => option.name}
          value={selectedYear}
          onChange={handleYearChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Year"
              placeholder="Select year..."
            />
          )}
          sx={{
            minWidth: 200,
            '& .MuiAutocomplete-popper': {
              '& .MuiPaper-root': {
                backgroundImage: 'url(/assets/background/overlay.jpg)',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                '& .MuiAutocomplete-listbox': {
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  backdropFilter: 'blur(10px)',
                  '& .MuiAutocomplete-option': {
                    '&:hover': {
                      backgroundColor: 'rgba(0, 0, 0, 0.1)',
                    },
                    '&.Mui-focused': {
                      backgroundColor: 'rgba(0, 0, 0, 0.15)',
                    },
                  },
                },
              },
            },
          }}
          slotProps={{
            popper: {
              sx: {
                '& .MuiPaper-root': {
                  backgroundImage: 'url(/assets/background/overlay.jpg)',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  '& .MuiAutocomplete-listbox': {
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    backdropFilter: 'blur(10px)',
                    '& .MuiAutocomplete-option': {
                      '&:hover': {
                        backgroundColor: 'rgba(0, 0, 0, 0.1)',
                      },
                      '&.Mui-focused': {
                        backgroundColor: 'rgba(0, 0, 0, 0.15)',
                      },
                    },
                  },
                },
              },
            },
          }}
        />
      </Stack>

      {!!numSelected && (
        <Button
          color="error"
          variant="outlined"
          startIcon={<LucideIcon icon="eva:trash-2-fill" />}
          onClick={onDeleteSelected}
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
