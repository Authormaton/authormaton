import { AppSidebar } from '@/components/common/Sidebar/AppSidebar';
import { GeneralLayout } from '@/components/layouts/GeneralLayout';
import { SidebarProvider } from '@/components/ui/sidebar';
import { LoadingProvider } from '@/contexts/LoadingContext';
import React from 'react';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body>
        <SidebarProvider>
          <AppSidebar />
          <main className='w-full'>
            <LoadingProvider>
              <GeneralLayout>{children}</GeneralLayout>
            </LoadingProvider>
          </main>
        </SidebarProvider>
      </body>
    </html>
  );
}
