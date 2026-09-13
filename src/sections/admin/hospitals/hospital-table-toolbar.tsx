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

type HospitalTableToolbarProps = {
  numSelected: number;
  filterName: string;
  districtFilter: string;
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onDistrictFilterChange: (value: string) => void;
  onClearFilters: () => void;
};

export function HospitalTableToolbar({
  numSelected,
  filterName,
  districtFilter,
  onFilterName,
  onDistrictFilterChange,
  onClearFilters,
}: HospitalTableToolbarProps) {
  const router = useRouter();

  const handleNewHospital = () => {
    router.push('/hospitals/new');
  };

  return (
    <Toolbar
      sx={{
        height: 96,
        display: 'flex',
        justifyContent: 'space-between',
        p: (theme) => theme.spacing(0, 1, 0, 3),
      }}
    >
      {numSelected > 0 ? (
        <Typography component="div" variant="subtitle1">
          {numSelected} selected
        </Typography>
      ) : (
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
          <OutlinedInput
            fullWidth
            value={filterName}
            onChange={onFilterName}
            placeholder="Search hospital..."
            startAdornment={
              <InputAdornment position="start">
                <LucideIcon width={20} icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            }
            sx={{ maxWidth: 320 }}
          />
          
          <FormControl sx={{ minWidth: 150 }}>
            <Select
              value={districtFilter}
              onChange={(e) => onDistrictFilterChange(e.target.value)}
              displayEmpty
              size="small"
            >
              <MenuItem value="">All Districts</MenuItem>
              <MenuItem value="Dhaka">Dhaka</MenuItem>
              <MenuItem value="Chittagong">Chittagong</MenuItem>
              <MenuItem value="Khulna">Khulna</MenuItem>
              <MenuItem value="Rajshahi">Rajshahi</MenuItem>
              <MenuItem value="Sylhet">Sylhet</MenuItem>
            </Select>
          </FormControl>

          {(filterName || districtFilter) && (
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
        </div>
      )}

      <Box sx={{ display: 'flex', gap: 1 }}>
        {numSelected > 0 && (
          <Tooltip title="Delete">
            <IconButton sx={{ color: 'error.main' }}>
              <LucideIcon icon="solar:trash-bin-trash-bold" />
            </IconButton>
          </Tooltip>
        )}
        
        {numSelected === 0 && (
          <Button
            variant="contained"
            color="inherit"
            startIcon={<LucideIcon icon="mingcute:add-line" />}
            onClick={handleNewHospital}
          >
            New Hospital
          </Button>
        )}
      </Box>
    </Toolbar>
  );
}
