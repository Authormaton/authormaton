'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { LogOut, User, Menu, X } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { signoutAction } from '@/actions/auth/signout/action';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useState, useRef, useEffect } from 'react';

export function Header() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);

  const { execute, isExecuting } = useAction(signoutAction, {
    onSuccess: () => {
      toast.success('Signed out successfully');
      router.push('/signin');
    },
    onError: (error) => {
      const { serverError, validationErrors, thrownError } = error.error;
      const fieldErrors = validationErrors?.fieldErrors;
      const formErrors = validationErrors?.formErrors?.join(', ');
      const fieldErrorMessage = fieldErrors
        ? Object.entries(fieldErrors)
            .map(([key, value]) => `${key}: ${value?.join(', ')}`)
            .join(', ')
        : undefined;

      const errorMessage =
        serverError ?? formErrors ?? fieldErrorMessage ?? thrownError?.message ?? 'An unknown error occurred';
      toast.error(errorMessage);
    }
  });

  const handleSignout = () => {
    execute();
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const prevIsMobileMenuOpenRef = useRef(isMobileMenuOpen);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsMobileMenuOpen(false);
        mobileMenuButtonRef.current?.focus();
      }
    };

    const handleClickOutside = (event: MouseEvent) => {
      if (
        isMobileMenuOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node) &&
        mobileMenuButtonRef.current &&
        !mobileMenuButtonRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    };

    const prevIsMobileMenuOpen = prevIsMobileMenuOpenRef.current;
    prevIsMobileMenuOpenRef.current = isMobileMenuOpen;

    if (isMobileMenuOpen && !prevIsMobileMenuOpen) { // Menu is opening
      document.addEventListener('keydown', handleEscape);
      document.addEventListener('mousedown', handleClickOutside);
      const firstFocusableElement = mobileMenuRef.current?.querySelector(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      ) as HTMLElement;
      if (firstFocusableElement) {
        firstFocusableElement.focus();
      }
    } else if (!isMobileMenuOpen && prevIsMobileMenuOpen) { // Menu is closing
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
      mobileMenuButtonRef.current?.focus();
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMobileMenuOpen]);

  return (
    <header className='relative flex justify-between items-center px-4 py-3 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sm:px-6'>
      <div>
        <h1 className='text-xl font-semibold text-gray-900 dark:text-white'>Authormaton</h1>
      </div>
      <div className='hidden md:flex items-center gap-2'>
        <Link href='/profile'>
          <Button variant='ghost' size='sm' className='flex items-center gap-2'>
            <User size={16} />
            Profile
          </Button>
        </Link>
        <Button
          variant='outline'
          size='sm'
          onClick={handleSignout}
          disabled={isExecuting}
          className='flex items-center gap-2'
        >
          <LogOut size={16} />
          {isExecuting ? 'Signing out...' : 'Sign out'}
        </Button>
      </div>
      <div className='md:hidden'>
        <Button
          variant='ghost'
          size='sm'
          onClick={toggleMobileMenu}
          ref={mobileMenuButtonRef}
          aria-expanded={isMobileMenuOpen}
          aria-label={isMobileMenuOpen ? 'Close menu' : 'Open menu'}
          aria-controls="mobile-menu-panel"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </Button>
      </div>

      {isMobileMenuOpen && (
        <div
          id="mobile-menu-panel"
          ref={mobileMenuRef}
          className='md:hidden absolute top-16 left-0 w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 flex flex-col items-start p-4 space-y-3 z-10'
        >
          <Link href='/profile'>
            <Button variant='ghost' size='sm' className='flex items-center gap-2 w-full justify-start' onClick={() => setIsMobileMenuOpen(false)}>
              <User size={16} />
              Profile
            </Button>
          </Link>
          <Button
            variant='outline'
            size='sm'
            onClick={async () => { setIsMobileMenuOpen(false); await handleSignout(); }}
            disabled={isExecuting}
            className='flex items-center gap-2 w-full justify-start'
          >
            <LogOut size={16} />
            {isExecuting ? 'Signing out...' : 'Sign out'}
          </Button>
        </div>
      )}
    </header>
  );
}
