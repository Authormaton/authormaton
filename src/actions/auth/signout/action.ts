'use server';

import { authActionClient } from '@/lib/action';
import { signout } from './logic';
import { error, errorFromException, ErrorCodes } from '@/lib/result';
import { toast } from '@/components/ui/sonner';

export const signoutAction = authActionClient.metadata({ actionName: 'signout' }).action(async ({ ctx }) => {
  const userId = ctx.session.user.id;

  try {
    const result = await signout();

    if (result.success) {
      return result.data;
    }

    toast.error(result.error);
    return error(result.error, ErrorCodes.BAD_REQUEST);
  } catch (err) {
    console.error('Sign out error:', err, { userId });
    toast.error('Failed to sign out. Please try again.');
    return errorFromException(err);
  }
});
