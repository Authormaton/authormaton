'use client';

import React, { useRef, useState } from 'react';
import { usePathname } from 'next/navigation';
import { PathInfoRecord, SidebarItem } from '@/components/common/Sidebar/SidebarItem';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu } from '@/components/ui/sidebar';

export function AppSidebar() {
  const itemRefs = useRef<HTMLLIElement[]>([]);
  const pathname = usePathname();

  const initialFocusIndex = Object.entries(PathInfoRecord)
    .filter(([, info]) => !info.hide)
    .findIndex(([path]) => pathname === path || (path !== '/' && pathname.startsWith(`/${path.split('/')[1]}`)));

  const [focusIndex, setFocusIndex] = useState<number>(initialFocusIndex !== -1 ? initialFocusIndex : 0);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const focusableItems = itemRefs.current.filter(Boolean);
    if (focusableItems.length === 0) return;

    let newIndex = focusIndex;

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      newIndex = (focusIndex + 1) % focusableItems.length;
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      newIndex = (focusIndex - 1 + focusableItems.length) % focusableItems.length;
    } else if (event.key === 'Home') {
      event.preventDefault();
      newIndex = 0;
    } else if (event.key === 'End') {
      event.preventDefault();
      newIndex = focusableItems.length - 1;
    } else if (event.key === 'Enter' || event.key === ' ') {
      if (focusIndex !== -1) {
        event.preventDefault();
        const focusedItem = focusableItems[focusIndex];
        const link = focusedItem?.querySelector('a');
        link?.click();
      }
    }

    if (newIndex !== focusIndex) {
      setFocusIndex(newIndex);
      focusableItems[newIndex]?.focus();
    }
  };

  return (
    <Sidebar className='flex h-full max-h-screen flex-col gap-2 bg-[hsl(var(--sidebar-background))] text-[hsl(var(--sidebar-foreground))]'>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu onKeyDown={handleKeyDown} role="menu">
              {Object.entries(PathInfoRecord)
                .filter(([, info]) => !info.hide)
                .map(([path, info], index) => {
                  const pathname = usePathname(); // Get pathname inside the map
                  const isActive = pathname === path || (path !== '/' && pathname.startsWith(`/${path.split('/')[1]}`));
                  return (
                    <SidebarItem
                      key={info.title}
                      path={path}
                      title={info.title}
                      index={index}
                      isActive={isActive}
                      isFocusable={index === focusIndex}
                      refCallback={(el) => (itemRefs.current[index] = el as HTMLLIElement)}
                    />
                  );
                })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
