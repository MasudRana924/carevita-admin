import type { ReactNode } from 'react';

import { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useIsFetching } from '@tanstack/react-query';

import Box from '@mui/material/Box';

import { PageLoader } from './page-loader';

// ----------------------------------------------------------------------

const MIN_VISIBLE_MS = 400;
const MAX_VISIBLE_MS = 10_000;

/** Routes that keep their own loading UI instead of the transition loader. */
const EXCLUDED_PATHS = ['/dashboard'];

function shouldShowLoader(previous: string, next: string) {
  if (EXCLUDED_PATHS.includes(next)) return false;
  // Switching conversations inside the inbox is not a page change.
  if (previous.startsWith('/support-chat') && next.startsWith('/support-chat')) return false;
  return true;
}

export function RouteTransitionLoader({ children }: { children: ReactNode }) {
  const { pathname } = useLocation();
  const previousPathRef = useRef(pathname);

  const [visible, setVisible] = useState(false);
  const [minElapsed, setMinElapsed] = useState(true);

  // Only first loads count: background refetches and polling must not hold the loader open.
  const initialFetches = useIsFetching({ predicate: (query) => query.state.data === undefined });

  useEffect(() => {
    const previous = previousPathRef.current;
    previousPathRef.current = pathname;
    if (previous === pathname || !shouldShowLoader(previous, pathname)) return undefined;

    setVisible(true);
    setMinElapsed(false);
    const minTimer = setTimeout(() => setMinElapsed(true), MIN_VISIBLE_MS);
    const maxTimer = setTimeout(() => setVisible(false), MAX_VISIBLE_MS);
    return () => {
      clearTimeout(minTimer);
      clearTimeout(maxTimer);
    };
  }, [pathname]);

  useEffect(() => {
    if (visible && minElapsed && initialFetches === 0) setVisible(false);
  }, [visible, minElapsed, initialFetches]);

  return (
    <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', flex: '1 1 auto' }}>
      {children}
      {visible && <PageLoader variant="overlay" />}
    </Box>
  );
}
