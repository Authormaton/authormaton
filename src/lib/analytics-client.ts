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
let debounceTimer: ReturnType<typeof setTimeout> | null = null;

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

  const eventString = JSON.stringify({ name, payload });

  // Check if an identical event (name and payload) is already in the queue
  const isDuplicate = analyticsQueue.some(queuedEvent => {
    const existingEventString = JSON.stringify({ name: queuedEvent.event.name, payload: queuedEvent.event.payload });
    return existingEventString === eventString;
  });

  if (isDuplicate) {
    console.warn("Duplicate analytics event detected and prevented:", name, payload);
    return;
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
      while (analyticsQueue.length > MAX_QUEUE_SIZE) {
        const droppedEvent = analyticsQueue.shift();
        console.warn("Analytics queue full after retry, dropping oldest event:", droppedEvent?.event.name);
      }
    }
    debounceTimer = null;
  }, DEBOUNCE_DELAY);
}
