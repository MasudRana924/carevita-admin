import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import Checkbox from '@mui/material/Checkbox';
import MenuList from '@mui/material/MenuList';
import TableCell from '@mui/material/TableCell';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import MenuItem, { menuItemClasses } from '@mui/material/MenuItem';

import { useRouter } from 'src/routes/hooks';

import { fDate } from 'src/utils/format-time';
import { fShortenNumber } from 'src/utils/format-number';

import { LucideIcon } from 'src/components/lucide-icons';

// ----------------------------------------------------------------------

export type BlogTableRowProps = {
  id: string;
  title: string;
  coverUrl: string;
  totalViews: number;
  description: string;
  totalShares: number;
  totalComments: number;
  totalFavorites: number;
  postedAt: string | number | null;
  author: {
    name: string;
    avatarUrl: string;
  };
};

type BlogTableRowComponentProps = {
  row: BlogTableRowProps;
  selected: boolean;
  onSelectRow: () => void;
};

export function BlogTableRow({ row, selected, onSelectRow }: BlogTableRowComponentProps) {
  const router = useRouter();
  const [openPopover, setOpenPopover] = useState<HTMLButtonElement | null>(null);

  const handleOpenPopover = useCallback((event: React.MouseEvent<HTMLButtonElement>) => {
    setOpenPopover(event.currentTarget);
  }, []);

  const handleClosePopover = useCallback(() => {
    setOpenPopover(null);
  }, []);

  const handleEdit = useCallback(() => {
    handleClosePopover();
    router.push(`/dashboard/blog/${row.id}`);
  }, [router, row.id, handleClosePopover]);

  const handleDelete = useCallback(() => {
    handleClosePopover();
    // Handle delete logic here
    console.log('Delete blog:', row.id);
  }, [row.id, handleClosePopover]);

  return (
    <>
      <TableRow tabIndex={-1} role="checkbox" selected={selected}>
        <TableCell padding="checkbox">
          <Checkbox disableRipple checked={selected} onChange={onSelectRow} />
        </TableCell>

                 <TableCell component="th" scope="row">
           <Box
             sx={{
               gap: 2,
               display: 'flex',
               alignItems: 'center',
             }}
           >
             <Box
               component="img"
               alt={row.title}
               src={row.coverUrl}
               sx={{
                 width: 48,
                 height: 48,
                 borderRadius: 1,
                 objectFit: 'cover',
               }}
             />
                           <Typography variant="subtitle2" noWrap>
                {row.title.length > 50 ? `${row.title.slice(0, 50)}...` : row.title}
              </Typography>
           </Box>
         </TableCell>

        <TableCell>
          <Box
            sx={{
              gap: 1,
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <Avatar alt={row.author.name} src={row.author.avatarUrl} sx={{ width: 32, height: 32 }} />
            <Typography variant="body2">{row.author.name}</Typography>
          </Box>
        </TableCell>

        <TableCell>
          <Typography variant="body2">{fDate(row.postedAt)}</Typography>
        </TableCell>

        <TableCell align="center">
          <Typography variant="body2">{fShortenNumber(row.totalViews)}</Typography>
        </TableCell>

        <TableCell align="center">
          <Typography variant="body2">{fShortenNumber(row.totalComments)}</Typography>
        </TableCell>

        <TableCell align="right">
          <IconButton onClick={handleOpenPopover}>
            <LucideIcon icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <Popover
        open={!!openPopover}
        anchorEl={openPopover}
        onClose={handleClosePopover}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <MenuList
          disablePadding
          sx={{
            p: 0.5,
            gap: 0.5,
            width: 140,
            display: 'flex',
            flexDirection: 'column',
            [`& .${menuItemClasses.root}`]: {
              px: 1,
              gap: 2,
              borderRadius: 0.75,
              [`&.${menuItemClasses.selected}`]: { bgcolor: 'action.selected' },
            },
          }}
        >
          <MenuItem onClick={handleEdit}>
            <LucideIcon icon="solar:pen-bold" />
            Edit
          </MenuItem>

          <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
            <LucideIcon icon="solar:trash-bin-trash-bold" />
            Delete
          </MenuItem>
        </MenuList>
      </Popover>
    </>
  );
}
