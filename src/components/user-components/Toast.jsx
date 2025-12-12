import React from 'react';
import { Snackbar, Alert, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const Toast = ({ open, message, severity = 'success', onClose, duration = 3000 }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      sx={{ mt: 8 }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        icon={severity === 'success' ? <CheckCircleIcon /> : undefined}
        sx={{
          width: '100%',
          minWidth: 300,
          boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
          borderRadius: 2,
          '& .MuiAlert-icon': {
            fontSize: 24,
          },
          '& .MuiAlert-message': {
            fontSize: '0.95rem',
            fontWeight: 500,
          },
        }}
        action={
          <IconButton
            size="small"
            aria-label="close"
            color="inherit"
            onClick={onClose}
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        }
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Toast;