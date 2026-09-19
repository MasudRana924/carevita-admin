import { useCallback, useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import CircularProgress from '@mui/material/CircularProgress';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { useRouter } from 'src/routes/hooks';

import { useAuth } from 'src/contexts/AuthContext';

import { ErrorAlert } from 'src/components/error-alert';
import { LucideIcon } from 'src/components/lucide-icons';

export function SignInView() {
  const router = useRouter();
  const { login, isLoading, error, isAuthenticated, isAdmin, clearError } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      router.push('/dashboard');
    }
  }, [isAuthenticated, isAdmin, router]);

  const handleSignIn = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      if (!identifier || !password) return;
      await login(identifier, password);
    },
    [identifier, password, login]
  );

  return (
    <Box 
      sx={{ 
        height: '100%', 
        width: '100%', 
        display: 'flex',
        backgroundImage: 'url(/assets/authbg.png)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      {/* Left Side - Image (50%) */}
      <Box
        sx={{
          width: '50%',
          display: { xs: 'none', md: 'flex' },
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        {/* <Box
          component="img"
          src="/assets/auth.png"
          alt="Authentication"
          sx={{
            maxWidth: '80%',
            maxHeight: '80%',
            objectFit: 'contain',
          }}
        /> */}
      </Box>

      {/* Right Side - Form (50%) */}
      <Box
        sx={{
          width: { xs: '100%', md: '50%' },
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 4,
          // backgroundColor: 'rgba(255, 255, 255, 0.9)',
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 450 }}>
          <Box sx={{ gap: 1.5, display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 5 }}>
            <Typography variant="h4">Admin sign in</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
              Sign in with your CareMate admin email.
            </Typography>
          </Box>

          <Box
            component="form"
            onSubmit={handleSignIn}
            sx={{ display: 'flex', flexDirection: 'column' }}
          >
            <ErrorAlert error={error} onClose={clearError} />

            <TextField
              fullWidth
              name="email"
              label="Email"
              type="email"
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              required
              autoComplete="username"
              sx={{ mb: 3 }}
              slotProps={{ inputLabel: { shrink: true } }}
            />

            <TextField
              fullWidth
              name="password"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
              autoComplete="current-password"
              slotProps={{
                inputLabel: { shrink: true },
                input: {
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                      >
                        <LucideIcon icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ mb: 3 }}
            />

            <Button
              fullWidth
              size="large"
              type="submit"
              color="inherit"
              variant="contained"
              disabled={isLoading}
              startIcon={isLoading ? <CircularProgress size={20} /> : null}
              sx={{
                py: 1.5,
                fontSize: '1rem',
              }}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
