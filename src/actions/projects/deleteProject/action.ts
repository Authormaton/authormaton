'use server';

import { authActionClient } from '@/lib/action';
import { deleteProject } from './logic';
import { deleteProjectSchema } from './schema';
import { prisma } from '@/lib/prisma';

export const deleteProjectAction = authActionClient
  .inputSchema(deleteProjectSchema)
  .metadata({ actionName: 'deleteProject' })
  .action(async ({ parsedInput, ctx }) => {
    const userId = ctx.user.id;
    try {
      const existingProject = await prisma.project.findFirst({
        where: {
          id: parsedInput.id,
          userId
        },
        select: {
          id: true
        }
      });

      if (!existingProject) {
        throw new Error('Project not found or you do not have permission to delete it');
      }

      const deleteProjectResult = await deleteProject(parsedInput);

      if (deleteProjectResult.success) {
        return deleteProjectResult.data;
      }

      throw new Error(deleteProjectResult.error);
    } catch (error) {
      console.error('Project deletion error:', error, { userId });
      throw new Error((error as Error).message, { cause: error });
    }
  });
