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
                        <Button variant='outline' size='icon' className='fixed left-2 top-2 z-50 md:hidden'>
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
        <div className='flex flex-1 flex-col gap-2 px-2 py-2 lg:gap-6 sm:px-4 sm:py-3'>{children}</div>
      </div>
    </div>
  );
}
