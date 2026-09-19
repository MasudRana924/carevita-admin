import type { ReactNode } from 'react';
import {
  ClipboardList,
  Handshake,
  Hospital,
  LayoutDashboard,
  Scale,
  ScrollText,
  Settings,
  UserRound,
  Users,
  Wallet,
} from 'lucide-react';

export type NavItem = {
  title: string;
  path: string;
  icon: ReactNode;
};

export type NavGroup = {
  subheader: string;
  items: NavItem[];
};

const iconSx = { width: 22, height: 22 };

export const navGroups: NavGroup[] = [
  {
    subheader: 'Main',
    items: [{ title: 'Dashboard', path: '/dashboard', icon: <LayoutDashboard style={iconSx} /> }],
  },
  {
    subheader: 'Management',
    items: [
      { title: 'Users', path: '/users', icon: <Users style={iconSx} /> },
      { title: 'Caregivers', path: '/caregivers', icon: <Handshake style={iconSx} /> },
      { title: 'Hospitals', path: '/hospitals', icon: <Hospital style={iconSx} /> },
      { title: 'Bookings', path: '/bookings', icon: <ClipboardList style={iconSx} /> },
    ],
  },
  {
    subheader: 'Operations',
    items: [
      { title: 'Disputes', path: '/disputes', icon: <Scale style={iconSx} /> },
      { title: 'Withdrawals', path: '/withdrawals', icon: <Wallet style={iconSx} /> },
      { title: 'Audit log', path: '/audit-logs', icon: <ScrollText style={iconSx} /> },
    ],
  },
  {
    subheader: 'System',
    items: [
      { title: 'Admin Profile', path: '/profile', icon: <UserRound style={iconSx} /> },
      { title: 'Settings', path: '/settings', icon: <Settings style={iconSx} /> },
    ],
  },
];
