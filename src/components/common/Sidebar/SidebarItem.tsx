'use client';

import { SidebarMenuButton, useSidebar } from '@/components/ui/sidebar';

import { SidebarMenuItem } from '@/components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

import { LayoutDashboard, LucideIcon } from 'lucide-react';
import { FaProjectDiagram } from 'react-icons/fa';
import { IconType } from 'react-icons/lib';

export type SidebarPathInfo = {
  icon: LucideIcon | IconType;
  title: string;
  hide?: boolean;
};

export const PathInfoRecord: Record<string, SidebarPathInfo> = {
  '/': {
    icon: LayoutDashboard,
    title: 'Dashboard'
  },
  '/projects': {
    icon: FaProjectDiagram,
    title: 'Projects'
  }
};

export function SidebarItem({ path, title }: { path: string; title: string }) {
  const Icon = PathInfoRecord[path as keyof typeof PathInfoRecord].icon;
  const pathname = usePathname();
  const isActive = pathname === path || (path !== '/' && pathname.startsWith(`/${path.split('/')[1]}`));
  const { open } = useSidebar();

  return (
    <SidebarMenuItem key={title} className={cn(isActive && 'bg-gray-100 rounded-sm dark:bg-black')}>
      <SidebarMenuButton asChild>
        <a href={path}>
          {!open ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Icon />
              </TooltipTrigger>
              <TooltipContent side='right' align='center'>
                {title}
              </TooltipContent>
            </Tooltip>
          ) : (
            <>
              <Icon />
              <span>{title}</span>
            </>
          )}
        </a>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
