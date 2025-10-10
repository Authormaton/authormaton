'use server';

import { authActionClient } from '@/lib/action';
import { createProject } from './logic';
import { createProjectSchema } from './schema';
import { revalidatePath } from 'next/cache';
import { error, errorFromException, ErrorCodes } from '@/lib/result';
import { projectTemplates } from '@/lib/templates';

export const createProjectAction = authActionClient
  .inputSchema(createProjectSchema)
  .metadata({ actionName: 'createProject' })
  .action(async ({ parsedInput, ctx }) => {
    const userId = ctx.session.user.id;
    const { templateId, ...projectData } = parsedInput;

    let initialContent = '';
    if (templateId) {
      const selectedTemplate = projectTemplates.find(template => template.id === templateId);
      if (selectedTemplate) {
        initialContent = selectedTemplate.content;
      }
    }

    try {
      const result = await createProject({ ...projectData, content: initialContent }, userId);

      if (result.success) {
        revalidatePath('/projects');
        return result.data;
      }

      return error(result.error, ErrorCodes.BAD_REQUEST);
    } catch (err) {
      console.error('Project creation error:', err, { userId });
      return errorFromException(err);
    }
  });
