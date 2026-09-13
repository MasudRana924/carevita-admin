import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';

import { Breadcrumb } from 'src/components/breadcrumb';
import { LucideIcon } from 'src/components/lucide-icons';

// ----------------------------------------------------------------------

export default function ChangePasswordView() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleTogglePasswordVisibility = (field: 'current' | 'new' | 'confirm') => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const handleSubmit = useCallback(() => {
    // Handle form submission here
    console.log('Password change data:', formData);
    
    // Basic validation
    if (formData.newPassword !== formData.confirmPassword) {
      alert('New password and confirm password do not match!');
      return;
    }
    
    if (formData.newPassword.length < 8) {
      alert('New password must be at least 8 characters long!');
      return;
    }
    
    // You can add a success notification here
    alert('Password changed successfully!');
    router.push('/dashboard');
  }, [formData, router]);

  return (
    <DashboardContent>
      <Breadcrumb 
        title="Change Password" 
        items={[
          { title: 'Dashboard', href: '/dashboard' },
          { title: 'Change Password' }
        ]} 
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 3, mb: 2 }}>
        <Button
          variant="outlined"
          size="large"
          onClick={() => router.push('/dashboard')}
          startIcon={<LucideIcon icon="eva:arrow-back-fill" />}
          sx={{
            borderColor: 'grey.400',
            color: 'grey.700',
            '&:hover': {
              borderColor: 'grey.600',
              backgroundColor: 'grey.50',
            },
          }}
        >
          Back
        </Button>
      </Box>

      <Box sx={{ display: 'flex', gap: 3 }}>
        <Card sx={{ flex: 1, p: 3, maxWidth: 600 }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            Change Password
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Please enter your current password and choose a new password to update your account security.
            </Typography>

            {/* Current Password */}
            <TextField
              fullWidth
              name="currentPassword"
              label="Current Password"
              type={showPasswords.current ? 'text' : 'password'}
              value={formData.currentPassword}
              onChange={handleInputChange('currentPassword')}
              slotProps={{
                inputLabel: { shrink: true },
              }}
              InputProps={{
                endAdornment: (
                  <Button
                    onClick={() => handleTogglePasswordVisibility('current')}
                    sx={{ minWidth: 'auto', p: 1 }}
                  >
                    <LucideIcon 
                      icon={showPasswords.current ? 'eva:eye-off-fill' : 'eva:eye-fill'} 
                      width={20} 
                    />
                  </Button>
                ),
              }}
            />

            {/* New Password */}
            <TextField
              fullWidth
              name="newPassword"
              label="New Password"
              type={showPasswords.new ? 'text' : 'password'}
              value={formData.newPassword}
              onChange={handleInputChange('newPassword')}
              slotProps={{
                inputLabel: { shrink: true },
              }}
              InputProps={{
                endAdornment: (
                  <Button
                    onClick={() => handleTogglePasswordVisibility('new')}
                    sx={{ minWidth: 'auto', p: 1 }}
                  >
                    <LucideIcon 
                      icon={showPasswords.new ? 'eva:eye-off-fill' : 'eva:eye-fill'} 
                      width={20} 
                    />
                  </Button>
                ),
              }}
            />

            {/* Confirm Password */}
            <TextField
              fullWidth
              name="confirmPassword"
              label="Confirm New Password"
              type={showPasswords.confirm ? 'text' : 'password'}
              value={formData.confirmPassword}
              onChange={handleInputChange('confirmPassword')}
              slotProps={{
                inputLabel: { shrink: true },
              }}
              InputProps={{
                endAdornment: (
                  <Button
                    onClick={() => handleTogglePasswordVisibility('confirm')}
                    sx={{ minWidth: 'auto', p: 1 }}
                  >
                    <LucideIcon 
                      icon={showPasswords.confirm ? 'eva:eye-off-fill' : 'eva:eye-fill'} 
                      width={20} 
                    />
                  </Button>
                ),
              }}
            />

            

            {/* Save Button */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
              <Button
                variant="contained"
                size="large"
                onClick={handleSubmit}
              >
                Save Changes
              </Button>
            </Box>
          </Box>
        </Card>
      </Box>
    </DashboardContent>
  );
}
