'use server';

import { authActionClient } from '@/lib/action';
import { deleteProject } from './logic';
import { deleteProjectSchema } from './schema';
import { prisma } from '@/lib/prisma';
import { error, errorFromException, ErrorCodes } from '@/lib/result';
import { toast } from '@/components/ui/sonner';

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
        toast.error('Project not found or you do not have permission to delete it');
        return error('Project not found or you do not have permission to delete it', ErrorCodes.NOT_FOUND);
      }

      const deleteProjectResult = await deleteProject(parsedInput);

      if (deleteProjectResult.success) {
        return deleteProjectResult.data;
      }

      toast.error(deleteProjectResult.error);
      return error(deleteProjectResult.error, ErrorCodes.BAD_REQUEST);
    } catch (err) {
      console.error('Project deletion error:', err, { userId });
      toast.error('Failed to delete project. Please try again.');
      return errorFromException(err);
    }
  });
