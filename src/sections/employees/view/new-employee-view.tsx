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
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';

import { useRouter } from 'src/routes/hooks';

import { DashboardContent } from 'src/layouts/dashboard';

import { useSnackbar } from 'src/components/snackbar';
import { Breadcrumb } from 'src/components/breadcrumb';
import { LucideIcon } from 'src/components/lucide-icons';

// ----------------------------------------------------------------------

const DEPARTMENTS = [
  { id: '1', name: 'Engineering' },
  { id: '2', name: 'Sales' },
  { id: '3', name: 'Marketing' },
  { id: '4', name: 'Human Resources' },
  { id: '5', name: 'Finance' },
  { id: '6', name: 'Operations' },
  { id: '7', name: 'Customer Support' },
  { id: '8', name: 'IT' },
];

const POSITIONS = [
  { id: '1', name: 'Manager' },
  { id: '2', name: 'Senior Developer' },
  { id: '3', name: 'Developer' },
  { id: '4', name: 'Sales Representative' },
  { id: '5', name: 'Marketing Specialist' },
  { id: '6', name: 'HR Coordinator' },
  { id: '7', name: 'Accountant' },
  { id: '8', name: 'Support Specialist' },
  { id: '9', name: 'System Administrator' },
];

const STATUS_OPTIONS = [
  { id: '1', name: 'Active' },
  { id: '2', name: 'Inactive' },
  { id: '3', name: 'On Leave' },
];

export function NewEmployeeView() {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    employeeId: '',
    department: '',
    position: '',
    hireDate: null as Date | null,
    salary: '',
    status: 'Active',
    manager: '',
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

  const handleDateChange = (field: string) => (date: Date | null) => {
    setFormData(prev => ({
      ...prev,
      [field]: date,
    }));
  };

  // Get selected values for autocomplete
  const selectedDepartment = DEPARTMENTS.find(dept => dept.name === formData.department) || null;
  const selectedPosition = POSITIONS.find(pos => pos.name === formData.position) || null;
  const selectedStatus = STATUS_OPTIONS.find(status => status.name === formData.status) || null;

  const handleSubmit = useCallback(() => {
    // Handle form submission here
    console.log('Form data:', formData);

    // Basic validation
    if (!formData.name || !formData.email || !formData.department || !formData.position) {
      showSnackbar('Please fill in all required fields', 'error');
      return;
    }

    // Simulate API call
    try {
      // Here you would make an API call to create the employee
      setTimeout(() => {
        router.push('/dashboard/employees?refresh=true&action=created');
      }, 1500);
    } catch (error) {
      showSnackbar('Failed to create employee. Please try again.', 'error');
    }
  }, [formData, router, showSnackbar]);

  return (
    <DashboardContent>
      <Breadcrumb
        title="New Employee"
        items={[
          { title: 'Dashboard', href: '/dashboard' },
          { title: 'Employees', href: '/dashboard/employees' },
          { title: 'New Employee' }
        ]}
      />

      <Box sx={{ display: 'flex', justifyContent: 'flex-start', mt: 3, mb: 2 }}>
        <Button
          variant="outlined"
          size="large"
          onClick={() => router.push('/dashboard/employees')}
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
            Employee Information
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
                name="employeeId"
                label="Employee ID"
                value={formData.employeeId}
                onChange={handleInputChange('employeeId')}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
              <FormControl fullWidth>
                <Autocomplete
                  options={DEPARTMENTS}
                  getOptionLabel={(option) => option.name}
                  value={selectedDepartment}
                  onChange={handleAutocompleteChange('department')}
                  renderInput={(params) => (
                    <TextField {...params} label="Department" />
                  )}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: '#FFFFFF',
                      '&:hover': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#000000',
                        },
                      },
                      '&.Mui-focused': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#000000',
                          borderWidth: 2,
                        },
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
                  options={POSITIONS}
                  getOptionLabel={(option) => option.name}
                  value={selectedPosition}
                  onChange={handleAutocompleteChange('position')}
                  renderInput={(params) => (
                    <TextField {...params} label="Position" />
                  )}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: '#FFFFFF',
                      '&:hover': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#000000',
                        },
                      },
                      '&.Mui-focused': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#000000',
                          borderWidth: 2,
                        },
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

            <Box sx={{ display: 'flex', gap: 2 }}>
              <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="Hire Date"
                  value={formData.hireDate}
                  onChange={handleDateChange('hireDate')}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      sx: {
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: '#FFFFFF',
                          '&:hover': {
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#000000',
                            },
                          },
                          '&.Mui-focused': {
                            '& .MuiOutlinedInput-notchedOutline': {
                              borderColor: '#000000',
                              borderWidth: 2,
                            },
                          },
                        },
                      },
                    },
                  }}
                />
              </LocalizationProvider>
              <TextField
                fullWidth
                name="salary"
                label="Salary"
                type="number"
                value={formData.salary}
                onChange={handleInputChange('salary')}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
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
              <TextField
                fullWidth
                name="manager"
                label="Manager"
                value={formData.manager}
                onChange={handleInputChange('manager')}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2 }}>
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
                    '& .MuiOutlinedInput-root': {
                      borderRadius: 2,
                      backgroundColor: '#FFFFFF',
                      '&:hover': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#000000',
                        },
                      },
                      '&.Mui-focused': {
                        '& .MuiOutlinedInput-notchedOutline': {
                          borderColor: '#000000',
                          borderWidth: 2,
                        },
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
