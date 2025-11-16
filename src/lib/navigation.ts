import { User, LogOut } from 'lucide-react';

export type NavItem = {
  label: string;
  href?: string;
  icon: keyof typeof import('lucide-react');
  type: 'link' | 'button';
};

export const navItems: NavItem[] = [
  {
    label: 'Profile',
    href: '/profile',
    icon: 'User',
    type: 'link',
  },
  {
    label: 'Sign out',
    icon: 'LogOut',
    type: 'button',
  },
];
