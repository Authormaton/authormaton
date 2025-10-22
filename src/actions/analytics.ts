'use server';

import { prisma } from '@/lib/prisma';
import { authActionClient } from '@/lib/action';
import { z } from 'zod';

const getProjectAnalyticsSchema = z.object({});

export const getProjectAnalytics = authActionClient.schema(getProjectAnalyticsSchema).action(async ({ ctx }) => {
  const totalProjects = await prisma.project.count();

  const projectsByType = await prisma.project.groupBy({
    by: ['type'],
    _count: {
      type: true
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

  const formattedProjectsByType = Object.values(ProjectType).map((type) => ({
    name: type,
    value: projectsByType.find((item) => item.type === type)?._count.type || 0
  }));

  const formattedProjectsByCreationMonth = projectsByCreationMonth.map((item) => ({
    name: new Date(item.createdAt).toLocaleString('default', { month: 'short', year: 'numeric' }),
    value: item._count.createdAt
  }));

  return {
    totalProjects,
    projectsByType: formattedProjectsByType,
    projectsByCreationMonth: formattedProjectsByCreationMonth
  };
});
