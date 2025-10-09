'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { LogOut, User } from 'lucide-react';
import { useAction } from 'next-safe-action/hooks';
import { signoutAction } from '@/actions/auth/signout/action';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

export function Header() {
  const router = useRouter();
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

      const errorMessage = serverError ?? formErrors ?? fieldErrorMessage ?? thrownError?.message ?? 'An unknown error occurred';
      toast.error(errorMessage);
    }
  });

  const handleSignout = () => {
    execute();
  };

  return (
    <header className='flex justify-between items-center p-4 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700'>
      <div>
        <h1 className='text-xl font-semibold text-gray-900 dark:text-white'>Authormaton</h1>
      </div>
      <div className='flex items-center gap-2'>
        <Link href='/profile'>
          <Button
            variant='ghost'
            size='sm'
            className='flex items-center gap-2'
          >
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
    </header>
  );
}
