import { useRef, useState, useEffect, useCallback } from 'react';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CircularProgress from '@mui/material/CircularProgress';

import { useRouter } from 'src/routes/hooks';

import { useAuth } from 'src/contexts/AuthContext';

import { ErrorAlert } from 'src/components/error-alert';

// ----------------------------------------------------------------------

export function VerifyOtpView() {
  const router = useRouter();
  const { verifyOtp, isLoading, error, clearError, isAuthenticated } = useAuth();
  const [otp, setOtp] = useState(['', '', '', '']);
  const [email, setEmail] = useState('');
  const inputRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleOtpChange = useCallback((index: number, value: string) => {
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newOtp = [...otp];
      newOtp[index] = value;
      setOtp(newOtp);

             // Move to next input if value is entered
       if (value && index < 3) {
         inputRefs.current[index + 1]?.focus();
       }
    }
  }, [otp]);

  const handleKeyDown = useCallback((index: number, e: React.KeyboardEvent<HTMLDivElement>) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }, [otp]);

     const handleVerifyOtp = useCallback(async (e: React.FormEvent) => {
       e.preventDefault();
       const otpString = otp.join('');
       if (otpString.length === 4 && email) {
         await verifyOtp(email, otpString);
       }
     }, [otp, email, verifyOtp]);

  const handleResendOtp = useCallback(() => {
    // Here you would typically make an API call to resend OTP
    console.log('Resend OTP clicked');
  }, []);

  const handleSignInClick = useCallback(() => {
    router.push('/');
  }, [router]);

  // Focus first input on mount
  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const renderOtpInputs = (
    <Box
      sx={{
        display: 'flex',
        gap: 2,
        justifyContent: 'center',
        mb: 3,
        width: '100%',
      }}
    >
      {otp.map((digit, index) => (
        <TextField
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          value={digit}
          onChange={(e) => handleOtpChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          inputProps={{
            maxLength: 1,
            style: { textAlign: 'center', fontSize: '1.2rem' },
          }}
          sx={{
            width: 60,
            '& .MuiInputBase-root': {
              height: 60,
            },
          }}
          slotProps={{
            inputLabel: { shrink: true },
          }}
        />
      ))}
    </Box>
  );

  const renderForm = (
    <Box
      component="form"
      onSubmit={handleVerifyOtp}
      sx={{
        display: 'flex',
        alignItems: 'flex-end',
        flexDirection: 'column',
      }}
    >
      <ErrorAlert error={error} onClose={clearError} />

      <TextField
        fullWidth
        name="email"
        label="Email address"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
        sx={{ mb: 3 }}
        slotProps={{
          inputLabel: { shrink: true },
        }}
      />

      <Typography
        variant="body2"
        sx={{
          color: 'text.secondary',
          mb: 3,
          textAlign: 'center',
          width: '100%',
        }}
      >
        We&apos;ve sent a verification code to your email
      </Typography>

      {renderOtpInputs}

      <Button
        fullWidth
        size="large"
        type="submit"
        color="inherit"
        variant="contained"
        disabled={otp.join('').length !== 4 || !email || isLoading}
        startIcon={isLoading ? <CircularProgress size={20} /> : null}
      >
        {isLoading ? 'Verifying...' : 'Verify'}
      </Button>
    </Box>
  );

  return (
    <>
             <Box
         sx={{
           gap: 1.5,
           display: 'flex',
           flexDirection: 'column',
           alignItems: 'center',
           mb: 5,
         }}
       >
         <Typography variant="h5">Verify OTP</Typography>
       </Box>
             {renderForm}
       <Box
         sx={{
           mt: 3,
           textAlign: 'center',
         }}
       >
         <Typography
           variant="body2"
           sx={{
             color: 'text.secondary',
             mb: 2,
           }}
         >
           Didn&apos;t receive the code?
           <Link variant="subtitle2" sx={{ ml: 0.5, cursor: 'pointer' }} onClick={handleResendOtp}>
             Resend
           </Link>
         </Typography>
         <Typography
           variant="body2"
           sx={{
             color: 'text.secondary',
           }}
         >
           Back to
           <Link variant="subtitle2" sx={{ ml: 0.5, cursor: 'pointer' }} onClick={handleSignInClick}>
             Sign in
           </Link>
         </Typography>
       </Box>
    </>
  );
}
