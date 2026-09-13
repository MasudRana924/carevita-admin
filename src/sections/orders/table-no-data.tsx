import Box from '@mui/material/Box';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import Typography from '@mui/material/Typography';

import { LucideIcon } from 'src/components/lucide-icons';

// ----------------------------------------------------------------------

type TableNoDataProps = {
  searchQuery?: string;
};

export function TableNoData({ searchQuery }: TableNoDataProps) {
  return (
    <TableRow>
      <TableCell colSpan={9} align="center" sx={{ py: 6 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
          <LucideIcon 
            icon="eva:file-text-outline" 
            sx={{ 
              fontSize: 64, 
              color: 'text.disabled',
              opacity: 0.5,
            }} 
          />
          <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 500 }}>
            No Data found
          </Typography>

          {searchQuery && (
            <Typography variant="body2" sx={{ color: 'text.disabled', textAlign: 'center' }}>
              No results found for &nbsp;
              <strong>&quot;{searchQuery}&quot;</strong>.
              <br /> Try checking for typos or using complete words.
            </Typography>
          )}
        </Box>
      </TableCell>
    </TableRow>
  );
}
