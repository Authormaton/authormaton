'use server';

import { authActionClient } from '@/lib/action';
import { updateProject } from './logic';
import { updateProjectSchema } from './schema';
import { prisma } from '@/lib/prisma';

export const updateProjectAction = authActionClient
  .inputSchema(updateProjectSchema)
  .metadata({ actionName: 'updateProject' })
  .action(async ({ parsedInput, ctx }) => {
    const userId = ctx.user.id;

    try {
      // Check if project exists and belongs to the user
      const existingProject = await prisma.project.findFirst({
        where: {
          id: parsedInput.id,
          userId: userId
        },
        select: {
          id: true
        }
      });

      if (!existingProject) {
        throw new Error('Project not found or you do not have permission to delete it');
      }

      const updateProjectResult = await updateProject(parsedInput);

      if (updateProjectResult.success) {
        return updateProjectResult.data;
      }

      throw new Error(updateProjectResult.error);
    } catch (error) {
      console.error('Project update error:', error, { userId });
      throw new Error('Something went wrong', { cause: error });
    }
  });
