import type { ReactNode } from 'react';

import { useState, useContext, useCallback, createContext } from 'react';

// ----------------------------------------------------------------------

type PreloaderContextType = {
  isLoading: boolean;
  showPreloader: () => void;
  hidePreloader: () => void;
  setLoading: (loading: boolean) => void;
};

const PreloaderContext = createContext<PreloaderContextType | undefined>(undefined);

export function PreloaderProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(false);

  const showPreloader = useCallback(() => {
    setIsLoading(true);
  }, []);

  const hidePreloader = useCallback(() => {
    setIsLoading(false);
  }, []);

  const setLoading = useCallback((loading: boolean) => {
    setIsLoading(loading);
  }, []);

  return (
    <PreloaderContext.Provider value={{ isLoading, showPreloader, hidePreloader, setLoading }}>
      {children}
    </PreloaderContext.Provider>
  );
}

export function usePreloader() {
  const context = useContext(PreloaderContext);
  if (context === undefined) {
    throw new Error('usePreloader must be used within a PreloaderProvider');
  }
  return context;
}
