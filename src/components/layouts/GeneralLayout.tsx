import { AppSidebar } from '@/components/common/Sidebar/AppSidebar';
import { Header } from './Header';
import { useIsMobile } from '@/hooks/use-mobile';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { MenuIcon } from 'lucide-react';

export function GeneralLayout({ children }: { children: React.ReactNode }) {
  const isMobile = useIsMobile();

  return (
    <div className='grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]'>
      {isMobile ? (
        <Sheet>
          <SheetTrigger asChild>
            <Button variant='outline' size='icon' className='fixed left-4 top-4 z-50 md:hidden'>
              <MenuIcon className='h-5 w-5' />
              <span className='sr-only'>Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side='left' className='flex flex-col'>
            <AppSidebar />
          </SheetContent>
        </Sheet>
      ) : (
        <div className='hidden border-r bg-muted/40 md:block'>
          <AppSidebar />
        </div>
      )}
      <div className='flex flex-col'>
        <Header />
        <main className='flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6'>{children}</main>
      </div>
    </div>
  );
}
