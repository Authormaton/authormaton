import { AppSidebar } from '@/components/common/Sidebar/AppSidebar';
import { SidebarProvider } from '@/components/ui/sidebar';
import React from 'react';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body>
        <SidebarProvider>
          <AppSidebar />
          <main className='w-full'>{children}</main>
        </SidebarProvider>
      </body>
    </html>
  );
}
