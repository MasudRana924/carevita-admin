import type { ReactNode } from 'react';

import { Iconify } from 'src/components/iconify';

export type NavItem = {
  title: string;
  path: string;
  icon: ReactNode;
  badge?: 'supportChatUnread' | 'caregiversPendingReview';
};

export type NavGroup = {
  subheader: string;
  items: NavItem[];
};

const icon = (name: string) => <Iconify icon={name} width={22} />;

export const navGroups: NavGroup[] = [
  {
    subheader: 'Main',
    items: [{ title: 'Dashboard', path: '/dashboard', icon: icon('solar:widget-5-bold-duotone') }],
  },
  {
    subheader: 'Management',
    items: [
      { title: 'Users', path: '/users', icon: icon('solar:users-group-rounded-bold-duotone') },
      {
        title: 'Caregivers',
        path: '/caregivers',
        icon: icon('solar:hand-heart-bold-duotone'),
        badge: 'caregiversPendingReview',
      },
      { title: 'Hospitals', path: '/hospitals', icon: icon('solar:hospital-bold-duotone') },
      { title: 'Bookings', path: '/bookings', icon: icon('solar:clipboard-list-bold-duotone') },
    ],
  },
  {
    subheader: 'Operations',
    items: [
      {
        title: 'Support Chat',
        path: '/support-chat',
        icon: icon('solar:chat-round-dots-bold-duotone'),
        badge: 'supportChatUnread',
      },
      { title: 'Disputes', path: '/disputes', icon: icon('solar:scale-bold-duotone') },
      { title: 'Withdrawals', path: '/withdrawals', icon: icon('solar:wallet-money-bold-duotone') },
      { title: 'Safety incidents', path: '/safety-incidents', icon: icon('solar:shield-warning-bold-duotone') },
      { title: 'Audit log', path: '/audit-logs', icon: icon('solar:history-bold-duotone') },
    ],
  },
  {
    subheader: 'System',
    items: [
      { title: 'Privacy policies', path: '/privacy-policies', icon: icon('solar:shield-keyhole-bold-duotone') },
      { title: 'Admin Profile', path: '/profile', icon: icon('solar:user-circle-bold-duotone') },
      { title: 'Settings', path: '/settings', icon: icon('solar:settings-bold-duotone') },
    ],
  },
];
