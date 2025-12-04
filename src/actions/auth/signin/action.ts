'use server';

import { actionClient } from '@/lib/action';
import { signin } from './logic';
import { signinSchema } from './schema';
import { error, errorFromException, ErrorCodes, success } from '@/lib/result';
import { toast } from '@/components/ui/sonner';

export const signinAction = actionClient
  .inputSchema(signinSchema)
  .metadata({ actionName: 'signin' })
  .action(async ({ parsedInput }) => {
    const { email } = parsedInput;

    try {
      const result = await signin(parsedInput);

      if (result.success) {
        return success(result.data);
      }

      toast.error(result.error);
      return error(result.error, ErrorCodes.BAD_REQUEST);
    } catch (err) {
      console.error('Sign in error:', err, { email });
      toast.error('Failed to sign in. Please try again.');
      return errorFromException(err);
    }
  });