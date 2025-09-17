'use server';

import { authActionClient } from '@/lib/action';
import { updateProject } from './logic';
import { updateProjectSchema } from './schema';

export const updateProjectAction = authActionClient
  .inputSchema(updateProjectSchema)
  .metadata({ actionName: 'updateProject' })
  .action(async ({ parsedInput, ctx }) => {
    try {
      return await updateProject(parsedInput, ctx.user.id);
    } catch (error) {
      throw new Error('Something went wrong', { cause: error });
    }
  });
