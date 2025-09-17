'use server';

import { authActionClient } from '@/lib/action';
import { createProject } from './logic';
import { createProjectSchema } from './schema';

export const createProjectAction = authActionClient
  .inputSchema(createProjectSchema)
  .metadata({ actionName: 'createProject' })
  .action(async ({ parsedInput, ctx }) => {
    try {
      return await createProject(parsedInput, ctx.user.id);
    } catch (error) {
      console.error('Project creation error:', error);
      throw new Error('Something went wrong', { cause: error });
    }
  });
