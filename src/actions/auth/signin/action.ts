'use server';

import { actionClient } from '@/lib/action';
import { signin } from './logic';
import { signinSchema } from './schema';
import { getSession } from '@/lib/session';

export const signinAction = actionClient
  .inputSchema(signinSchema)
  .metadata({ actionName: 'signin' })
  .action(async ({ parsedInput }) => {
    try {
      const result = await signin(parsedInput);

      if (!result.success) {
        throw new Error(result.error);
      }

      // Set session
      const session = await getSession();
      session.user = { id: result.data.id };
      await session.save();

      return result.data;
    } catch (error) {
      console.error('Signin error:', error);
      throw new Error((error as Error).message, { cause: error });
    }
  });
