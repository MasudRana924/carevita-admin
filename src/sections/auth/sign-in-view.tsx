import { useCallback, useEffect, useState } from 'react';

import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { useRouter } from 'src/routes/hooks';

import { useAuth } from 'src/contexts/AuthContext';

import { ErrorAlert } from 'src/components/error-alert';
import { Iconify } from 'src/components/iconify';
import { iconFieldSlotProps } from 'src/components/detail-ui';

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
      }}
    >
      <Box
        sx={{
          width: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: 4,
          backgroundColor: 'white',
        }}
      >
        <Box sx={{ width: '100%', maxWidth: 450 }}>
          <Box sx={{ gap: 1.5, display: 'flex', flexDirection: 'column', alignItems: 'flex-start', mb: 5 }}>
            <Typography variant="h4">Admin sign in</Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Sign in with your Nirapod admin email.
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
              sx={{
                mb: 3,
                '& input:-webkit-autofill': {
                  WebkitBoxShadow: '0 0 0 1000px white inset',
                  WebkitTextFillColor: 'inherit',
                },
                '& input:-webkit-autofill:hover': {
                  WebkitBoxShadow: '0 0 0 1000px white inset',
                  WebkitTextFillColor: 'inherit',
                },
                '& input:-webkit-autofill:focus': {
                  WebkitBoxShadow: '0 0 0 1000px white inset',
                  WebkitTextFillColor: 'inherit',
                },
              }}
              slotProps={{
                inputLabel: { shrink: true },
                ...iconFieldSlotProps('solar:letter-bold-duotone'),
              }}
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
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify icon="solar:lock-password-bold-duotone" width={20} sx={{ color: 'text.disabled' }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        onClick={() => setShowPassword((prev) => !prev)}
                        edge="end"
                      >
                        <Iconify icon={showPassword ? 'solar:eye-bold' : 'solar:eye-closed-bold'} />
                      </IconButton>
                    </InputAdornment>
                  ),
                },
              }}
              sx={{
                mb: 3,
                '& input:-webkit-autofill': {
                  WebkitBoxShadow: '0 0 0 1000px white inset',
                  WebkitTextFillColor: 'inherit',
                },
                '& input:-webkit-autofill:hover': {
                  WebkitBoxShadow: '0 0 0 1000px white inset',
                  WebkitTextFillColor: 'inherit',
                },
                '& input:-webkit-autofill:focus': {
                  WebkitBoxShadow: '0 0 0 1000px white inset',
                  WebkitTextFillColor: 'inherit',
                },
              }}
            />

            <Button
              fullWidth
              size="large"
              type="submit"
              color="inherit"
              variant="contained"
              disabled={isLoading}
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
