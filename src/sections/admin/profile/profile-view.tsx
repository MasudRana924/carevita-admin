import { useState, useEffect } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';

import { DashboardContent } from 'src/layouts/dashboard';

import { Label } from 'src/components/label';
import { Breadcrumb } from 'src/components/breadcrumb';
import { PageLoader } from 'src/components/page-loader';
import { ErrorState } from 'src/components/page-states';
import { Iconify } from 'src/components/iconify';
import { IconBadge, PREMIUM_CARD_SX, iconFieldSlotProps } from 'src/components/detail-ui';
import { useSnackbar } from 'src/components/snackbar';
import { useAdminProfile } from 'src/hooks/useAdminApi';
import type { AdminProfile } from 'src/api/admin-types';

// ----------------------------------------------------------------------

const FORM_MAX_WIDTH = 1100;

const FIELDS_GRID_SX = {
  display: 'grid',
  gap: 2.5,
  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
} as const;

const BREADCRUMB_ITEMS = [{ title: 'Dashboard', href: '/dashboard' }, { title: 'Profile' }];

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
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showSnackbar('Profile updated successfully', 'success');
      setIsEditing(false);
      refetch();
    } catch (error) {
      showSnackbar('Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange =
    (field: keyof AdminProfile) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({ ...prev, [field]: event.target.value }));
    };

  if (loading) {
    return (
      <DashboardContent>
        <Breadcrumb title="Profile" items={BREADCRUMB_ITEMS} />
        <PageLoader minHeight="60vh" />
      </DashboardContent>
    );
  }

  if (error) {
    return (
      <DashboardContent>
        <Breadcrumb title="Profile" items={BREADCRUMB_ITEMS} />
        <ErrorState message={error} onRetry={() => refetch()} />
      </DashboardContent>
    );
  }

  return (
    <DashboardContent>
      <Breadcrumb title="Profile" items={BREADCRUMB_ITEMS} />

      <Grid container spacing={3} sx={{ maxWidth: FORM_MAX_WIDTH }}>
        <Grid size={{ xs: 12, md: 4 }}>
          <Card sx={{ ...PREMIUM_CARD_SX, p: 3, textAlign: 'center' }}>
            <Avatar
              src={profile?.profile_photo || undefined}
              alt={profile?.name}
              sx={{ width: 96, height: 96, mx: 'auto', mb: 2, fontSize: 36 }}
            >
              {profile?.name?.charAt(0)}
            </Avatar>

            <Typography variant="h6" noWrap>
              {profile?.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" noWrap>
              {profile?.email}
            </Typography>
            {profile?.phone && (
              <Typography variant="body2" color="text.secondary" noWrap>
                {profile.phone}
              </Typography>
            )}

            <Stack direction="row" spacing={1} justifyContent="center" sx={{ mt: 2 }}>
              <Label variant="soft" color="info">
                {profile?.role ?? 'ADMIN'}
              </Label>
              <Label variant="soft" color={profile?.status === 'blocked' ? 'error' : 'success'}>
                {profile?.status ?? 'active'}
              </Label>
            </Stack>

            {!isEditing && (
              <Button
                fullWidth
                variant="contained"
                startIcon={<Iconify icon="solar:pen-bold" />}
                onClick={handleEdit}
                sx={{ mt: 3 }}
              >
                Edit Profile
              </Button>
            )}
          </Card>
        </Grid>

        <Grid size={{ xs: 12, md: 8 }}>
          <Card sx={PREMIUM_CARD_SX}>
            <Stack direction="row" alignItems="center" spacing={1.5} sx={{ p: 3, pb: 0 }}>
              <IconBadge icon="solar:user-id-bold-duotone" color="primary" />
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="subtitle1">Profile information</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Your personal details and contact information
                </Typography>
              </Box>
            </Stack>
            <CardContent sx={{ p: 3 }}>
              <Box sx={FIELDS_GRID_SX}>
                <TextField
                  fullWidth
                  label="Full name"
                  value={formData.name || ''}
                  onChange={handleInputChange('name')}
                  disabled={!isEditing}
                  slotProps={iconFieldSlotProps('solar:user-rounded-bold-duotone')}
                />
                <TextField
                  fullWidth
                  label="Email"
                  value={formData.email || ''}
                  onChange={handleInputChange('email')}
                  disabled={!isEditing}
                  type="email"
                  slotProps={iconFieldSlotProps('solar:letter-bold-duotone')}
                />
                <TextField
                  fullWidth
                  label="Phone"
                  value={formData.phone || ''}
                  onChange={handleInputChange('phone')}
                  disabled={!isEditing}
                  slotProps={iconFieldSlotProps('solar:phone-bold-duotone')}
                />
                <TextField
                  fullWidth
                  label="Emergency contact"
                  value={formData.emergency_contact || ''}
                  onChange={handleInputChange('emergency_contact')}
                  disabled={!isEditing}
                  slotProps={iconFieldSlotProps('solar:phone-calling-bold-duotone')}
                />
                <TextField
                  fullWidth
                  label="Language preference"
                  value={formData.language_preference || ''}
                  onChange={handleInputChange('language_preference')}
                  disabled={!isEditing}
                  slotProps={iconFieldSlotProps('solar:global-bold-duotone')}
                />
                <TextField
                  fullWidth
                  label="Date of birth"
                  value={formData.date_of_birth || ''}
                  onChange={handleInputChange('date_of_birth')}
                  disabled={!isEditing}
                  type="date"
                  slotProps={{
                    ...iconFieldSlotProps('solar:calendar-bold-duotone'),
                    inputLabel: { shrink: true },
                  }}
                />
                <TextField
                  fullWidth
                  label="Address"
                  value={formData.address || ''}
                  onChange={handleInputChange('address')}
                  disabled={!isEditing}
                  multiline
                  rows={3}
                  sx={{ gridColumn: '1 / -1' }}
                  slotProps={iconFieldSlotProps('solar:map-point-bold-duotone', {
                    multiline: true,
                  })}
                />
              </Box>
            </CardContent>

            {isEditing && (
              <>
                <Divider />
                <Box sx={{ p: 3, display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
                  <Button
                    variant="outlined"
                    startIcon={<Iconify icon="solar:close-circle-bold" />}
                    onClick={handleCancel}
                    disabled={saving}
                  >
                    Cancel
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<Iconify icon="solar:diskette-bold" />}
                    onClick={handleSave}
                    disabled={saving}
                  >
                    {saving ? 'Saving...' : 'Save Changes'}
                  </Button>
                </Box>
              </>
            )}
          </Card>
        </Grid>
      </Grid>
    </DashboardContent>
  );
}
