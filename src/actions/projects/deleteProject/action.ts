'use server';

import { authActionClient } from '@/lib/action';
import { deleteProject } from './logic';
import { deleteProjectSchema } from './schema';
import { prisma } from '@/lib/prisma';

export const deleteProjectAction = authActionClient
  .inputSchema(deleteProjectSchema)
  .metadata({ actionName: 'deleteProject' })
  .action(async ({ parsedInput, ctx }) => {
    const userId = ctx.session.user.id;
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

      throw new Error(deleteProjectResult.error, { cause: { internal: true } });
    } catch (err) {
      const error = err as Error;
      const cause = error.cause as { internal: boolean } | undefined;

      if (cause?.internal) {
        throw new Error(error.message);
      }

      console.error('Project deletion error:', error, { userId });
      throw new Error('Something went wrong');
    }
  });
