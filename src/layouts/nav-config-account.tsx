import { useAuth } from 'src/contexts/AuthContext';

import { Iconify } from 'src/components/iconify';

import type { AccountPopoverProps } from './components/account-popover';

export const _account: AccountPopoverProps['data'] = [
  {
    label: 'Profile',
    href: '/profile',
    icon: <Iconify width={22} icon="solar:user-bold-duotone" />,
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: <Iconify width={22} icon="solar:lock-password-bold-duotone" />,
  },
];

export function useAccountDisplay() {
  const { user } = useAuth();
  return {
    name: user?.name || 'Admin',
    email: user?.email || user?.phone || '',
    photo: user?.profile_photo,
  };
}
