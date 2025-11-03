'use client';

import React, { useRef, useEffect } from 'react';
import { PathInfoRecord, SidebarItem } from '@/components/common/Sidebar/SidebarItem';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu } from '@/components/ui/sidebar';

export function AppSidebar() {
  const sidebarMenuRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<HTMLLIElement[]>([]);

  useEffect(() => {
    itemRefs.current = itemRefs.current.slice(0, Object.entries(PathInfoRecord).filter(([, info]) => !info.hide).length);
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const focusableItems = itemRefs.current.filter(Boolean);
    const currentFocusedIndex = focusableItems.findIndex(item => item === document.activeElement);

    if (event.key === 'ArrowDown') {
      event.preventDefault();
      const nextIndex = (currentFocusedIndex + 1) % focusableItems.length;
      focusableItems[nextIndex]?.focus();
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      const prevIndex = (currentFocusedIndex - 1 + focusableItems.length) % focusableItems.length;
      focusableItems[prevIndex]?.focus();
    } else if (event.key === 'Enter') {
      if (currentFocusedIndex !== -1) {
        event.preventDefault();
        const focusedItem = focusableItems[currentFocusedIndex];
        const link = focusedItem?.querySelector('a');
        link?.click();
      }
    }
  };

  return (
    <Sidebar className='flex h-full max-h-screen flex-col gap-2 bg-[hsl(var(--sidebar-background))] text-[hsl(var(--sidebar-foreground))]'>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu ref={sidebarMenuRef} onKeyDown={handleKeyDown} role="menu">
              {Object.entries(PathInfoRecord)
                .filter(([, info]) => !info.hide)
                .map(([path, info], index) => (
                  <SidebarItem
                    key={info.title}
                    path={path}
                    title={info.title}
                    ref={el => (itemRefs.current[index] = el as HTMLLIElement)}
                  />
                ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
