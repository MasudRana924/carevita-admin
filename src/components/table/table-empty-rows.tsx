import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';

// ----------------------------------------------------------------------

type Props = {
  height: number;
  emptyRows: number;
};

export function TableEmptyRows({ emptyRows, height }: Props) {
  if (!emptyRows) {
    return null;
  }

  return (
    <>
      {[...Array(emptyRows)].map((_, index) => (
        <TableRow key={index} sx={{ height }}>
          <TableCell colSpan={9} />
        </TableRow>
      ))}
    </>
  );
}
