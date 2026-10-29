import type { SxProps, Theme } from '@mui/material/styles';

import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

// ----------------------------------------------------------------------

type PageLoaderProps = {
  /**
   * - `inline`: fills the available space of its parent (default).
   * - `overlay`: covers its nearest positioned parent.
   * - `fullscreen`: covers the whole viewport.
   */
  variant?: 'inline' | 'overlay' | 'fullscreen';
  minHeight?: number | string;
  sx?: SxProps<Theme>;
};

export function PageLoader({ variant = 'inline', minHeight, sx }: PageLoaderProps) {
  const bar = (
    <LinearProgress
      aria-label="Loading"
      sx={{
        width: 1,
        maxWidth: 320,
        bgcolor: (theme) => varAlpha(theme.vars.palette.text.primaryChannel, 0.16),
        [`& .${linearProgressClasses.bar}`]: { bgcolor: 'text.primary' },
      }}
    />
  );

  if (variant === 'fullscreen') {
    return (
      <Box
        sx={[
          {
            position: 'fixed',
            inset: 0,
            zIndex: (theme) => theme.zIndex.modal + 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            px: 3,
            bgcolor: 'background.default',
          },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
      >
        {bar}
      </Box>
    );
  }

  if (variant === 'overlay') {
    return (
      <Box
        sx={[
          { position: 'absolute', inset: 0, zIndex: 10, bgcolor: '#FFFFFF' },
          ...(Array.isArray(sx) ? sx : [sx]),
        ]}
      >
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            px: 3,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            height: 'min(100%, calc(100dvh - var(--layout-header-desktop-height, 72px)))',
          }}
        >
          {bar}
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={[
        {
          px: 3,
          minHeight,
          display: 'flex',
          flex: '1 1 auto',
          alignItems: 'center',
          justifyContent: 'center',
        },
        ...(Array.isArray(sx) ? sx : [sx]),
      ]}
    >
      {bar}
    </Box>
  );
}
