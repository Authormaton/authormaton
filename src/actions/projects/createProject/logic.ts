import 'server-only';

import { prisma } from '@/lib/prisma';
import { Result, success } from '@/lib/result';
import { Project } from '@/generated/prisma';
import { CreateProjectInput } from './schema';

export async function createProject(input: CreateProjectInput, userId: string): Promise<Result<Project>> {
  const { title, type } = input;

  const newProject = await prisma.project.create({
    data: {
      title,
      type,
      userId
    }
  });

  return success(newProject);
}
