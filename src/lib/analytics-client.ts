'use client';

import { AnalyticsEvent, recordAnalyticsEvents } from '@/actions/analytics';

const MAX_QUEUE_SIZE = 1000;
const MAX_RETRY_COUNT = 3;
const DEBOUNCE_DELAY = 1000; // 1 second

interface QueuedEvent {
  event: AnalyticsEvent;
  retryCount: number;
}

let analyticsQueue: QueuedEvent[] = [];
let debounceTimer: NodeJS.Timeout | null = null;

export function recordAnalyticsEvent(name: string, payload?: Record<string, any>) {
  const event: AnalyticsEvent = {
    name,
    payload,
    timestamp: new Date(),
  };
  const queuedEvent: QueuedEvent = {
    event,
    retryCount: 0,
  };

  if (analyticsQueue.length >= MAX_QUEUE_SIZE) {
    const droppedEvent = analyticsQueue.shift(); // Drop the oldest event
    console.warn("Analytics queue full, dropping oldest event:", droppedEvent?.event.name);
  }

  analyticsQueue.push(queuedEvent);

  if (debounceTimer) {
    clearTimeout(debounceTimer);
  }

  debounceTimer = setTimeout(async () => {
    const eventsToSendQueue = analyticsQueue.slice();
    analyticsQueue = [];

    const eventsToRecord = eventsToSendQueue.map(qEvent => qEvent.event);

    try {
      await recordAnalyticsEvents({ events: eventsToRecord });
    } catch (error) {
      console.error("Failed to record analytics events, re-queueing eligible events:", error);
      const reQueueEvents: QueuedEvent[] = [];
      for (const qEvent of eventsToSendQueue) {
        if (qEvent.retryCount < MAX_RETRY_COUNT) {
          reQueueEvents.push({ ...qEvent, retryCount: qEvent.retryCount + 1 });
        } else {
          console.warn("Dropping event due to max retry count:", qEvent.event.name);
        }
      }
      analyticsQueue.unshift(...reQueueEvents);
    }
    debounceTimer = null;
  }, DEBOUNCE_DELAY);
}
