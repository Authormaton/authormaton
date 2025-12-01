'use client';

import { AnalyticsEvent, recordAnalyticsEvents } from '@/actions/analytics';

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
      await recordAnalyticsEvents({ events: eventsToSend });
    } catch (error) {
      console.error("Failed to record analytics events, re-queueing:", error);
      analyticsQueue.unshift(...eventsToSend); // Re-merge events on failure
    }
    debounceTimer = null;
  }, DEBOUNCE_DELAY);
}
