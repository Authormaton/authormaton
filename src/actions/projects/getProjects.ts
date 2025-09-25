import { Project } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import { Result, success } from '@/lib/result';

export async function getProjects(userId: string): Promise<Result<Project[]>> {
  const projects = await prisma.project.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });
  return success(projects);
}
