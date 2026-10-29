import type { IconProps } from '@iconify/react';

import { Icon, addCollection } from '@iconify/react';

import { styled } from '@mui/material/styles';

import solarIcons from './icon-sets';

// ----------------------------------------------------------------------

addCollection(solarIcons);

export type IconifyProps = Omit<React.ComponentProps<typeof IconRoot>, 'icon'> & {
  icon: IconProps['icon'];
  width?: number | string;
  height?: number | string;
};

export function Iconify({ icon, width = 20, height, sx, ...other }: IconifyProps) {
  return (
    <IconRoot
      ssr
      icon={icon}
      sx={[
        { width, height: height ?? width, flexShrink: 0, display: 'inline-flex' },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
      {...other}
    />
  );
}

// ----------------------------------------------------------------------

const IconRoot = styled(Icon)``;
