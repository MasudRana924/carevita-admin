import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';

import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

type ProductTableToolbarProps = {
  numSelected: number;
  filterName: string;
  onFilterName: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onClearFilters: () => void;
};

export function ProductTableToolbar({ numSelected, filterName, onFilterName, onClearFilters }: ProductTableToolbarProps) {
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <OutlinedInput
            fullWidth
            value={filterName}
            onChange={onFilterName}
            placeholder="Search product..."
            startAdornment={
              <InputAdornment position="start">
                <Iconify width={20} icon="solar:magnifer-linear" sx={{ color: 'text.disabled' }} />
              </InputAdornment>
            }
            sx={{ maxWidth: 320 }}
          />
          {filterName && (
            <Button
              color="error"
              variant="outlined"
              startIcon={<Iconify icon="solar:close-circle-bold" />}
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
             <Iconify icon="solar:trash-bin-trash-bold" />
           </IconButton>
         </Tooltip>
       )}
    </Toolbar>
  );
}
