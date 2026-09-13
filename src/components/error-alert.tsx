import Alert from '@mui/material/Alert';

interface ErrorAlertProps {
  error: string | null;
  onClose: () => void;
}

export function ErrorAlert({ error, onClose }: ErrorAlertProps) {
  if (!error) return null;

  return (
    <Alert 
      severity="error" 
      sx={{ 
        mb: 3, 
        width: '100%',
        backgroundColor: '#ffebee',
        color: '#c62828',
        border: '1px solid #ef5350',
        '& .MuiAlert-icon': {
          color: '#c62828',
        },
        '& .MuiAlert-message': {
          color: '#c62828',
        }
      }} 
      onClose={onClose}
    >
      {error}
    </Alert>
  );
}
