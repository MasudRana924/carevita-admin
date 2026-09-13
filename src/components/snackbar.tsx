import { useState, useContext , useCallback, createContext } from 'react';

import Alert from '@mui/material/Alert';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';

import { LucideIcon } from './lucide-icons';

// ----------------------------------------------------------------------

type SnackbarType = 'success' | 'error' | 'warning' | 'info';

type SnackbarContextType = {
  showSnackbar: (message: string, type?: SnackbarType) => void;
};

const SnackbarContext = createContext<SnackbarContextType | undefined>(undefined);

export function SnackbarProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<SnackbarType>('success');

  const showSnackbar = useCallback((newMessage: string, newType: SnackbarType = 'success') => {
    setMessage(newMessage);
    setType(newType);
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  const getIcon = (snackbarType: SnackbarType) => {
    switch (snackbarType) {
      case 'success':
        return 'solar:check-circle-bold';
      case 'error':
        return 'solar:close-circle-bold';
      case 'warning':
        return 'solar:warning-bold';
      case 'info':
        return 'solar:info-circle-bold';
      default:
        return 'solar:check-circle-bold';
    }
  };

  return (
    <SnackbarContext.Provider value={{ showSnackbar }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{
          '& .MuiSnackbar-root': {
            top: 24,
            right: 24,
          },
        }}
      >
        <Alert
          onClose={handleClose}
          severity={type}
          variant="filled"
          sx={{
            width: '100%',
            minWidth: 300,
            maxWidth: 400,
            backgroundColor: type === 'success' ? 'success.main' : type === 'error' ? 'error.main' : type === 'warning' ? 'warning.main' : 'info.main',
            color: 'white',
            '& .MuiAlert-icon': {
              color: 'white',
            },
            '& .MuiAlert-message': {
              color: 'white',
            },
            '& .MuiAlert-action': {
              color: 'white',
            },
          }}
          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={handleClose}
            >
              <LucideIcon icon="solar:close-bold" />
            </IconButton>
          }
          icon={<LucideIcon icon={getIcon(type)} />}
        >
          {message}
        </Alert>
      </Snackbar>
    </SnackbarContext.Provider>
  );
}

export function useSnackbar() {
  const context = useContext(SnackbarContext);
  if (context === undefined) {
    throw new Error('useSnackbar must be used within a SnackbarProvider');
  }
  return context;
}
