'use server';

import { authActionClient } from '@/lib/action';
import { createProject } from './logic';
import { createProjectSchema } from './schema';
import { revalidatePath } from 'next/cache';
import { error, errorFromException, ErrorCodes } from '@/lib/result';
import { toast } from '@/components/ui/sonner';

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

      toast.error(result.error);
      return error(result.error, ErrorCodes.BAD_REQUEST);
    } catch (err) {
      console.error('Project creation error:', err, { userId });
      toast.error('Failed to create project. Please try again.');
      return errorFromException(err);
    }
  });
