import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack';
import { useSnackbar } from 'src/components/snackbar';

import { DashboardContent } from 'src/layouts/dashboard';

import { Breadcrumb } from 'src/components/breadcrumb';
import { LucideIcon } from 'src/components/lucide-icons';
import { useHospitals } from 'src/hooks/useAdminApi';

// ----------------------------------------------------------------------

export function NewHospitalView() {
  const { showSnackbar } = useSnackbar();
  const { createHospital } = useHospitals();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    address: '',
    phone: '',
    email: '',
    city: '',
    district: '',
    type: '',
    details: '',
  });

  const [photo, setPhoto] = useState<File | null>(null);

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({ ...prev, [field]: event.target.value }));
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setPhoto(event.target.files[0]);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!formData.name) {
      showSnackbar('Hospital name is required', 'error');
      return;
    }

    setLoading(true);
    try {
      await createHospital({
        name: formData.name,
        address: formData.address,
        phone: formData.phone,
        email: formData.email,
        city: formData.city,
        district: formData.district,
        type: formData.type,
        details: formData.details,
        photo: photo || undefined,
      });
      showSnackbar('Hospital created successfully', 'success');
      // Reset form
      setFormData({
        name: '',
        address: '',
        phone: '',
        email: '',
        city: '',
        district: '',
        type: '',
        details: '',
      });
      setPhoto(null);
    } catch (error: any) {
      showSnackbar(error.message || 'Failed to create hospital', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardContent>
      <Breadcrumb 
        title="New Hospital" 
        items={[
          { title: 'Dashboard', href: '/dashboard' },
          { title: 'Hospitals', href: '/hospitals' },
          { title: 'New Hospital' }
        ]} 
      />

      <Card>
        <CardHeader title="Create New Hospital" />
        <CardContent>
          <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 800 }}>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Hospital Name *"
                value={formData.name}
                onChange={handleInputChange('name')}
                required
              />

              <TextField
                fullWidth
                label="Address"
                value={formData.address}
                onChange={handleInputChange('address')}
                multiline
                rows={2}
              />

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                <TextField
                  fullWidth
                  label="Phone"
                  value={formData.phone}
                  onChange={handleInputChange('phone')}
                />
                <TextField
                  fullWidth
                  label="Email"
                  value={formData.email}
                  onChange={handleInputChange('email')}
                  type="email"
                />
              </Stack>

              <Stack direction={{ xs: 'column', md: 'row' }} spacing={3}>
                <TextField
                  fullWidth
                  label="City"
                  value={formData.city}
                  onChange={handleInputChange('city')}
                />
                <TextField
                  fullWidth
                  label="District"
                  value={formData.district}
                  onChange={handleInputChange('district')}
                />
              </Stack>

              <TextField
                fullWidth
                label="Hospital Type"
                value={formData.type}
                onChange={handleInputChange('type')}
                placeholder="e.g., Private, Government, etc."
              />

              <TextField
                fullWidth
                label="Details"
                value={formData.details}
                onChange={handleInputChange('details')}
                multiline
                rows={4}
                placeholder="Additional information about the hospital"
              />

              <Box>
                <Typography variant="subtitle2" gutterBottom>
                  Hospital Photo
                </Typography>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  style={{ display: 'none' }}
                  id="hospital-photo"
                />
                <label htmlFor="hospital-photo">
                  <Button
                    variant="outlined"
                    component="span"
                    startIcon={<LucideIcon icon="solar:gallery-add-bold" />}
                  >
                    {photo ? photo.name : 'Upload Photo'}
                  </Button>
                </label>
                {photo && (
                  <Typography variant="caption" sx={{ ml: 2, color: 'text.secondary' }}>
                    Selected: {photo.name}
                  </Typography>
                )}
              </Box>

              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={() => {
                    setFormData({
                      name: '',
                      address: '',
                      phone: '',
                      email: '',
                      city: '',
                      district: '',
                      type: '',
                      details: '',
                    });
                    setPhoto(null);
                  }}
                  disabled={loading}
                >
                  Reset
                </Button>
                <Button
                  variant="contained"
                  type="submit"
                  startIcon={<LucideIcon icon="solar:check-circle-bold" />}
                  disabled={loading}
                >
                  {loading ? 'Creating...' : 'Create Hospital'}
                </Button>
              </Box>
            </Stack>
          </Box>
        </CardContent>
      </Card>
    </DashboardContent>
  );
}
