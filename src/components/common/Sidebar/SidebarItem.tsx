'use client';

import { SidebarMenuButton, useSidebar } from '@/components/ui/sidebar';

import { SidebarMenuItem } from '@/components/ui/sidebar';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

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

import React from 'react';

export const SidebarItem = React.forwardRef<
  HTMLLIElement,
  { path: string; title: string; index: number; isActive: boolean; isFocusable: boolean; refCallback: (el: HTMLLIElement) => void }
>(
  ({ path, title, index, isActive, isFocusable, refCallback }, ref) => {
    const Icon = PathInfoRecord[path as keyof typeof PathInfoRecord].icon;
    const { open } = useSidebar();
    const tabIndex = isFocusable ? 0 : -1;

    return (
      <SidebarMenuItem
        ref={el => refCallback(el as HTMLLIElement)}
        key={title}
        className={cn(isActive && 'bg-gray-100 rounded-sm dark:bg-black')}
        tabIndex={tabIndex}
        role="menuitem"
        aria-current={isActive ? "page" : undefined}
      >
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
