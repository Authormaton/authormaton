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
        return error('Project not found or you do not have permission to update it', ErrorCodes.NOT_FOUND);
      }

      const updateProjectResult = await updateProject(parsedInput);

      if (updateProjectResult.success) {
        return updateProjectResult.data;
      }
      return error(updateProjectResult.error, updateProjectResult.code);
    } catch (err) {
      console.error('Project update error:', err, { userId });
      return errorFromException(err);
    }
