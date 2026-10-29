import type { ReactNode } from 'react';

import { Fragment, useState } from 'react';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import Card from '@mui/material/Card';
import Tabs from '@mui/material/Tabs';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import CircularProgress from '@mui/material/CircularProgress';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';
import { Breadcrumb } from 'src/components/breadcrumb';
import { useSnackbar } from 'src/components/snackbar';
import {
  IconBadge,
  PremiumSwitch,
  SectionCard,
  PREMIUM_CARD_SX,
  type ToneColor,
} from 'src/components/detail-ui';

// ----------------------------------------------------------------------

const DEFAULT_SETTINGS = {
  emailNotifications: true,
  smsNotifications: true,
  maintenanceMode: false,
  twoFactorAuth: true,
  ipWhitelist: true,
  activityLogging: true,
  errorReporting: true,
};

type SettingKey = keyof typeof DEFAULT_SETTINGS;

const SECTIONS: { id: string; label: string; icon: string; color: ToneColor }[] = [
  {
    id: 'notifications',
    label: 'Notifications',
    icon: 'solar:bell-bing-bold-duotone',
    color: 'primary',
  },
  { id: 'application', label: 'Application', icon: 'solar:widget-5-bold-duotone', color: 'info' },
  { id: 'security', label: 'Security', icon: 'solar:shield-keyhole-bold-duotone', color: 'error' },
  { id: 'system', label: 'System', icon: 'solar:settings-bold-duotone', color: 'warning' },
];

const TIMEZONES = ['Asia/Dhaka', 'Asia/Kolkata', 'Asia/Dubai', 'Europe/London', 'UTC'];
const DATE_FORMATS = ['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD'];
const TIME_FORMATS = ['24-hour', '12-hour'];

const FIELDS_GRID_SX = {
  display: 'grid',
  gap: 2.5,
  gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)' },
} as const;

function adornment(icon: string) {
  return {
    input: {
      startAdornment: (
        <InputAdornment position="start">
          <Iconify icon={icon} width={20} sx={{ color: 'text.disabled' }} />
        </InputAdornment>
      ),
    },
  };
}

export function SettingsView() {
  const { showSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState(SECTIONS[0].id);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);

  const handleToggle = (key: SettingKey) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setSettings((prev) => ({ ...prev, [key]: event.target.checked }));
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      showSnackbar('Settings saved successfully', 'success');
    } catch (error) {
      showSnackbar('Failed to save settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const enabledCount = Object.values(settings).filter(Boolean).length;

  return (
    <DashboardContent>
      <Breadcrumb
        title="Settings"
        items={[{ title: 'Dashboard', href: '/dashboard' }, { title: 'Settings' }]}
      />

      <Stack
        spacing={3}
        sx={{
          maxWidth: 1080,
          // Inactive panels stay mounted (hidden) so uncontrolled fields keep their values across tabs.
          [`& > .MuiCard-root[id]:not([id="${activeSection}"])`]: { display: 'none' },
        }}
      >
        <Card
          sx={{
            ...PREMIUM_CARD_SX,
            px: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Tabs
            value={activeSection}
            onChange={(_event, value) => setActiveSection(value)}
            variant="scrollable"
            allowScrollButtonsMobile
          >
            {SECTIONS.map((section) => (
              <Tab
                key={section.id}
                value={section.id}
                iconPosition="start"
                icon={<Iconify icon={section.icon} width={22} />}
                label={section.label}
              />
            ))}
          </Tabs>
          <Typography
            variant="caption"
            sx={{ display: { xs: 'none', md: 'block' }, color: 'text.secondary', flexShrink: 0 }}
          >
            {enabledCount} of {Object.keys(settings).length} features enabled
          </Typography>
        </Card>
        <SectionCard
          id="notifications"
          icon="solar:bell-bing-bold-duotone"
          color="primary"
          title="Notifications"
          subtitle="Control how you receive notifications"
        >
          <SettingList>
            <SettingRow
              icon="solar:letter-bold-duotone"
              title="Email notifications"
              description="Receive email alerts for important updates"
              checked={settings.emailNotifications}
              onChange={handleToggle('emailNotifications')}
            />
            <SettingRow
              icon="solar:chat-square-bold-duotone"
              title="SMS notifications"
              description="Receive SMS alerts for urgent notifications"
              checked={settings.smsNotifications}
              onChange={handleToggle('smsNotifications')}
            />
          </SettingList>
        </SectionCard>

        <SectionCard
          id="application"
          icon="solar:widget-5-bold-duotone"
          color="info"
          title="Application"
          subtitle="Branding and support contact shown to users"
        >
          <Box sx={FIELDS_GRID_SX}>
            <TextField
              fullWidth
              label="Application name"
              defaultValue="Nirapod Admin"
              helperText="The name displayed in the application"
              slotProps={adornment('solar:text-square-bold-duotone')}
            />
            <TextField
              fullWidth
              type="email"
              label="Support email"
              defaultValue="support@Nirapod.com"
              helperText="Email address for user support"
              slotProps={adornment('solar:letter-bold-duotone')}
            />
            <TextField
              fullWidth
              label="Support phone"
              defaultValue="+880 1700-000000"
              helperText="Phone number for user support"
              slotProps={adornment('solar:phone-bold-duotone')}
            />
          </Box>

          <Divider sx={{ my: 3, borderStyle: 'dashed' }} />

          <SettingList>
            <SettingRow
              icon="solar:danger-triangle-bold-duotone"
              tone="warning"
              title="Maintenance mode"
              description="Temporarily disable the apps while you run maintenance"
              checked={settings.maintenanceMode}
              onChange={handleToggle('maintenanceMode')}
              color="warning"
            />
          </SettingList>
        </SectionCard>

        <SectionCard
          id="security"
          icon="solar:shield-keyhole-bold-duotone"
          color="error"
          title="Security"
          subtitle="Manage security and access controls"
        >
          <Box sx={FIELDS_GRID_SX}>
            <TextField
              fullWidth
              type="number"
              label="Session timeout"
              defaultValue={30}
              helperText="Auto-logout after a period of inactivity"
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify
                        icon="solar:clock-circle-bold-duotone"
                        width={20}
                        sx={{ color: 'text.disabled' }}
                      />
                    </InputAdornment>
                  ),
                  endAdornment: <InputAdornment position="end">min</InputAdornment>,
                },
              }}
            />
          </Box>

          <Divider sx={{ my: 3, borderStyle: 'dashed' }} />

          <SettingList>
            <SettingRow
              icon="solar:lock-password-bold-duotone"
              title="Two-factor authentication"
              description="Add an extra layer of security to admin accounts"
              checked={settings.twoFactorAuth}
              onChange={handleToggle('twoFactorAuth')}
            />
            <SettingRow
              icon="solar:server-square-bold-duotone"
              title="IP whitelist"
              description="Restrict access to specific IP addresses only"
              checked={settings.ipWhitelist}
              onChange={handleToggle('ipWhitelist')}
            />
          </SettingList>

          <TextField
            fullWidth
            multiline
            rows={3}
            label="Allowed IP addresses"
            placeholder="Enter IP addresses separated by commas"
            helperText={
              settings.ipWhitelist ? 'Leave empty to allow all IPs' : 'Turn on IP whitelist to edit'
            }
            disabled={!settings.ipWhitelist}
            sx={{ mt: 2.5 }}
          />
        </SectionCard>

        <SectionCard
          id="system"
          icon="solar:settings-bold-duotone"
          color="warning"
          title="System"
          subtitle="Regional formats and diagnostics"
        >
          <Box
            sx={{
              ...FIELDS_GRID_SX,
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', lg: 'repeat(3, 1fr)' },
            }}
          >
            <TextField select fullWidth label="Default timezone" defaultValue="Asia/Dhaka">
              {TIMEZONES.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <TextField select fullWidth label="Date format" defaultValue="DD/MM/YYYY">
              {DATE_FORMATS.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
            <TextField select fullWidth label="Time format" defaultValue="24-hour">
              {TIME_FORMATS.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </TextField>
          </Box>

          <Divider sx={{ my: 3, borderStyle: 'dashed' }} />

          <SettingList>
            <SettingRow
              icon="solar:document-text-bold-duotone"
              title="Activity logging"
              description="Track admin activity for the audit log"
              checked={settings.activityLogging}
              onChange={handleToggle('activityLogging')}
            />
            <SettingRow
              icon="solar:bug-bold-duotone"
              title="Error reporting"
              description="Automatically report errors for troubleshooting"
              checked={settings.errorReporting}
              onChange={handleToggle('errorReporting')}
            />
          </SettingList>
        </SectionCard>

        <Card
          sx={{
            ...PREMIUM_CARD_SX,
            p: 2,
            position: 'sticky',
            bottom: 16,
            zIndex: 2,
            display: 'flex',
            flexWrap: 'wrap',
            gap: 2,
            alignItems: 'center',
            justifyContent: 'space-between',
            bgcolor: 'rgba(255, 255, 255, 0.88)',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 16px 32px -16px rgba(15, 23, 42, 0.24)',
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Iconify icon="solar:info-circle-bold" width={20} sx={{ color: 'info.main' }} />
            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
              Changes apply to every admin account.
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1.5}>
            <Button
              variant="outlined"
              color="inherit"
              disabled={loading}
              startIcon={<Iconify icon="solar:undo-left-round-bold" />}
              onClick={() => setSettings(DEFAULT_SETTINGS)}
            >
              Reset to defaults
            </Button>
            <Button
              variant="contained"
              disabled={loading}
              startIcon={
                loading ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <Iconify icon="solar:diskette-bold" />
                )
              }
              onClick={handleSaveSettings}
            >
              {loading ? 'Saving...' : 'Save settings'}
            </Button>
          </Stack>
        </Card>
      </Stack>
    </DashboardContent>
  );
}

// ----------------------------------------------------------------------

function SettingList({ children }: { children: ReactNode }) {
  const items = Array.isArray(children) ? children : [children];
  return (
    <Box
      sx={{ borderRadius: 1.5, border: '1px solid', borderColor: 'divider', overflow: 'hidden' }}
    >
      {items.map((child, index) => (
        <Fragment key={index}>
          {index > 0 && <Divider />}
          {child}
        </Fragment>
      ))}
    </Box>
  );
}

function SettingRow({
  icon,
  title,
  description,
  checked,
  onChange,
  tone = 'primary',
  color = 'success',
}: {
  icon: string;
  title: string;
  description: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  tone?: ToneColor;
  color?: 'success' | 'warning';
}) {
  return (
    <Box
      component="label"
      sx={{
        px: 2,
        py: 1.75,
        gap: 2,
        display: 'flex',
        cursor: 'pointer',
        alignItems: 'center',
        transition: 'background-color 160ms ease',
        '&:hover': { bgcolor: 'background.neutral' },
      }}
    >
      <Box
        sx={{
          filter: checked ? 'none' : 'grayscale(1)',
          opacity: checked ? 1 : 0.6,
          transition: 'all 240ms ease',
        }}
      >
        <IconBadge icon={icon} color={tone} size={38} />
      </Box>
      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Typography variant="subtitle2">{title}</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {description}
        </Typography>
      </Box>
      <Typography
        variant="caption"
        sx={{
          fontWeight: 600,
          minWidth: 24,
          textAlign: 'right',
          color: checked ? `${color}.main` : 'text.disabled',
        }}
      >
        {checked ? 'On' : 'Off'}
      </Typography>
      <PremiumSwitch checked={checked} onChange={onChange} color={color} />
    </Box>
  );
}
