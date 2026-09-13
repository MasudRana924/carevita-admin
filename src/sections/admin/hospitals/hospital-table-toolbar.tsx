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

import { useRouter } from 'src/routes/hooks';

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

type HospitalTableToolbarProps = {
  numSelected: number;
  filterName: string;
  districtFilter: string;
  typeFilter: string;
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDistrictFilterChange: (value: string) => void;
  onTypeFilterChange: (value: string) => void;
  onClearFilters: () => void;
};

export function HospitalTableToolbar({
  numSelected,
  filterName,
  districtFilter,
  typeFilter,
  onFilterName,
  onDistrictFilterChange,
  onTypeFilterChange,
  onClearFilters,
}: HospitalTableToolbarProps) {
  const router = useRouter();
  const hasFilters = Boolean(filterName || districtFilter || typeFilter);

  const handleNewHospital = () => {
    router.push('/hospitals/new');
  };

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
            flex: 1,
            minWidth: 0,
          }}
        >
          <OutlinedInput
            value={filterName}
            onChange={onFilterName}
            placeholder="Search hospital..."
            startAdornment={
              <InputAdornment position="start">
                <LucideIcon width={20} icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            }
            sx={{ flex: 1, minWidth: 180, maxWidth: 320, ...CONTROL_SX }}
          />

          <FormControl sx={{ minWidth: 160, flexShrink: 0 }}>
            <Select
              value={districtFilter}
              onChange={(e) => onDistrictFilterChange(e.target.value)}
              displayEmpty
              sx={CONTROL_SX}
            >
              <MenuItem value="">All Districts</MenuItem>
              <MenuItem value="Dhaka">Dhaka</MenuItem>
              <MenuItem value="Chittagong">Chittagong</MenuItem>
              <MenuItem value="Khulna">Khulna</MenuItem>
              <MenuItem value="Rajshahi">Rajshahi</MenuItem>
              <MenuItem value="Sylhet">Sylhet</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 160, flexShrink: 0 }}>
            <Select
              value={typeFilter}
              onChange={(e) => onTypeFilterChange(e.target.value)}
              displayEmpty
              sx={CONTROL_SX}
            >
              <MenuItem value="">All Types</MenuItem>
              <MenuItem value="government">Government</MenuItem>
              <MenuItem value="private">Private</MenuItem>
              <MenuItem value="specialized">Specialized</MenuItem>
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

      <Box sx={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton sx={{ color: 'error.main' }}>
              <LucideIcon icon="solar:trash-bin-trash-bold" />
            </IconButton>
          </Tooltip>
        ) : (
          <Button
            variant="contained"
            color="inherit"
            startIcon={<LucideIcon icon="mingcute:add-line" />}
            onClick={handleNewHospital}
            sx={{ height: 56, whiteSpace: 'nowrap' }}
          >
            New Hospital
          </Button>
        )}
      </Box>
    </Toolbar>
  );
}
