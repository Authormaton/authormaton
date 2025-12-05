import { Project, ProjectType } from '@/generated/prisma';
import { prisma } from '@/lib/prisma';
import { Result, success } from '@/lib/result';

interface GetProjectsParams {
  userId: string;
  search?: string;
  type?: ProjectType;
  page?: number;
  perPage?: number;
}

export async function getProjects({ userId, search, type, page = 1, perPage = 10 }: GetProjectsParams): Promise<Result<{ projects: Project[]; total: number }>> {
  const skip = (page - 1) * perPage;
  const whereClause = {
    userId,
    ...(search && {
      title: {
        contains: search,
        mode: 'insensitive'
      }
    }),
    ...(type && { type })
  };

  const [projects, total] = await prisma.$transaction([
    prisma.project.findMany({
      skip,
      take: perPage,
      where: whereClause,
      orderBy: { createdAt: 'desc' }
    }),
    prisma.project.count({ where: whereClause })
  ]);
  return success({ projects, total });
}
