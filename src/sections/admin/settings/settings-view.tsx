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
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import { alpha } from '@mui/material/styles';

import { DashboardContent } from 'src/layouts/dashboard';

import { Breadcrumb } from 'src/components/breadcrumb';
import { LucideIcon } from 'src/components/lucide-icons';
import { useSnackbar } from 'src/components/snackbar';

// ----------------------------------------------------------------------

export function SettingsView() {
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);

  const [settings, setSettings] = useState({
    emailNotifications: true,
    smsNotifications: true,
    maintenanceMode: false,
    twoFactorAuth: true,
    ipWhitelist: true,
    activityLogging: true,
    errorReporting: true,
  });

  const handleToggle = (key: keyof typeof settings) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings(prev => ({ ...prev, [key]: event.target.checked }));
  };

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
        {/* Notification Settings */}
        <Card>
          <CardHeader 
            title="Notification Settings" 
            subheader="Control how you receive notifications"
          />
          <CardContent>
            <Stack spacing={2}>
              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 2, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  bgcolor: 'background.paper',
                  '&:hover': {
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
                  }
                }}
              >
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Email Notifications
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Receive email alerts for important updates
                  </Typography>
                </Box>
                <Switch
                  checked={settings.emailNotifications}
                  onChange={handleToggle('emailNotifications')}
                  color="primary"
                />
              </Paper>

              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 2, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  bgcolor: 'background.paper',
                  '&:hover': {
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
                  }
                }}
              >
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    SMS Notifications
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Receive SMS alerts for urgent notifications
                  </Typography>
                </Box>
                <Switch
                  checked={settings.smsNotifications}
                  onChange={handleToggle('smsNotifications')}
                  color="primary"
                />
              </Paper>
            </Stack>
          </CardContent>
        </Card>

        {/* Application Settings */}
        <Card>
          <CardHeader 
            title="Application Settings" 
            subheader="Configure application behavior"
          />
          <CardContent>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Application Name"
                defaultValue="CareMate Admin"
                helperText="The name displayed in the application"
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

              <Divider />

              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 2, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  bgcolor: 'background.paper',
                  '&:hover': {
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
                  }
                }}
              >
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Maintenance Mode
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Temporarily disable the application for maintenance
                  </Typography>
                </Box>
                <Switch
                  checked={settings.maintenanceMode}
                  onChange={handleToggle('maintenanceMode')}
                  color="warning"
                />
              </Paper>
            </Stack>
          </CardContent>
        </Card>

        {/* Security Settings */}
        <Card>
          <CardHeader 
            title="Security Settings" 
            subheader="Manage security and access controls"
          />
          <CardContent>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Session Timeout (minutes)"
                type="number"
                defaultValue={30}
                helperText="Auto-logout after period of inactivity"
              />

              <Divider />

              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 2, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  bgcolor: 'background.paper',
                  '&:hover': {
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
                  }
                }}
              >
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Two-Factor Authentication
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Add an extra layer of security to your account
                  </Typography>
                </Box>
                <Switch
                  checked={settings.twoFactorAuth}
                  onChange={handleToggle('twoFactorAuth')}
                  color="primary"
                />
              </Paper>

              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 2, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  bgcolor: 'background.paper',
                  '&:hover': {
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
                  }
                }}
              >
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    IP Whitelist
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Restrict access to specific IP addresses only
                  </Typography>
                </Box>
                <Switch
                  checked={settings.ipWhitelist}
                  onChange={handleToggle('ipWhitelist')}
                  color="primary"
                />
              </Paper>

              <TextField
                fullWidth
                label="Allowed IP Addresses"
                multiline
                rows={3}
                placeholder="Enter IP addresses separated by commas"
                helperText="Leave empty to allow all IPs"
                disabled={!settings.ipWhitelist}
              />
            </Stack>
          </CardContent>
        </Card>

        {/* System Settings */}
        <Card>
          <CardHeader 
            title="System Settings" 
            subheader="Configure system preferences"
          />
          <CardContent>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="Default Timezone"
                defaultValue="Asia/Dhaka"
                helperText="System default timezone for all users"
              />

              <TextField
                fullWidth
                label="Date Format"
                defaultValue="DD/MM/YYYY"
                helperText="Preferred date format throughout the application"
              />

              <TextField
                fullWidth
                label="Time Format"
                defaultValue="24-hour"
                helperText="Preferred time format (12-hour or 24-hour)"
              />

              <Divider />

              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 2, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  bgcolor: 'background.paper',
                  '&:hover': {
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
                  }
                }}
              >
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Activity Logging
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Track user activities for audit purposes
                  </Typography>
                </Box>
                <Switch
                  checked={settings.activityLogging}
                  onChange={handleToggle('activityLogging')}
                  color="primary"
                />
              </Paper>

              <Paper 
                variant="outlined" 
                sx={{ 
                  p: 2, 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  bgcolor: 'background.paper',
                  '&:hover': {
                    bgcolor: (theme) => alpha(theme.palette.primary.main, 0.04),
                  }
                }}
              >
                <Box>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Error Reporting
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Automatically report errors for troubleshooting
                  </Typography>
                </Box>
                <Switch
                  checked={settings.errorReporting}
                  onChange={handleToggle('errorReporting')}
                  color="primary"
                />
              </Paper>
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
