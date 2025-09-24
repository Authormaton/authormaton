'use client';

import { PathInfoRecord, SidebarItem } from '@/components/common/Sidebar/SidebarItem';
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu } from '@/components/ui/sidebar';

export function AppSidebar() {
  return (
    <Sidebar collapsible='icon' className='bg-[hsl(var(--sidebar-background))] text-[hsl(var(--sidebar-foreground))]'>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {Object.entries(PathInfoRecord)
                .map(([path, info]) =>
                  info.hide ? null : <SidebarItem key={info.title} path={path} title={info.title} />
                )
                .filter(Boolean)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
