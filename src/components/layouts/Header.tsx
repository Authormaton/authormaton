'use client';

import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
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
      const errorMessage = error.error.thrownError?.message ?? error.error.serverError ?? 'Failed to sign out';
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
      <div>
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
