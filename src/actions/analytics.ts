'use server';

import { authActionClient } from '@/lib/action';
import { prisma } from '@/lib/prisma';
import { ProjectType } from '@/generated/prisma';
import { z } from 'zod';


// Define a type for your analytics event
export type AnalyticsEvent = {
  name: string;
  payload?: Record<string, any>;
  timestamp: Date;
};

// Define Zod schemas for validation
export const analyticsEventSchema = z.object({
  name: z.string(),
  payload: z.record(z.string(), z.any()).optional(),
  timestamp: z.date(),
});

export const analyticsEventsInputSchema = z.object({
  events: z.array(analyticsEventSchema),
});

// Server action to record analytics events
export const recordAnalyticsEvents = authActionClient
  .schema(analyticsEventsInputSchema)
  .action(async ({ parsedInput }) => {
    console.log('Received analytics events:', parsedInput.events);
    // In a real application, you would save these events to a database
    // For now, we'll just log them.
    return { success: true, count: parsedInput.events.length };
  });


export const getProjectAnalytics = authActionClient.action(async () => {
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

