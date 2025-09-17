'use server';

import { authActionClient } from '@/lib/action';
import { createProject } from './logic';
import { createProjectSchema } from './schema';

export const createProjectAction = authActionClient
  .inputSchema(createProjectSchema)
  .metadata({ actionName: 'createProject' })
  .action(async ({ parsedInput, ctx }) => {
    const userId = ctx.user.id;
    try {
      const createdProjectResult = await createProject(parsedInput, userId);

      if (createdProjectResult.success) {
        return createdProjectResult.data;
      }

      throw new Error(createdProjectResult.error);
    } catch (error) {
      console.error('Project creation error:', error, { userId });
      throw new Error('Something went wrong', { cause: error });
    }
  });
