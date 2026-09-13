import { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

import { useRouter } from 'src/routes/hooks';
import { DashboardContent } from 'src/layouts/dashboard';

import { Breadcrumb } from 'src/components/breadcrumb';
import { LucideIcon } from 'src/components/lucide-icons';
import { useSnackbar } from 'src/components/snackbar';
import { _employees } from 'src/_mock';

// ----------------------------------------------------------------------

// Attendance status data for autocomplete
const attendanceStatuses = [
  { id: '1', name: 'Present' },
  { id: '2', name: 'Late' },
  { id: '3', name: 'Absent' },
  { id: '4', name: 'Half Day' },
];

export function NewAttendanceView() {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  const [formData, setFormData] = useState({
    employeeId: '',
    employeeName: '',
    date: new Date(),
    checkIn: '',
    checkOut: '',
    status: '',
    overtime: 0,
    notes: '',
  });

  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [selectedStatus, setSelectedStatus] = useState<any>(null);

  const handleInputChange = useCallback((field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  }, []);

  const handleEmployeeChange = useCallback((event: any, newValue: any) => {
    setSelectedEmployee(newValue);
    if (newValue) {
      setFormData(prev => ({
        ...prev,
        employeeId: newValue.id,
        employeeName: newValue.name,
      }));
    }
  }, []);

  const handleStatusChange = useCallback((event: any, newValue: any) => {
    setSelectedStatus(newValue);
    if (newValue) {
      setFormData(prev => ({
        ...prev,
        status: newValue.name,
      }));
    }
  }, []);

  const handleSubmit = useCallback(() => {
    // Validate required fields
    if (!formData.employeeId || !formData.date || !formData.status) {
      showSnackbar('Please fill in all required fields!', 'error');
      return;
    }

    // Calculate total hours if check-in and check-out are provided
    let totalHours = 0;
    if (formData.checkIn && formData.checkOut) {
      const checkInTime = new Date(`2000-01-01 ${formData.checkIn}`);
      const checkOutTime = new Date(`2000-01-01 ${formData.checkOut}`);
      totalHours = (checkOutTime.getTime() - checkInTime.getTime()) / (1000 * 60 * 60);
    }

    const attendanceData = {
      ...formData,
      totalHours: Math.max(0, totalHours),
      id: `att_${Date.now()}`,
    };

    console.log('New Attendance Record:', attendanceData);
    showSnackbar('Attendance record added successfully!');
    router.push('/dashboard/attendance');
  }, [formData, showSnackbar, router]);



  return (
    <DashboardContent>
      <Breadcrumb
        title="Add Attendance"
        items={[
          { title: 'Dashboard', href: '/dashboard' },
          { title: 'Attendance', href: '/dashboard/attendance' },
          { title: 'Add Attendance' },
        ]}
      />

      <Card sx={{ p: 3 }}>
        <Stack spacing={3}>
          <Box
            sx={{
              display: 'grid',
              gap: 3,
              gridTemplateColumns: { xs: 'repeat(1, 1fr)', md: 'repeat(2, 1fr)' },
            }}
          >
            {/* Employee Selection */}
            <Autocomplete
              options={_employees}
              getOptionLabel={(option) => `${option.name} (${option.id})`}
              value={selectedEmployee}
              onChange={handleEmployeeChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Employee *"
                  placeholder="Search employees..."
                  required
                />
              )}
              sx={{
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

            {/* Date */}
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Date *"
                value={formData.date}
                onChange={(newValue) => handleInputChange('date', newValue)}
                slotProps={{
                  textField: {
                    required: true,
                    fullWidth: true,
                  },
                }}
              />
            </LocalizationProvider>

            {/* Check In Time */}
            <TextField
              label="Check In Time"
              type="time"
              value={formData.checkIn}
              onChange={(e) => handleInputChange('checkIn', e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 300, // 5 min
              }}
            />

            {/* Check Out Time */}
            <TextField
              label="Check Out Time"
              type="time"
              value={formData.checkOut}
              onChange={(e) => handleInputChange('checkOut', e.target.value)}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                step: 300, // 5 min
              }}
            />

            {/* Status */}
            <Autocomplete
              options={attendanceStatuses}
              getOptionLabel={(option) => option.name}
              value={selectedStatus}
              onChange={handleStatusChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Status *"
                  placeholder="Select status..."
                  required
                />
              )}
              sx={{
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

            {/* Overtime Hours */}
            <TextField
              label="Overtime Hours"
              type="number"
              value={formData.overtime}
              onChange={(e) => handleInputChange('overtime', parseFloat(e.target.value) || 0)}
              inputProps={{
                min: 0,
                step: 0.5,
              }}
            />
          </Box>

          {/* Notes */}
          <TextField
            label="Notes"
            multiline
            rows={4}
            value={formData.notes}
            onChange={(e) => handleInputChange('notes', e.target.value)}
            placeholder="Add any additional notes..."
          />

          {/* Action Buttons */}
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              startIcon={<LucideIcon icon="eva:save-fill" />}
            >
              Save Attendance
            </Button>
          </Stack>
        </Stack>
      </Card>
    </DashboardContent>
  );
}
