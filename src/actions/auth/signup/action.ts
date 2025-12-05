'use server';

import { actionClient } from '@/lib/action';
import { signup } from './logic';
import { signupSchema } from './schema';
import { error, errorFromException, ErrorCodes } from '@/lib/result';
import { toast } from '@/components/ui/sonner';

export const signupAction = actionClient
  .inputSchema(signupSchema)
  .metadata({ actionName: 'signup' })
  .action(async ({ parsedInput }) => {
    try {
      const result = await signup(parsedInput);

      if (result.success) {
        return result.data;
      }

      toast.error('Failed to sign up. Please check your details.');
      return error('Failed to sign up. Please check your details.', ErrorCodes.BAD_REQUEST);
    } catch (err) {
      console.error('Sign up error:', err);
      toast.error('Failed to sign up. Please try again.');
      return errorFromException(err);
    }
  });
