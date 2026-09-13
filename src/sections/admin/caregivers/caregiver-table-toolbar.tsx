import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';

import { LucideIcon } from 'src/components/lucide-icons';

// ----------------------------------------------------------------------

const CONTROL_SX = {
  height: 56,
  '& .MuiOutlinedInput-input': {
    py: 0,
    height: 56,
    boxSizing: 'border-box',
  },
  '& .MuiSelect-select': {
    display: 'flex',
    alignItems: 'center',
    height: 56,
    boxSizing: 'border-box',
    py: 0,
  },
};

type CaregiverTableToolbarProps = {
  numSelected: number;
  filterName: string;
  verificationFilter: string;
  availabilityFilter: string;
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onVerificationFilterChange: (value: string) => void;
  onAvailabilityFilterChange: (value: string) => void;
  onClearFilters: () => void;
};

export function CaregiverTableToolbar({
  numSelected,
  filterName,
  verificationFilter,
  availabilityFilter,
  onFilterName,
  onVerificationFilterChange,
  onAvailabilityFilterChange,
  onClearFilters,
}: CaregiverTableToolbarProps) {
  const hasFilters = Boolean(filterName || verificationFilter || availabilityFilter);

  return (
    <Toolbar
      sx={{
        minHeight: { xs: 88, md: 96 },
        height: 'auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 2,
        px: 3,
        py: 2,
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            width: 1,
            minWidth: 0,
          }}
        >
          <OutlinedInput
            value={filterName}
            onChange={onFilterName}
            placeholder="Search caregiver..."
            startAdornment={
              <InputAdornment position="start">
                <LucideIcon width={20} icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            }
            sx={{ flex: 1, minWidth: 180, maxWidth: 320, ...CONTROL_SX }}
          />

          <FormControl sx={{ minWidth: 160, flexShrink: 0 }}>
            <Select
              value={verificationFilter}
              onChange={(e) => onVerificationFilterChange(e.target.value)}
              displayEmpty
              sx={CONTROL_SX}
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="PENDING">Pending</MenuItem>
              <MenuItem value="APPROVED">Approved</MenuItem>
              <MenuItem value="SUSPENDED">Suspended</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 180, flexShrink: 0 }}>
            <Select
              value={availabilityFilter}
              onChange={(e) => onAvailabilityFilterChange(e.target.value)}
              displayEmpty
              sx={CONTROL_SX}
            >
              <MenuItem value="">All Availability</MenuItem>
              <MenuItem value="available">Available</MenuItem>
              <MenuItem value="unavailable">Unavailable</MenuItem>
            </Select>
          </FormControl>

          {hasFilters && (
            <Button
              color="error"
              variant="outlined"
              startIcon={<LucideIcon icon="eva:close-fill" />}
              onClick={onClearFilters}
              sx={{
                height: 56,
                borderRadius: 1,
                px: 2.5,
                flexShrink: 0,
                fontWeight: 600,
                whiteSpace: 'nowrap',
              }}
            >
              Clear Filters
            </Button>
          )}
        </Box>
      )}

      {numSelected > 0 && (
        <Tooltip title="Delete">
          <IconButton sx={{ color: 'error.main' }}>
            <LucideIcon icon="solar:trash-bin-trash-bold" />
          </IconButton>
        </Tooltip>
      )}
    </Toolbar>
  );
}
