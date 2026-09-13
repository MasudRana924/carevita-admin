import type { Theme, SxProps, Breakpoint } from '@mui/material/styles';

import { varAlpha } from 'minimal-shared/utils';

import Box from '@mui/material/Box';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import ListItemButton from '@mui/material/ListItemButton';
import Drawer, { drawerClasses } from '@mui/material/Drawer';

import { usePathname } from 'src/routes/hooks';
import { RouterLink } from 'src/routes/components';

import { Logo } from 'src/components/logo';
import { Scrollbar } from 'src/components/scrollbar';

import type { NavGroup, NavItem } from '../nav-config-dashboard';

export type NavContentProps = {
  data: NavGroup[];
  slots?: {
    topArea?: React.ReactNode;
    bottomArea?: React.ReactNode;
  };
  sx?: SxProps<Theme>;
};

export function NavDesktop({
  sx,
  data,
  slots,
  layoutQuery,
}: NavContentProps & { layoutQuery: Breakpoint }) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        pt: 3,
        px: 2,
        top: 0,
        left: 0,
        height: 1,
        display: 'none',
        position: 'fixed',
        flexDirection: 'column',
        zIndex: 'var(--layout-nav-zIndex)',
        width: 'var(--layout-nav-vertical-width)',
        borderRight: `1px solid ${varAlpha(theme.vars.palette.grey['500Channel'], 0.12)}`,
        bgcolor: 'background.paper',
        [theme.breakpoints.up(layoutQuery)]: {
          display: 'flex',
        },
        ...sx,
      }}
    >
      <NavContent data={data} slots={slots} />
    </Box>
  );
}

export function NavMobile({
  sx,
  data,
  open,
  slots,
  onClose,
}: NavContentProps & { open: boolean; onClose: () => void }) {
  return (
    <Drawer
      open={open}
      onClose={onClose}
      slotProps={{
        backdrop: { invisible: true },
      }}
      sx={{
        [`& .${drawerClasses.paper}`]: {
          pt: 3,
          px: 2,
          overflow: 'unset',
          width: 'var(--layout-nav-mobile-width)',
          ...sx,
        },
      }}
    >
      <NavContent data={data} slots={slots} onItemClick={onClose} />
    </Drawer>
  );
}

function NavContent({
  data,
  slots,
  sx,
  onItemClick,
}: NavContentProps & { onItemClick?: () => void }) {
  const pathname = usePathname();

  return (
    <>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, px: 1, mb: 2 }}>
        <Logo href="/dashboard" />
        <Typography variant="subtitle1">CareMate</Typography>
      </Box>

      {slots?.topArea}

      <Scrollbar fillContent>
        <Box
          component="nav"
          sx={[
            {
              display: 'flex',
              flex: '1 1 auto',
              flexDirection: 'column',
              pt: 0,
            },
            ...(Array.isArray(sx) ? sx : [sx]),
          ]}
        >
          {data.map((group) => (
            <Box key={group.subheader} sx={{ mb: 2 }}>
              <Typography
                variant="caption"
                sx={{ px: 2, mb: 0.75, display: 'block', color: 'text.disabled', fontWeight: 700 }}
              >
                {group.subheader}
              </Typography>
              <Box component="ul" sx={{ gap: 0.25, display: 'flex', flexDirection: 'column' }}>
                {group.items.map((item) => (
                  <NavLink
                    key={`${group.subheader}-${item.title}-${item.path}`}
                    item={item}
                    active={pathname === item.path || pathname.startsWith(`${item.path}/`)}
                    onClick={onItemClick}
                  />
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </Scrollbar>

      {slots?.bottomArea}
    </>
  );
}

function NavLink({
  item,
  active,
  onClick,
}: {
  item: NavItem;
  active: boolean;
  onClick?: () => void;
}) {
  return (
    <ListItem disableGutters disablePadding>
      <ListItemButton
        disableGutters
        component={RouterLink}
        href={item.path}
        onClick={onClick}
        aria-current={active ? 'page' : undefined}
        sx={[
          (theme) => ({
            pl: 1.5,
            py: 0.75,
            gap: 1.5,
            pr: 1,
            borderRadius: 0.75,
            typography: 'body2',
            fontWeight: 'fontWeightMedium',
            color: theme.vars.palette.text.secondary,
            minHeight: 40,
            ...(active && {
              fontWeight: 'fontWeightSemiBold',
              color: theme.vars.palette.primary.main,
              bgcolor: varAlpha(theme.vars.palette.primary.mainChannel, 0.08),
              '&:hover': {
                bgcolor: varAlpha(theme.vars.palette.primary.mainChannel, 0.16),
              },
            }),
          }),
        ]}
      >
        <Box component="span" sx={{ width: 22, height: 22, display: 'inline-flex' }}>
          {item.icon}
        </Box>
        <Box component="span" sx={{ flexGrow: 1 }}>
          {item.title}
        </Box>
      </ListItemButton>
    </ListItem>
  );
}
