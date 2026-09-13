import { forwardRef } from 'react';

import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';


// ----------------------------------------------------------------------

type Props = {
  title?: string;
  content?: React.ReactNode;
  action?: React.ReactNode;
  open: boolean;
  onClose: VoidFunction;
};

export const ConfirmDialog = forwardRef<HTMLDivElement, Props>(
  ({ title = 'Confirm', content, action, open, onClose, ...other }, ref) => (
    <Dialog
      ref={ref}
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: 1,
          maxWidth: 480,
        },
      }}
      {...other}
    >
      <DialogTitle sx={{ pb: 2 }}>
        {title}
      </DialogTitle>

      {content && (
        <DialogContent sx={{ typography: 'body2' }}>
          {content}
        </DialogContent>
      )}

      <Divider sx={{ borderStyle: 'dashed' }} />

      <DialogActions>
        {action}

        <Button variant="outlined" color="inherit" onClick={onClose}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  )
);
