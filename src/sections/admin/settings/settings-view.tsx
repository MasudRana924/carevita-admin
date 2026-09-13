import { useState } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import Stack from '@mui/material/Stack';

import { DashboardContent } from 'src/layouts/dashboard';

import { Breadcrumb } from 'src/components/breadcrumb';
import { LucideIcon } from 'src/components/lucide-icons';
import { useSnackbar } from 'src/components/snackbar';

// ----------------------------------------------------------------------

export function SettingsView() {
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      showSnackbar('Settings saved successfully', 'success');
    } catch (error) {
      showSnackbar('Failed to save settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardContent>
      <Breadcrumb 
        title="Settings" 
        items={[
          { title: 'Dashboard', href: '/dashboard' },
          { title: 'Settings' }
        ]} 
      />

      <Stack spacing={3}>
        {/* General Settings */}
        <Card>
          <CardHeader title="General Settings" />
          <CardContent>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Application Name"
                defaultValue="CareMate Admin"
                helperText="The name of your application"
              />
              
              <TextField
                fullWidth
                label="Support Email"
                defaultValue="support@caremate.com"
                helperText="Email address for user support"
              />

              <TextField
                fullWidth
                label="Support Phone"
                defaultValue="+880 1700-000000"
                helperText="Phone number for user support"
              />

              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Enable Email Notifications"
              />

              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Enable SMS Notifications"
              />

              <FormControlLabel
                control={<Switch />}
                label="Maintenance Mode"
              />
            </Stack>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader title="Security Settings" />
          <CardContent>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Session Timeout (minutes)"
                type="number"
                defaultValue={30}
                helperText="Auto-logout after inactivity"
              />

              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Require Two-Factor Authentication"
              />

              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Enable IP Whitelist"
              />

              <TextField
                fullWidth
                label="Allowed IP Addresses"
                multiline
                rows={3}
                placeholder="Enter IP addresses separated by commas"
                helperText="Leave empty to allow all IPs"
              />
            </Stack>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card>
          <CardHeader title="System Settings" />
          <CardContent>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Default Timezone"
                defaultValue="Asia/Dhaka"
                helperText="System default timezone"
              />

              <TextField
                fullWidth
                label="Date Format"
                defaultValue="DD/MM/YYYY"
                helperText="Preferred date format"
              />

              <TextField
                fullWidth
                label="Time Format"
                defaultValue="24-hour"
                helperText="Preferred time format"
              />

              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Enable Activity Logging"
              />

              <FormControlLabel
                control={<Switch defaultChecked />}
                label="Enable Error Reporting"
              />
            </Stack>
          </CardContent>
        </Card>

        {/* Actions */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<LucideIcon icon="eva:arrow-undo-fill" />}
          >
            Reset to Defaults
          </Button>
          <Button
            variant="contained"
            startIcon={<LucideIcon icon="eva:save-fill" />}
            onClick={handleSaveSettings}
            disabled={loading}
          >
            {loading ? 'Saving...' : 'Save Settings'}
          </Button>
        </Box>
      </Stack>
    </DashboardContent>
  );
}
