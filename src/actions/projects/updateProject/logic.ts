import 'server-only';

import { prisma } from '@/lib/prisma';
import { Result, success } from '@/lib/result';
import { Project } from '@/generated/prisma';
import { UpdateProjectInput } from './schema';

export async function updateProject(input: UpdateProjectInput): Promise<Result<Project>> {
  const { id, title } = input;

  // Update project
  const updatedProject = await prisma.project.update({
    where: { id },
    data: {
      title
    }
  });

  return success(updatedProject);
}
