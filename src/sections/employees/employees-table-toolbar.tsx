import { useCallback } from 'react';

import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import MenuItem from '@mui/material/MenuItem';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import { LucideIcon } from 'src/components/lucide-icons';
import { _departments } from 'src/_mock/_data';

// ----------------------------------------------------------------------

// Employee status data for autocomplete
const employeeStatuses = [
  { id: '1', name: 'Active' },
  { id: '2', name: 'Inactive' },
  { id: '3', name: 'On Leave' },
];

type Props = {
  numSelected: number;
  filterName: string;
  filterDepartment: string;
  filterStatus: string;
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFilterDepartment: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFilterStatus: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClearFilters: VoidFunction;
};

export function EmployeesTableToolbar({
  numSelected,
  filterName,
  filterDepartment,
  filterStatus,
  onFilterName,
  onFilterDepartment,
  onFilterStatus,
  onClearFilters,
}: Props) {
  const handleClearFilters = useCallback(() => {
    onClearFilters();
  }, [onClearFilters]);

  const handleDepartmentChange = useCallback((event: any, newValue: any) => {
    // Create a synthetic event to match the expected interface
    const syntheticEvent = {
      target: {
        value: newValue ? newValue.name : 'all'
      }
    } as React.ChangeEvent<HTMLInputElement>;
    onFilterDepartment(syntheticEvent);
  }, [onFilterDepartment]);

  const handleStatusChange = useCallback((event: any, newValue: any) => {
    // Create a synthetic event to match the expected interface
    const syntheticEvent = {
      target: {
        value: newValue ? newValue.name : 'all'
      }
    } as React.ChangeEvent<HTMLInputElement>;
    onFilterStatus(syntheticEvent);
  }, [onFilterStatus]);

  // Get the selected department object
  const selectedDepartment = filterDepartment !== 'all' 
    ? _departments.find(dept => dept.name === filterDepartment) 
    : null;

  // Get the selected status object
  const selectedStatus = filterStatus !== 'all' 
    ? employeeStatuses.find(status => status.name === filterStatus) 
    : null;

  // Check if any filters are active
  const hasActiveFilters = filterName || filterDepartment !== 'all' || filterStatus !== 'all';

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
          options={_departments}
          getOptionLabel={(option) => option.name}
          value={selectedDepartment}
          onChange={handleDepartmentChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Department"
              placeholder="Search departments..."
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
          options={employeeStatuses}
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
