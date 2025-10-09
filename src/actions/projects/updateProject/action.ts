'use server';

import { authActionClient } from '@/lib/action';
import { updateProject } from './logic';
import { updateProjectSchema } from './schema';
import { prisma } from '@/lib/prisma';
import { error, errorFromException, ErrorCodes } from '@/lib/result';
import { toast } from '@/components/ui/sonner';

export const updateProjectAction = authActionClient
  .inputSchema(updateProjectSchema)
  .metadata({ actionName: 'updateProject' })
  .action(async ({ parsedInput, ctx }) => {
    const userId = ctx.session.user.id;

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
        toast.error('Project not found or you do not have permission to update it');
        return error('Project not found or you do not have permission to update it', ErrorCodes.NOT_FOUND);
      }

      const updateProjectResult = await updateProject(parsedInput);

      if (updateProjectResult.success) {
        return updateProjectResult.data;
      }

      toast.error(updateProjectResult.error);
      return error(updateProjectResult.error, ErrorCodes.BAD_REQUEST);
    } catch (err) {
      console.error('Project update error:', err, { userId });
      toast.error('Failed to update project. Please try again.');
      return errorFromException(err);
    }
  });
