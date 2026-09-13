import { useState, useCallback } from 'react';

import Autocomplete from '@mui/material/Autocomplete';
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

const CATEGORIES = [
  { id: '1', name: 'Electronics' },
  { id: '2', name: 'Clothing' },
  { id: '3', name: 'Food & Beverages' },
  { id: '4', name: 'Automotive' },
  { id: '5', name: 'Home & Garden' },
  { id: '6', name: 'Sports & Recreation' },
  { id: '7', name: 'Books & Media' },
  { id: '8', name: 'Health & Beauty' },
  { id: '9', name: 'Toys & Games' },
  { id: '10', name: 'Office Supplies' },
];

const STATUS_OPTIONS = [
  { id: '1', name: 'Active' },
  { id: '2', name: 'Inactive' },
  { id: '3', name: 'Pending' },
];

export function NewSupplierView() {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    category: '',
    status: 'Active',
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

  const handleAutocompleteChange = (field: string) => (event: any, newValue: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: newValue ? newValue.name : '',
    }));
  };

  // Get selected values for autocomplete
  const selectedCategory = CATEGORIES.find(category => category.name === formData.category) || null;
  const selectedStatus = STATUS_OPTIONS.find(status => status.name === formData.status) || null;

  const handleSubmit = useCallback(() => {
    // Handle form submission here
    console.log('Form data:', formData);
    
    // Basic validation
    if (!formData.name || !formData.email || !formData.category) {
      showSnackbar('Please fill in all required fields', 'error');
      return;
    }
    
    // Simulate API call
    try {
      // Here you would make an API call to create the supplier
      setTimeout(() => {
        router.push('/dashboard/suppliers?refresh=true&action=created');
      }, 1500);
    } catch (error) {
      showSnackbar('Failed to create supplier. Please try again.', 'error');
    }
  }, [formData, router, showSnackbar]);

  return (
    <DashboardContent>
      <Breadcrumb 
        title="New Supplier" 
        items={[
          { title: 'Dashboard', href: '/dashboard' },
          { title: 'Suppliers', href: '/dashboard/suppliers' },
          { title: 'New Supplier' }
        ]} 
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 3, mb: 2 }}>
        <Button
          variant="outlined"
          size="large"
          onClick={() => router.push('/dashboard/suppliers')}
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
            Supplier Information
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                fullWidth
                name="name"
                label="Supplier Name"
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
                <Autocomplete
                  options={CATEGORIES}
                  getOptionLabel={(option) => option.name}
                  value={selectedCategory}
                  onChange={handleAutocompleteChange('category')}
                  renderInput={(params) => (
                    <TextField {...params} label="Category" />
                  )}
                  sx={{
                    '& .MuiAutocomplete-inputRoot': {
                      '& fieldset': {
                        borderColor: 'grey.400',
                      },
                      '&:hover fieldset': {
                        borderColor: 'grey.600',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'grey.600',
                      },
                    },
                    '& .MuiAutocomplete-popper': {
                      '& .MuiPaper-root': {
                        backgroundImage: 'url(/assets/background/overlay.jpg)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        '& .MuiAutocomplete-listbox': {
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(10px)',
                          '& .MuiAutocomplete-option': {
                            '&:hover': {
                              backgroundColor: 'rgba(0, 0, 0, 0.1)',
                            },
                            '&.Mui-focused': {
                              backgroundColor: 'rgba(0, 0, 0, 0.15)',
                            },
                          },
                        },
                      },
                    },
                  }}
                  slotProps={{
                    popper: {
                      sx: {
                        '& .MuiPaper-root': {
                          backgroundImage: 'url(/assets/background/overlay.jpg)',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat',
                          '& .MuiAutocomplete-listbox': {
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(10px)',
                            '& .MuiAutocomplete-option': {
                              '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                              },
                              '&.Mui-focused': {
                                backgroundColor: 'rgba(0, 0, 0, 0.15)',
                              },
                            },
                          },
                        },
                      },
                    },
                  }}
                />
              </FormControl>
              <FormControl fullWidth>
                <Autocomplete
                  options={STATUS_OPTIONS}
                  getOptionLabel={(option) => option.name}
                  value={selectedStatus}
                  onChange={handleAutocompleteChange('status')}
                  renderInput={(params) => (
                    <TextField {...params} label="Status" />
                  )}
                  sx={{
                    '& .MuiAutocomplete-inputRoot': {
                      '& fieldset': {
                        borderColor: 'grey.400',
                      },
                      '&:hover fieldset': {
                        borderColor: 'grey.600',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: 'grey.600',
                      },
                    },
                    '& .MuiAutocomplete-popper': {
                      '& .MuiPaper-root': {
                        backgroundImage: 'url(/assets/background/overlay.jpg)',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        '& .MuiAutocomplete-listbox': {
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          backdropFilter: 'blur(10px)',
                          '& .MuiAutocomplete-option': {
                            '&:hover': {
                              backgroundColor: 'rgba(0, 0, 0, 0.1)',
                            },
                            '&.Mui-focused': {
                              backgroundColor: 'rgba(0, 0, 0, 0.15)',
                            },
                          },
                        },
                      },
                    },
                  }}
                  slotProps={{
                    popper: {
                      sx: {
                        '& .MuiPaper-root': {
                          backgroundImage: 'url(/assets/background/overlay.jpg)',
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                          backgroundRepeat: 'no-repeat',
                          '& .MuiAutocomplete-listbox': {
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(10px)',
                            '& .MuiAutocomplete-option': {
                              '&:hover': {
                                backgroundColor: 'rgba(0, 0, 0, 0.1)',
                              },
                              '&.Mui-focused': {
                                backgroundColor: 'rgba(0, 0, 0, 0.15)',
                              },
                            },
                          },
                        },
                      },
                    },
                  }}
                />
              </FormControl>
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
