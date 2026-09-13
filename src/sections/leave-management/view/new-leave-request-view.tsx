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

// Leave type data for autocomplete
const leaveTypes = [
  { id: '1', name: 'Annual Leave' },
  { id: '2', name: 'Sick Leave' },
  { id: '3', name: 'Personal Leave' },
  { id: '4', name: 'Maternity Leave' },
  { id: '5', name: 'Paternity Leave' },
  { id: '6', name: 'Bereavement Leave' },
];

export function NewLeaveRequestView() {
  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  const [formData, setFormData] = useState({
    employeeId: '',
    employeeName: '',
    leaveType: '',
    startDate: new Date(),
    endDate: new Date(),
    totalDays: 1,
    reason: '',
  });

  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [selectedLeaveType, setSelectedLeaveType] = useState<any>(null);

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

  const handleLeaveTypeChange = useCallback((event: any, newValue: any) => {
    setSelectedLeaveType(newValue);
    if (newValue) {
      setFormData(prev => ({
        ...prev,
        leaveType: newValue.name,
      }));
    }
  }, []);

  const calculateTotalDays = useCallback((startDate: Date, endDate: Date) => {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays + 1; // Include both start and end dates
  }, []);

  const handleStartDateChange = useCallback((newValue: Date | null) => {
    if (newValue) {
      setFormData(prev => {
        const totalDays = calculateTotalDays(newValue, prev.endDate);
        return {
          ...prev,
          startDate: newValue,
          totalDays,
        };
      });
    }
  }, [calculateTotalDays]);

  const handleEndDateChange = useCallback((newValue: Date | null) => {
    if (newValue) {
      setFormData(prev => {
        const totalDays = calculateTotalDays(prev.startDate, newValue);
        return {
          ...prev,
          endDate: newValue,
          totalDays,
        };
      });
    }
  }, [calculateTotalDays]);

  const handleSubmit = useCallback(() => {
    // Validate required fields
    if (!formData.employeeId || !formData.leaveType || !formData.reason) {
      showSnackbar('Please fill in all required fields!', 'error');
      return;
    }

    if (formData.startDate >= formData.endDate) {
      showSnackbar('End date must be after start date!', 'error');
      return;
    }

    const leaveRequestData = {
      ...formData,
      id: `leave_${Date.now()}`,
      status: 'Pending',
      submittedDate: new Date().toISOString(),
    };

    console.log('New Leave Request:', leaveRequestData);
    showSnackbar('Leave request submitted successfully!');
    router.push('/dashboard/leave-management');
  }, [formData, showSnackbar, router]);

  return (
    <DashboardContent>
      <Breadcrumb
        title="New Leave Request"
        items={[
          { title: 'Dashboard', href: '/dashboard' },
          { title: 'Leave Management', href: '/dashboard/leave-management' },
          { title: 'New Leave Request' },
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
            />

            {/* Leave Type */}
            <Autocomplete
              options={leaveTypes}
              getOptionLabel={(option) => option.name}
              value={selectedLeaveType}
              onChange={handleLeaveTypeChange}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Leave Type *"
                  placeholder="Select leave type..."
                  required
                />
              )}
            />

            {/* Start Date */}
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start Date *"
                value={formData.startDate}
                onChange={handleStartDateChange}
                slotProps={{
                  textField: {
                    required: true,
                    fullWidth: true,
                  },
                }}
              />
            </LocalizationProvider>

            {/* End Date */}
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="End Date *"
                value={formData.endDate}
                onChange={handleEndDateChange}
                slotProps={{
                  textField: {
                    required: true,
                    fullWidth: true,
                  },
                }}
              />
            </LocalizationProvider>

            {/* Total Days */}
            <TextField
              label="Total Days"
              type="number"
              value={formData.totalDays}
              onChange={(e) => handleInputChange('totalDays', parseInt(e.target.value) || 1)}
              inputProps={{
                min: 1,
                readOnly: true,
              }}
              sx={{ gridColumn: { xs: 'span 1', md: 'span 2' } }}
            />
          </Box>

          {/* Reason */}
          <TextField
            label="Reason *"
            multiline
            rows={4}
            value={formData.reason}
            onChange={(e) => handleInputChange('reason', e.target.value)}
            placeholder="Please provide a detailed reason for your leave request..."
            required
          />

          {/* Action Buttons */}
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              startIcon={<LucideIcon icon="eva:save-fill" />}
            >
              Submit Leave Request
            </Button>
          </Stack>
        </Stack>
      </Card>
    </DashboardContent>
  );
}
