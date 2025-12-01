'use server';

import { authActionClient } from '@/lib/action';
import { prisma } from '@/lib/prisma';
import { ProjectType } from '@/generated/prisma';


// Define a type for your analytics event
export type AnalyticsEvent = {
  name: string;
  payload?: Record<string, any>;
  timestamp: Date;
};

// Server action to record analytics events
export const recordAnalyticsEvents = authActionClient.action(
  async (events: AnalyticsEvent[]) => {
    console.log('Received analytics events:', events);
    // In a real application, you would save these events to a database
    // For now, we'll just log them.
    return { success: true, count: events.length };
  },
);


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

// Client-side debounced function for recording analytics events
// This needs to be outside the 'use server' block to run on the client
let analyticsQueue: AnalyticsEvent[] = [];
let debounceTimer: NodeJS.Timeout | null = null;
const DEBOUNCE_DELAY = 1000; // 1 second

export function recordAnalyticsEvent(name: string, payload?: Record<string, any>) {
  const event: AnalyticsEvent = {
    name,
    payload,
    timestamp: new Date(),
  };
  analyticsQueue.push(event);

  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = setTimeout(async () => {
    // Send the accumulated events to the server action
    const eventsToSend = analyticsQueue.slice();
    analyticsQueue = []; // Clear the queue immediately
    try {
      // @ts-ignore
      await recordAnalyticsEvents(eventsToSend);
    } catch (error) {
      console.error("Failed to record analytics events, re-queueing:", error);
      analyticsQueue.unshift(...eventsToSend); // Re-merge events on failure
    }
    debounceTimer = null;
  }, DEBOUNCE_DELAY);
}
