import { useCallback } from 'react';

import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import { LucideIcon } from 'src/components/lucide-icons';

// ----------------------------------------------------------------------

// Supplier categories data for autocomplete
const supplierCategories = [
  { id: '1', name: 'Electronics' },
  { id: '2', name: 'Clothing' },
  { id: '3', name: 'Home & Garden' },
  { id: '4', name: 'Sports' },
  { id: '5', name: 'Books' },
  { id: '6', name: 'Automotive' },
];

// Supplier status data for autocomplete
const supplierStatuses = [
  { id: '1', name: 'Active' },
  { id: '2', name: 'Inactive' },
  { id: '3', name: 'Pending' },
];

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

export function SuppliersTableToolbar({
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

  const handleCategoryChange = useCallback((event: any, newValue: any) => {
    // Create a synthetic event to match the expected interface
    const syntheticEvent = {
      target: {
        value: newValue ? newValue.name : 'all'
      }
    } as React.ChangeEvent<HTMLInputElement>;
    onFilterCategory(syntheticEvent);
  }, [onFilterCategory]);

  const handleStatusChange = useCallback((event: any, newValue: any) => {
    // Create a synthetic event to match the expected interface
    const syntheticEvent = {
      target: {
        value: newValue ? newValue.name : 'all'
      }
    } as React.ChangeEvent<HTMLInputElement>;
    onFilterStatus(syntheticEvent);
  }, [onFilterStatus]);

  // Get the selected category object
  const selectedCategory = filterCategory !== 'all' 
    ? supplierCategories.find(category => category.name === filterCategory) 
    : null;

  // Get the selected status object
  const selectedStatus = filterStatus !== 'all' 
    ? supplierStatuses.find(status => status.name === filterStatus) 
    : null;

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
          placeholder="Search suppliers..."
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
          options={supplierCategories}
          getOptionLabel={(option) => option.name}
          value={selectedCategory}
          onChange={handleCategoryChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Category"
              placeholder="Search categories..."
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

        <Autocomplete
          options={supplierStatuses}
          getOptionLabel={(option) => option.name}
          value={selectedStatus}
          onChange={handleStatusChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Status"
              placeholder="Search status..."
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
