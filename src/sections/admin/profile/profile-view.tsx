import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Divider from '@mui/material/Divider';

import { DashboardContent } from 'src/layouts/dashboard';

import { Breadcrumb } from 'src/components/breadcrumb';
import { LucideIcon } from 'src/components/lucide-icons';
import { useSnackbar } from 'src/components/snackbar';
import { useAdminProfile } from 'src/hooks/useAdminApi';
import type { AdminProfile } from 'src/api/admin-types';

// ----------------------------------------------------------------------

export function ProfileView() {
  const { showSnackbar } = useSnackbar();
  const { profile, loading, error, refetch } = useAdminProfile();
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<Partial<AdminProfile>>({});

  useEffect(() => {
    if (profile) {
      setFormData(profile);
    }
  }, [profile]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setFormData(profile || {});
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Simulate API call to update profile
      await new Promise(resolve => setTimeout(resolve, 1000));
      showSnackbar('Profile updated successfully', 'success');
      setIsEditing(false);
      refetch();
    } catch (error) {
      showSnackbar('Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof AdminProfile) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: event.target.value }));
  };

  if (loading) {
    return (
      <DashboardContent>
        <Breadcrumb 
          title="Profile" 
          items={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Profile' }
          ]} 
        />
        <Box sx={{ py: 3 }}>Loading profile...</Box>
      </DashboardContent>
    );
  }

  if (error) {
    return (
      <DashboardContent>
        <Breadcrumb 
          title="Profile" 
          items={[
            { title: 'Dashboard', href: '/dashboard' },
            { title: 'Profile' }
          ]} 
        />
        <Box sx={{ py: 3, color: 'error.main' }}>{error}</Box>
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <Breadcrumb 
        title="Profile" 
        items={[
          { title: 'Dashboard', href: '/dashboard' },
          { title: 'Profile' }
        ]} 
      />

      <Stack spacing={3}>
        {/* Profile Header Card */}
        <Card>
          <CardContent>
            <Stack direction="row" spacing={4} alignItems="center">
              <Avatar
                src={profile?.profile_photo || undefined}
                alt={profile?.name}
                sx={{ width: 100, height: 100 }}
              >
                {profile?.name?.charAt(0)}
              </Avatar>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h4" gutterBottom>
                  {profile?.name}
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                  {profile?.email}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {profile?.phone}
                </Typography>
              </Box>
              {!isEditing && (
                <Button
                  variant="contained"
                  startIcon={<LucideIcon icon="solar:pen-bold" />}
                  onClick={handleEdit}
                >
                  Edit Profile
                </Button>
              )}
            </Stack>
          </CardContent>
        </Card>

        {/* Profile Details Card */}
        <Card>
          <CardHeader title="Profile Information" />
          <CardContent>
            <Stack spacing={3}>
              <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                <TextField
                  fullWidth
                  label="Full Name"
                  value={formData.name || ''}
                  onChange={handleInputChange('name')}
                  disabled={!isEditing}
                />
                <TextField
                  fullWidth
                  label="Email"
                  value={formData.email || ''}
                  onChange={handleInputChange('email')}
                  disabled={!isEditing}
                  type="email"
                />
              </Stack>

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={formData.phone || ''}
                  onChange={handleInputChange('phone')}
                  disabled={!isEditing}
                />
                <TextField
                  fullWidth
                  label="Language Preference"
                  value={formData.language_preference || ''}
                  onChange={handleInputChange('language_preference')}
                  disabled={!isEditing}
                />
              </Stack>

              <TextField
                fullWidth
                label="Address"
                value={formData.address || ''}
                onChange={handleInputChange('address')}
                disabled={!isEditing}
                multiline
                rows={2}
              />

              <TextField
                fullWidth
                label="Emergency Contact"
                value={formData.emergency_contact || ''}
                onChange={handleInputChange('emergency_contact')}
                disabled={!isEditing}
              />

              <TextField
                fullWidth
                label="Date of Birth"
                value={formData.date_of_birth || ''}
                onChange={handleInputChange('date_of_birth')}
                disabled={!isEditing}
                type="date"
                InputLabelProps={{ shrink: true }}
              />
            </Stack>
          </CardContent>
        </Card>

        {/* Account Status Card */}
        <Card>
          <CardHeader title="Account Status" />
          <CardContent>
            <Stack spacing={2}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body1">Account Status</Typography>
                <Typography 
                  variant="body1" 
                  color={profile?.status === 'active' ? 'success.main' : 'error.main'}
                  fontWeight="bold"
                >
                  {profile?.status?.toUpperCase()}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body1">Role</Typography>
                <Typography variant="body1" fontWeight="bold">
                  {profile?.role}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body1">Email Verified</Typography>
                <Typography 
                  variant="body1" 
                  color={profile?.is_verified ? 'success.main' : 'text.secondary'}
                  fontWeight="bold"
                >
                  {profile?.is_verified ? 'Yes' : 'No'}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body1">eKYC Status</Typography>
                <Typography 
                  variant="body1" 
                  color={profile?.ekyc_status ? 'success.main' : 'text.secondary'}
                  fontWeight="bold"
                >
                  {profile?.ekyc_status ? 'Verified' : 'Not Verified'}
                </Typography>
              </Box>

              <Divider />

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Member Since</Typography>
                <Typography variant="body2" color="text.secondary">
                  {profile?.created_at ? new Date(profile.created_at).toLocaleDateString() : 'N/A'}
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">Last Updated</Typography>
                <Typography variant="body2" color="text.secondary">
                  {profile?.updated_at ? new Date(profile.updated_at).toLocaleDateString() : 'N/A'}
                </Typography>
              </Box>
            </Stack>
          </CardContent>
        </Card>

        {/* Actions */}
        {isEditing && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
            <Button
              variant="outlined"
              startIcon={<LucideIcon icon="eva:close-fill" />}
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              startIcon={<LucideIcon icon="eva:save-fill" />}
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </Box>
        )}
      </Stack>
    </DashboardContent>
  );
}
