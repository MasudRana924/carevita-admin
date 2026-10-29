import type { ReactNode } from 'react';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';
import { styled } from '@mui/material/styles';

import { Label } from 'src/components/label';
import { Iconify } from 'src/components/iconify';

// ----------------------------------------------------------------------

export type ToneColor = 'primary' | 'secondary' | 'info' | 'success' | 'warning' | 'error';

export const PREMIUM_CARD_SX = {
  borderRadius: 2,
  border: '1px solid',
  borderColor: 'divider',
  boxShadow: 'none',
} as const;

export function IconBadge({
  icon,
  color = 'primary',
  size = 40,
}: {
  icon: string;
  color?: ToneColor;
  size?: number;
}) {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 1.25,
        color: `${color}.main`,
        bgcolor: `${color}.lighter`,
      }}
    >
      <Iconify icon={icon} width={Math.round(size * 0.55)} />
    </Box>
  );
}

export function SectionCard({
  icon,
  color = 'primary',
  title,
  subtitle,
  count,
  action,
  children,
  id,
  noPadding,
}: {
  icon: string;
  color?: ToneColor;
  title: string;
  subtitle?: string;
  count?: number;
  action?: ReactNode;
  children: ReactNode;
  id?: string;
  noPadding?: boolean;
}) {
  return (
    <Card id={id} sx={{ ...PREMIUM_CARD_SX, scrollMarginTop: 96 }}>
      <Stack
        direction="row"
        alignItems="center"
        spacing={1.5}
        sx={{ p: 3, pb: noPadding ? 2.5 : 0, mb: noPadding ? 0 : 2.5 }}
      >
        <IconBadge icon={icon} color={color} />
        <Box sx={{ flexGrow: 1, minWidth: 0 }}>
          <Stack direction="row" alignItems="center" spacing={1}>
            <Typography variant="subtitle1">{title}</Typography>
            {count !== undefined && (
              <Label variant="soft" color={count ? color : 'default'}>
                {count}
              </Label>
            )}
          </Stack>
          {subtitle && (
            <Typography variant="caption" sx={{ color: 'text.secondary' }}>
              {subtitle}
            </Typography>
          )}
        </Box>
        {action}
      </Stack>
      <Box sx={noPadding ? undefined : { px: 3, pb: 3 }}>{children}</Box>
    </Card>
  );
}

export function InfoTile({
  icon,
  label,
  value,
  action,
}: {
  icon: string;
  label: string;
  value: ReactNode;
  action?: ReactNode;
}) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing={1.5}
      sx={{ p: 1.5, minWidth: 0, borderRadius: 1.5, bgcolor: 'background.neutral' }}
    >
      <Iconify icon={icon} width={22} sx={{ color: 'text.secondary' }} />
      <Box sx={{ minWidth: 0, flexGrow: 1 }}>
        <Typography variant="caption" sx={{ color: 'text.secondary', display: 'block' }}>
          {label}
        </Typography>
        {typeof value === 'string' || typeof value === 'number' ? (
          <Typography variant="subtitle2" noWrap title={String(value)}>
            {value}
          </Typography>
        ) : (
          value
        )}
      </Box>
      {action}
    </Stack>
  );
}

export function DetailRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      spacing={2}
      sx={{ minHeight: 28 }}
    >
      <Typography variant="body2" sx={{ color: 'text.secondary', flexShrink: 0 }}>
        {label}
      </Typography>
      {typeof value === 'string' || typeof value === 'number' ? (
        <Typography
          variant="subtitle2"
          sx={{ textAlign: 'right', wordBreak: 'break-word', minWidth: 0 }}
        >
          {value}
        </Typography>
      ) : (
        value
      )}
    </Stack>
  );
}

export function StatTile({
  icon,
  color,
  label,
  value,
}: {
  icon: string;
  color: ToneColor;
  label: string;
  value: ReactNode;
}) {
  return (
    <Card sx={{ ...PREMIUM_CARD_SX, p: 2.5, display: 'flex', alignItems: 'center', gap: 2 }}>
      <IconBadge icon={icon} color={color} size={48} />
      <Box sx={{ minWidth: 0 }}>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          {label}
        </Typography>
        <Typography variant="h5" noWrap>
          {value}
        </Typography>
      </Box>
    </Card>
  );
}

export function ProfileHero({
  avatarSrc,
  avatarIcon,
  name,
  subtitle,
  badges,
  actions,
  tiles,
}: {
  avatarSrc?: string | null;
  avatarIcon?: string;
  name: string;
  subtitle?: ReactNode;
  badges?: ReactNode;
  actions?: ReactNode;
  tiles?: ReactNode;
}) {
  return (
    <Card sx={{ ...PREMIUM_CARD_SX, overflow: 'hidden' }}>
      <Box
        sx={{
          height: 96,
          background: (theme) =>
            `linear-gradient(135deg, ${theme.vars.palette.primary.lighter} 0%, ${theme.vars.palette.info.lighter} 100%)`,
        }}
      />
      <Box sx={{ px: 3, pb: 3 }}>
        <Stack
          direction={{ xs: 'column', md: 'row' }}
          spacing={2.5}
          alignItems={{ xs: 'flex-start', md: 'flex-end' }}
          sx={{ mt: -5 }}
        >
          <Avatar
            src={avatarSrc || undefined}
            alt={name}
            slotProps={{ img: { referrerPolicy: 'no-referrer' } }}
            sx={{
              width: 96,
              height: 96,
              fontSize: 36,
              fontWeight: 600,
              color: 'primary.dark',
              bgcolor: 'primary.lighter',
              border: '4px solid',
              borderColor: 'background.paper',
              boxShadow: '0 8px 16px -8px rgba(15, 23, 42, 0.24)',
            }}
          >
            {avatarIcon ? <Iconify icon={avatarIcon} width={44} /> : name.charAt(0).toUpperCase()}
          </Avatar>
          <Box sx={{ flexGrow: 1, minWidth: 0, pb: 0.5 }}>
            <Typography variant="h5" noWrap>
              {name}
            </Typography>
            {subtitle && (
              <Typography
                variant="body2"
                component="div"
                sx={{ color: 'text.secondary', mt: 0.25 }}
                noWrap
              >
                {subtitle}
              </Typography>
            )}
            {badges && (
              <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
                {badges}
              </Stack>
            )}
          </Box>
          {actions && (
            <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap sx={{ pb: 0.5 }}>
              {actions}
            </Stack>
          )}
        </Stack>

        {tiles && (
          <Box
            sx={{
              mt: 3,
              display: 'grid',
              gap: 2,
              gridTemplateColumns: { xs: '1fr', sm: 'repeat(2, 1fr)', xl: 'repeat(4, 1fr)' },
            }}
          >
            {tiles}
          </Box>
        )}
      </Box>
    </Card>
  );
}

/** `slotProps` for a TextField with a leading icon; multiline fields pin the icon to the first line. */
export function iconFieldSlotProps(icon: string, options?: { multiline?: boolean }) {
  return {
    input: {
      startAdornment: (
        <InputAdornment
          position="start"
          sx={options?.multiline ? { alignSelf: 'flex-start', mt: '10px' } : undefined}
        >
          <Iconify icon={icon} width={20} sx={{ color: 'text.disabled' }} />
        </InputAdornment>
      ),
    },
  };
}

/** iOS-style toggle used across settings-like screens. */
export const PremiumSwitch = styled(Switch)(({ theme }) => ({
  width: 46,
  height: 26,
  padding: 0,
  '& .MuiSwitch-switchBase': {
    padding: 0,
    margin: 3,
    transitionDuration: '240ms',
    '&.Mui-checked': {
      transform: 'translateX(20px)',
      color: theme.vars.palette.common.white,
      '& + .MuiSwitch-track': {
        opacity: 1,
        border: 0,
        backgroundColor: theme.vars.palette.success.main,
      },
    },
    '&.Mui-checked.MuiSwitch-colorWarning + .MuiSwitch-track': {
      backgroundColor: theme.vars.palette.warning.main,
    },
    '&.Mui-focusVisible .MuiSwitch-thumb': {
      outline: `4px solid ${theme.vars.palette.primary.lighter}`,
    },
    '&.Mui-disabled + .MuiSwitch-track': { opacity: 0.4 },
  },
  '& .MuiSwitch-thumb': {
    width: 20,
    height: 20,
    boxSizing: 'border-box',
    boxShadow: '0 2px 4px rgba(15, 23, 42, 0.24)',
  },
  '& .MuiSwitch-track': {
    borderRadius: 13,
    opacity: 1,
    backgroundColor: theme.vars.palette.grey[300],
    transition: theme.transitions.create(['background-color'], { duration: 240 }),
  },
}));
