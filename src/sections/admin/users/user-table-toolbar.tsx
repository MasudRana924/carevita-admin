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

type UserTableToolbarProps = {
  numSelected: number;
  filterName: string;
  roleFilter: string;
  statusFilter: string;
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRoleFilterChange: (value: string) => void;
  onStatusFilterChange: (value: string) => void;
  onClearFilters: () => void;
};

export function UserTableToolbar({
  numSelected,
  filterName,
  roleFilter,
  statusFilter,
  onFilterName,
  onRoleFilterChange,
  onStatusFilterChange,
  onClearFilters,
}: UserTableToolbarProps) {
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
            placeholder="Search user..."
            startAdornment={
              <InputAdornment position="start">
                <LucideIcon width={20} icon="eva:search-fill" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            }
            sx={{ maxWidth: 320 }}
          />
          
          <FormControl sx={{ minWidth: 120 }}>
            <Select
              value={roleFilter}
              onChange={(e) => onRoleFilterChange(e.target.value)}
              displayEmpty
              size="small"
            >
              <MenuItem value="">All Roles</MenuItem>
              <MenuItem value="USER">User</MenuItem>
              <MenuItem value="CAREGIVER">Caregiver</MenuItem>
              <MenuItem value="ADMIN">Admin</MenuItem>
            </Select>
          </FormControl>

          <FormControl sx={{ minWidth: 120 }}>
            <Select
              value={statusFilter}
              onChange={(e) => onStatusFilterChange(e.target.value)}
              displayEmpty
              size="small"
            >
              <MenuItem value="">All Status</MenuItem>
              <MenuItem value="active">Active</MenuItem>
              <MenuItem value="blocked">Blocked</MenuItem>
            </Select>
          </FormControl>

          {(filterName || roleFilter || statusFilter) && (
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
