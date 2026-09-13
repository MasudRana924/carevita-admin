import { useCallback } from 'react';

import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import InputAdornment from '@mui/material/InputAdornment';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';

import { LucideIcon } from 'src/components/lucide-icons';

// ----------------------------------------------------------------------

// Leave type data for autocomplete
const leaveTypes = [
  { id: '1', name: 'Annual Leave' },
  { id: '2', name: 'Sick Leave' },
  { id: '3', name: 'Personal Leave' },
  { id: '4', name: 'Maternity Leave' },
  { id: '5', name: 'Paternity Leave' },
  { id: '6', name: 'Bereavement Leave' },
];

// Leave status data for autocomplete
const leaveStatuses = [
  { id: '1', name: 'Pending' },
  { id: '2', name: 'Approved' },
  { id: '3', name: 'Rejected' },
  { id: '4', name: 'Cancelled' },
];

type Props = {
  numSelected: number;
  filterName: string;
  filterLeaveType: string;
  filterStatus: string;
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFilterLeaveType: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFilterStatus: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClearFilters: VoidFunction;
  onDeleteRows: VoidFunction;
};

export function LeaveManagementTableToolbar({
  numSelected,
  filterName,
  filterLeaveType,
  filterStatus,
  onFilterName,
  onFilterLeaveType,
  onFilterStatus,
  onClearFilters,
  onDeleteRows,
}: Props) {
  const handleClearFilters = useCallback(() => {
    onClearFilters();
  }, [onClearFilters]);

  const handleLeaveTypeChange = useCallback((event: any, newValue: any) => {
    // Create a synthetic event to match the expected interface
    const syntheticEvent = {
      target: {
        value: newValue ? newValue.name : 'all'
      }
    } as React.ChangeEvent<HTMLInputElement>;
    onFilterLeaveType(syntheticEvent);
  }, [onFilterLeaveType]);

  const handleStatusChange = useCallback((event: any, newValue: any) => {
    // Create a synthetic event to match the expected interface
    const syntheticEvent = {
      target: {
        value: newValue ? newValue.name : 'all'
      }
    } as React.ChangeEvent<HTMLInputElement>;
    onFilterStatus(syntheticEvent);
  }, [onFilterStatus]);

  // Get the selected leave type object
  const selectedLeaveType = filterLeaveType !== 'all' 
    ? leaveTypes.find(type => type.name === filterLeaveType) 
    : null;

  // Get the selected status object
  const selectedStatus = filterStatus !== 'all' 
    ? leaveStatuses.find(status => status.name === filterStatus) 
    : null;

  // Check if any filters are active
  const hasActiveFilters = filterName || filterLeaveType !== 'all' || filterStatus !== 'all';

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
          options={leaveTypes}
          getOptionLabel={(option) => option.name}
          value={selectedLeaveType}
          onChange={handleLeaveTypeChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Leave Type"
              placeholder="Search leave types..."
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
          options={leaveStatuses}
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
