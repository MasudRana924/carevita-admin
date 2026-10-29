import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from 'src/contexts/AuthContext';

import { PageLoader } from './page-loader';

export function AuthRedirect({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && isAuthenticated && isAdmin) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, isAdmin, isLoading, navigate]);

  if (isAuthenticated && isAdmin) {
    return <PageLoader variant="fullscreen" />;
  }

  // Overlay instead of unmounting, so the sign-in form keeps its values if login fails.
  return (
    <>
      {children}
      {isLoading && <PageLoader variant="fullscreen" />}
    </>
  );
}
