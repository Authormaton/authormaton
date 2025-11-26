import { renderHook, act } from '@testing-library/react';
import { useIsMobile } from '../hooks/use-mobile';

describe('useIsMobile', () => {
  let resizeObserverCb: ResizeObserverCallback;

  class MockResizeObserver {
    constructor(cb: ResizeObserverCallback) {
      resizeObserverCb = cb;
    }
    observe = jest.fn();
    disconnect = jest.fn();
    unobserve = jest.fn();
  }

  beforeAll(() => {
    // @ts-ignore
    global.ResizeObserver = MockResizeObserver;
  });

  const setWindowWidth = (width: number) => {
    Object.defineProperty(window, 'innerWidth', { writable: true, value: width });
    // Manually trigger the ResizeObserver callback
    if (resizeObserverCb) {
      act(() => {
        resizeObserverCb([], {} as ResizeObserver); // Pass empty array and a mock observer
      });
    }
  };

  beforeEach(() => {
    setWindowWidth(1024); // Default to a desktop width
  });

  it('should return true when window width is less than mobile breakpoint', () => {
    setWindowWidth(767);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it('should return false when window width is greater than or equal to mobile breakpoint', () => {
    setWindowWidth(768);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);

    setWindowWidth(769);
    const { result: result2 } = renderHook(() => useIsMobile());
    expect(result2.current).toBe(false);
  });

  it('should update isMobile when window resizes', () => {
    const { result } = renderHook(() => useIsMobile());

    // Initially desktop
    setWindowWidth(1024);
    expect(result.current).toBe(false);

    // Resize to mobile
    setWindowWidth(767);
    expect(result.current).toBe(true);

    // Resize back to desktop
    setWindowWidth(768);
    expect(result.current).toBe(false);
  });

  it('should handle initial render correctly based on window width', () => {
    setWindowWidth(500); // Mobile width
    const { result: mobileResult } = renderHook(() => useIsMobile());
    expect(mobileResult.current).toBe(true);

    setWindowWidth(1200); // Desktop width
    const { result: desktopResult } = renderHook(() => useIsMobile());
    expect(desktopResult.current).toBe(false);
  });
});
