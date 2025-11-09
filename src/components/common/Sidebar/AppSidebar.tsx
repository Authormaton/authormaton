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

  return (
    <Sidebar role="navigation" className='flex h-full max-h-screen flex-col gap-2 bg-[hsl(var(--sidebar-background))] text-[hsl(var(--sidebar-foreground))]'>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {Object.entries(PathInfoRecord)
                .filter(([, info]) => !info.hide)
                .map(([path, info], index) => {
                  const isActive = pathname === path || (path !== '/' && pathname.startsWith(`/${path.split('/')[1]}`));
                  return (
                    <SidebarItem
                      key={info.title}
                      path={path}
                      title={info.title}
                      index={index}
                      isActive={isActive}
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
