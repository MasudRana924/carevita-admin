import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';

// ----------------------------------------------------------------------

export function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const scrollPercent = (scrollTop / docHeight) * 100;
      setScrollProgress(scrollPercent);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <Box
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        height: 3,
        zIndex: 9999,
        background: (theme) => `linear-gradient(90deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
        transform: `scaleX(${scrollProgress / 100})`,
        transformOrigin: 'left',
        transition: 'transform 0.1s ease-out',
        boxShadow: (theme) => `0 2px 8px ${theme.palette.primary.main}40`,
      }}
    />
  );
}
