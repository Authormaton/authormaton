import { recordAnalyticsEvent, recordAnalyticsEvents, AnalyticsEvent } from '../actions/analytics';

// Mock the server action
jest.mock('../actions/analytics', () => ({
  ...jest.requireActual('../actions/analytics'),
  recordAnalyticsEvents: jest.fn(),
}));

describe('Analytics Event Debouncing', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    (recordAnalyticsEvents as jest.Mock).mockClear();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should debounce multiple quick calls into a single server action call', async () => {
    recordAnalyticsEvent('event1', { id: 1 });
    recordAnalyticsEvent('event2', { id: 2 });
    recordAnalyticsEvent('event3', { id: 3 });

    // Expect server action not to have been called yet
    expect(recordAnalyticsEvents).not.toHaveBeenCalled();

    // Advance timers by less than the debounce delay
    jest.advanceTimersByTime(500);
    expect(recordAnalyticsEvents).not.toHaveBeenCalled();

    // Call again before debounce expires
    recordAnalyticsEvent('event4', { id: 4 });

    // Advance timers past the debounce delay
    jest.advanceTimersByTime(1000);

    // Expect server action to have been called once
    expect(recordAnalyticsEvents).toHaveBeenCalledTimes(1);

    // Get the arguments of the call
    const [eventsSent] = (recordAnalyticsEvents as jest.Mock).mock.calls[0];

    // Expect all events to be present
    expect(eventsSent).toHaveLength(4);
    expect(eventsSent[0].name).toBe('event1');
    expect(eventsSent[1].name).toBe('event2');
    expect(eventsSent[2].name).toBe('event3');
    expect(eventsSent[3].name).toBe('event4');
  });

  it('should send events immediately if no subsequent calls are made within the debounce delay', async () => {
    recordAnalyticsEvent('singleEvent', { data: 'test' });

    expect(recordAnalyticsEvents).not.toHaveBeenCalled();

    // Advance timers past the debounce delay
    jest.advanceTimersByTime(1000);

    expect(recordAnalyticsEvents).toHaveBeenCalledTimes(1);
    const [eventsSent] = (recordAnalyticsEvents as jest.Mock).mock.calls[0];
    expect(eventsSent).toHaveLength(1);
    expect(eventsSent[0].name).toBe('singleEvent');
  });

  it('should not drop events when consecutive calls are made and then the timer expires', async () => {
    recordAnalyticsEvent('firstBatchEvent1');
    recordAnalyticsEvent('firstBatchEvent2');

    jest.advanceTimersByTime(1000);

    expect(recordAnalyticsEvents).toHaveBeenCalledTimes(1);
    const [firstBatch] = (recordAnalyticsEvents as jest.Mock).mock.calls[0];
    expect(firstBatch).toHaveLength(2);

    // Simulate another set of events after the first batch was sent
    recordAnalyticsEvent('secondBatchEvent1');
    recordAnalyticsEvent('secondBatchEvent2');

    jest.advanceTimersByTime(1000);

    expect(recordAnalyticsEvents).toHaveBeenCalledTimes(2);
    const [secondBatch] = (recordAnalyticsEvents as jest.Mock).mock.calls[1];
    expect(secondBatch).toHaveLength(2);
    expect(secondBatch[0].name).toBe('secondBatchEvent1');
    expect(secondBatch[1].name).toBe('secondBatchEvent2');
  });

  it('should clear the queue after sending events', async () => {
    recordAnalyticsEvent('eventA');
    jest.advanceTimersByTime(1000);
    expect(recordAnalyticsEvents).toHaveBeenCalledTimes(1);

    recordAnalyticsEvent('eventB');
    jest.advanceTimersByTime(1000);
    expect(recordAnalyticsEvents).toHaveBeenCalledTimes(2);

    // After the second call, ensure the queue is empty for the next set of events
    recordAnalyticsEvent('eventC');
    jest.advanceTimersByTime(1000);
    expect(recordAnalyticsEvents).toHaveBeenCalledTimes(3);
    const [thirdBatch] = (recordAnalyticsEvents as jest.Mock).mock.calls[2];
    expect(thirdBatch).toHaveLength(1);
    expect(thirdBatch[0].name).toBe('eventC');
  });
});
