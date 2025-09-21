'use server';

import { authActionClient } from '@/lib/action';
import { createProject } from './logic';
import { createProjectSchema } from './schema';
import { revalidatePath } from 'next/cache';

export const createProjectAction = authActionClient
  .inputSchema(createProjectSchema)
  .metadata({ actionName: 'createProject' })
  .action(async ({ parsedInput, ctx }) => {
    const userId = ctx.session.user.id;
    try {
      const result = await createProject(parsedInput, userId);

      if (result.success) {
        revalidatePath('/projects');
        return result.data;
      }

      throw new Error(result.error, { cause: { internal: true } });
    } catch (err) {
      const error = err as Error;
      const cause = error.cause as { internal: boolean } | undefined;

      if (cause?.internal) {
        throw new Error(error.message);
      }

      console.error('Project creation error:', error, { userId });
      throw new Error('Something went wrong');
    }
  });
