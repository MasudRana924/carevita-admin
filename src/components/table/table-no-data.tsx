import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import Typography from '@mui/material/Typography';

// ----------------------------------------------------------------------

type Props = {
  notFound: boolean;
  sx?: object;
};

export function TableNoData({ notFound, sx }: Props) {
  return (
    <TableBody>
      {notFound ? (
        <TableRow>
          <TableCell colSpan={12}>
            <Typography variant="h6" sx={{ textAlign: 'center' }}>
              No Data
            </Typography>
          </TableCell>
        </TableRow>
      ) : (
        <TableRow>
          <TableCell colSpan={12} sx={{ p: 0 }} />
        </TableRow>
      )}
    </TableBody>
  );
}
