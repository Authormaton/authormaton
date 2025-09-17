'use server';

import { actionClient } from '@/lib/action';
import { signup } from './logic';
import { signupSchema } from './schema';
import { getSession } from '@/lib/session';

export const signupAction = actionClient
  .inputSchema(signupSchema)
  .metadata({ actionName: 'signup' })
  .action(async ({ parsedInput }) => {
    try {
      const result = await signup(parsedInput);

      if (!result.success) {
        throw new Error(result.error);
      }

      // Set session
      const session = await getSession();
      session.user = { id: result.data.id };
      await session.save();

      return result.data;
    } catch (error) {
      console.error('Signup error:', error);
      throw new Error('Something went wrong', { cause: error });
    }
  });
