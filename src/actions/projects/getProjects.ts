import { Project, ProjectType } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import { Result, success } from '@/lib/result';

interface GetProjectsParams {
  userId: string;
  search?: string;
  type?: ProjectType;
}

export async function getProjects({ userId, search, type }: GetProjectsParams): Promise<Result<Project[]>> {
  const projects: Project[] = await prisma.project.findMany({
    where: {
      userId,
      ...(search && {
        title: {
          contains: search,
          mode: 'insensitive'
        }
      }),
      ...(type && { type })
    },
    orderBy: { createdAt: 'desc' }
  });
  return success(projects);
}
