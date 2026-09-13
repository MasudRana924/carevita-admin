
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { LucideIcon } from 'src/components/lucide-icons';

// ----------------------------------------------------------------------

type OrderTableToolbarProps = {
  numSelected: number;
  filterName: string;
  filterDate: Date | null;
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onFilterDate: (date: Date | null) => void;
  onClearFilters: () => void;
};

export function OrderTableToolbar({
  numSelected,
  filterName,
  filterDate,
  onFilterName,
  onFilterDate,
  onClearFilters,
}: OrderTableToolbarProps) {
  const hasFilters = filterName || filterDate;

  return (
    <Card
      sx={{
        p: 3,
        border: 'none',
        borderBottom: '1px solid',
        borderColor: 'divider',
        boxShadow: 'none',
        backgroundColor: '#FFFFFF',
        borderRadius: 0,
      }}
    >
      <Stack
        spacing={3}
        direction={{ xs: 'column', sm: 'row' }}
        alignItems={{ xs: 'stretch', sm: 'center' }}
        justifyContent="space-between"
      >
        <Stack
          spacing={2}
          direction={{ xs: 'column', sm: 'row' }}
          alignItems={{ xs: 'stretch', sm: 'center' }}
          sx={{ width: 1, flex: 1 }}
        >
          <TextField
            fullWidth
            value={filterName}
            onChange={onFilterName}
            placeholder="Search orders by number, customer name, or email..."
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LucideIcon icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              minWidth: { xs: '100%', sm: 280 },
              '& .MuiOutlinedInput-root': {
                borderRadius: 2,
                backgroundColor: '#FFFFFF',
                '&:hover': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#000000',
                  },
                },
                '&.Mui-focused': {
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#000000',
                    borderWidth: 2,
                  },
                },
              },
            }}
          />

          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker
              label="Filter by date"
              value={filterDate}
              onChange={onFilterDate}
              slotProps={{
                textField: {
                  fullWidth: true,
                  sx: {
                    minWidth: { xs: '100%', sm: 200 },
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: '#FFFFFF',
                      '&:hover': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#000000',
                        },
                      },
                      '&.Mui-focused': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#000000',
                          borderWidth: 2,
                        },
                      },
                    },
                  },
                },
              }}
            />
          </LocalizationProvider>

                     {hasFilters && (
             <Button
               color="error"
               variant="outlined"
               startIcon={<LucideIcon icon="eva:close-fill" />}
               onClick={onClearFilters}
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

        {numSelected > 0 && (
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
      </Stack>
    </Card>
  );
}
