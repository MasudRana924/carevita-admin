import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';

import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';

import { useSnackbar } from 'src/components/snackbar';
import { Breadcrumb } from 'src/components/breadcrumb';
import { LucideIcon } from 'src/components/lucide-icons';

// ----------------------------------------------------------------------

const ROLES = [
  'Leader',
  'Hr Manager',
  'UI Designer',
  'UX Designer',
  'UI/UX Designer',
  'Project Manager',
  'Backend Developer',
  'Full Stack Designer',
  'Front End Developer',
  'Full Stack Developer',
];

export function NewUserView() {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    company: '',
    role: '',
  });

  const handleInputChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSelectChange = (field: string) => (event: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleSubmit = useCallback(() => {
    // Handle form submission here
    console.log('Form data:', formData);
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.company || !formData.role) {
      showSnackbar('Please fill in all required fields', 'error');
      return;
    }
    
    // Simulate API call
    try {
      // Here you would make an API call to create the user
      setTimeout(() => {
        router.push('/dashboard/user?refresh=true&action=created');
      }, 1500);
    } catch (error) {
      showSnackbar('Failed to create user. Please try again.', 'error');
    }
  }, [formData, router, showSnackbar]);

  return (
    <DashboardContent>
      <Breadcrumb 
        title="New User" 
        items={[
          { title: 'Dashboard', href: '/dashboard' },
          { title: 'Users', href: '/dashboard/user' },
          { title: 'New User' }
        ]} 
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 3, mb: 2 }}>
        <Button
          variant="outlined"
          size="large"
          onClick={() => router.push('/dashboard/user')}
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
        <Card sx={{ 
          flex: 1, 
          p: 3, 
          border: '1px solid #E0E0E0',
          boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
          backgroundColor: '#FFFFFF'
        }}>
          <Typography variant="h6" sx={{ mb: 3 }}>
            User Information
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                name="name"
                label="Full Name"
                value={formData.name}
                onChange={handleInputChange('name')}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
              />
              <TextField
                fullWidth
                name="email"
                label="Email Address"
                type="email"
                value={formData.email}
                onChange={handleInputChange('email')}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                name="phone"
                label="Phone Number"
                value={formData.phone}
                onChange={handleInputChange('phone')}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
              />
              <TextField
                fullWidth
                name="address"
                label="Address"
                value={formData.address}
                onChange={handleInputChange('address')}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel>Role</InputLabel>
                <Select
                  value={formData.role}
                  label="Role"
                  onChange={handleSelectChange('role')}
                >
                  {ROLES.map((role) => (
                    <MenuItem key={role} value={role}>
                      {role}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                fullWidth
                name="company"
                label="Company"
                value={formData.company}
                onChange={handleInputChange('company')}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
              />
            </Box>

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
