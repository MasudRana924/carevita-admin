import type { IconButtonProps } from '@mui/material/IconButton';

import IconButton from '@mui/material/IconButton';

import { LucideIcon } from 'src/components/lucide-icons';

// ----------------------------------------------------------------------

export function MenuButton({ sx, ...other }: IconButtonProps) {
  return (
    <IconButton sx={sx} {...other}>
      <LucideIcon icon="custom:menu-duotone" width={28} />
    </IconButton>
  );
}
