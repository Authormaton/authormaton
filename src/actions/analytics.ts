'use server';

import { prisma } from '@/lib/prisma';
import { protectedAction } from '@/lib/action';
import { ProjectStatus } from '@prisma/client';

export const getProjectAnalytics = protectedAction(async () => {
  const totalProjects = await prisma.project.count();

  const projectsByStatus = await prisma.project.groupBy({
    by: ['status'],
    _count: {
      status: true
    }
  });

  const projectsByCreationMonth = await prisma.project.groupBy({
    by: ['createdAt'],
    _count: {
      createdAt: true
    },
    orderBy: {
      createdAt: 'asc'
    }
  });

  const formattedProjectsByStatus = Object.values(ProjectStatus).map((status) => ({
    name: status,
    value: projectsByStatus.find((item) => item.status === status)?._count.status || 0
  }));

  const formattedProjectsByCreationMonth = projectsByCreationMonth.map((item) => ({
    name: new Date(item.createdAt).toLocaleString('default', { month: 'short', year: 'numeric' }),
    value: item._count.createdAt
  }));

  return {
    totalProjects,
    projectsByStatus: formattedProjectsByStatus,
    projectsByCreationMonth: formattedProjectsByCreationMonth
  };
});
