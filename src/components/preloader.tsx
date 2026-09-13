import { useEffect } from 'react';

import Box from '@mui/material/Box';

import { Logo } from './logo';

// ----------------------------------------------------------------------

type PreloaderProps = {
  isLoading?: boolean;
  onComplete?: () => void;
};

export function Preloader({ isLoading = true, onComplete }: PreloaderProps) {
  useEffect(() => {
    if (isLoading && onComplete) {
      // Simple timeout for preloader
      const timer = setTimeout(() => {
        onComplete();
      }, 2000); // 2 seconds

      return () => clearTimeout(timer);
    }
    return undefined;
  }, [isLoading, onComplete]);

  if (!isLoading) {
    return null;
  }

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'background.default',
      }}
    >
      <Logo
        sx={{
          width: 80,
          height: 80,
          animation: 'logoSpin 2s linear infinite',
          '@keyframes logoSpin': {
            '0%': {
              transform: 'rotate(0deg)',
            },
            '100%': {
              transform: 'rotate(360deg)',
            },
          },
        }}
      />
    </Box>
  );
}
