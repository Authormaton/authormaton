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

export async function getProjects({ userId, search, type, page: rawPage, perPage: rawPerPage }: GetProjectsParams): Promise<Result<{ projects: Project[]; total: number }>> {
  const MAX_PER_PAGE = 100;
  const page = Math.max(1, Math.floor(rawPage ?? 1));
  const perPage = Math.min(MAX_PER_PAGE, Math.max(1, Math.floor(rawPerPage ?? 20)));

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

  const [projects, total] = await Promise.all([
    prisma.project.findMany({
      skip,
      take: perPage,
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        title: true,
        createdAt: true,
        updatedAt: true,
        type: true,
        userId: true,
      },
    }),
    prisma.project.count({ where: whereClause })
  ]);
  return success({ projects, total });
}
