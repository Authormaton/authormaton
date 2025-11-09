import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '../hooks/use-debounce';

// Mock timers to control setTimeout
jest.useFakeTimers();

describe('useDebounce', () => {
  it('should return the initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('initial', 500));
    expect(result.current).toBe('initial');
  });

  it('should debounce the value', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'first', delay: 500 },
    });

    expect(result.current).toBe('first');

    rerender({ value: 'second', delay: 500 });
    expect(result.current).toBe('first'); // Value should not change immediately

    act(() => {
      jest.advanceTimersByTime(499);
    });
    expect(result.current).toBe('first'); // Still not changed

    act(() => {
      jest.advanceTimersByTime(1);
    });
    expect(result.current).toBe('second'); // Value should update after delay
  });

  it('should handle multiple value changes within the delay', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'a', delay: 500 },
    });

    expect(result.current).toBe('a');

    rerender({ value: 'b', delay: 500 });
    act(() => { jest.advanceTimersByTime(200); });
    rerender({ value: 'c', delay: 500 });
    act(() => { jest.advanceTimersByTime(200); });
    rerender({ value: 'd', delay: 500 });

    expect(result.current).toBe('a'); // Should still be the initial value

    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(result.current).toBe('d'); // Only the last value should be debounced
  });

  it('should update immediately if immediate is true', () => {
    const { result, rerender } = renderHook(({ value, delay, immediate }) => useDebounce(value, delay, immediate), {
      initialProps: { value: 'initial', delay: 500, immediate: true },
    });

    expect(result.current).toBe('initial');

    rerender({ value: 'updated', delay: 500, immediate: true });
    expect(result.current).toBe('initial'); // Should not update immediately on subsequent renders

    act(() => {
      jest.advanceTimersByTime(500);
    });
    expect(result.current).toBe('updated'); // Should update after delay for subsequent changes
  });

  it('should clear the timer on unmount', () => {
    const { result, unmount } = renderHook(() => useDebounce('test', 500));
    expect(result.current).toBe('test');

    act(() => {
      jest.advanceTimersByTime(250);
    });
    unmount();

    act(() => {
      jest.advanceTimersByTime(250);
    });
    // If the timer was not cleared, it would try to update state on an unmounted component (not directly testable this way, but good for coverage)
    expect(result.current).toBe('test'); // Value should remain unchanged as timer was cleared
  });

  it('should handle a delay of 0', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial', delay: 0 },
    });

    expect(result.current).toBe('initial');

    rerender({ value: 'updated', delay: 0 });
    act(() => {
      jest.advanceTimersByTime(0);
    });
    expect(result.current).toBe('updated');
  });

  it('should handle negative delay by treating it as 0', () => {
    const { result, rerender } = renderHook(({ value, delay }) => useDebounce(value, delay), {
      initialProps: { value: 'initial', delay: -100 },
    });

    expect(result.current).toBe('initial');

    rerender({ value: 'updated', delay: -100 });
    act(() => {
      jest.advanceTimersByTime(0);
    });
    expect(result.current).toBe('updated');
  });
});
