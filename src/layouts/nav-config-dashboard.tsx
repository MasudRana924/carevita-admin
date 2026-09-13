import type { ReactNode } from 'react';
import {
  Handshake,
  Hospital,
  LayoutDashboard,
  Settings,
  UserRound,
  Users,
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
