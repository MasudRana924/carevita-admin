import { useCallback } from 'react';

import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';

import { LucideIcon } from 'src/components/lucide-icons';
import { _suppliers } from 'src/_mock';

// ----------------------------------------------------------------------

// Purchase Order status data for autocomplete
const purchaseOrderStatuses = [
  { id: '1', name: 'Draft' },
  { id: '2', name: 'Sent' },
  { id: '3', name: 'Confirmed' },
  { id: '4', name: 'Shipped' },
  { id: '5', name: 'Received' },
  { id: '6', name: 'Cancelled' },
];

type Props = {
  numSelected: number;
  filters: {
    name: string;
    status: string;
    supplier: string;
  };
  onFilters: (name: string, value: string) => void;
  purchaseOrderNumbers: string[];
  onDeleteSelected?: VoidFunction;
};

export function PurchaseOrdersTableToolbar({ 
  numSelected, 
  filters, 
  onFilters, 
  purchaseOrderNumbers,
  onDeleteSelected 
}: Props) {
  const handleFilterName = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      onFilters('name', event.target.value);
    },
    [onFilters]
  );

  const handleStatusChange = useCallback((event: any, newValue: any) => {
    // Create a synthetic event to match the expected interface
    const syntheticEvent = {
      target: {
        value: newValue ? newValue.name : 'all'
      }
    } as React.ChangeEvent<HTMLInputElement>;
    onFilters('status', syntheticEvent.target.value);
  }, [onFilters]);

  const handleSupplierChange = useCallback((event: any, newValue: any) => {
    // Create a synthetic event to match the expected interface
    const syntheticEvent = {
      target: {
        value: newValue ? newValue.name : 'all'
      }
    } as React.ChangeEvent<HTMLInputElement>;
    onFilters('supplier', syntheticEvent.target.value);
  }, [onFilters]);

  // Get the selected status object
  const selectedStatus = filters.status !== 'all' 
    ? purchaseOrderStatuses.find(status => status.name === filters.status) 
    : null;

  // Get the selected supplier object
  const selectedSupplier = filters.supplier !== 'all' 
    ? _suppliers.find(supplier => supplier.name === filters.supplier) 
    : null;

  // Check if any filters are active
  const hasActiveFilters = filters.name || filters.status !== 'all' || filters.supplier !== 'all';

  const handleClearFilters = useCallback(() => {
    onFilters('name', '');
    onFilters('status', 'all');
    onFilters('supplier', 'all');
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
          placeholder="Search purchase orders..."
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
          options={purchaseOrderStatuses}
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

        <Autocomplete
          options={_suppliers}
          getOptionLabel={(option) => option.name}
          value={selectedSupplier}
          onChange={handleSupplierChange}
          renderInput={(params) => (
            <TextField
              {...params}
              label="Supplier"
              placeholder="Search suppliers..."
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
