import { renderHook, act } from '@testing-library/react';
import { useIsMobile } from '../hooks/use-mobile';
import { MOBILE_BREAKPOINT } from '../lib/responsive';

describe('useIsMobile', () => {
  const setWindowWidth = (width: number) => {
    Object.defineProperty(window, 'innerWidth', { writable: true, value: width });
    window.dispatchEvent(new Event('resize'));
    // Manually trigger the 'change' event for the mocked matchMedia
    const mqList = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    // @ts-expect-error
    mqList.dispatchEvent(new Event('change'));
  };

  beforeEach(() => {
    // Reset window.innerWidth before each test
    setWindowWidth(1024); // Default to a desktop width
  });

  it('should return true when window width is less than mobile breakpoint', () => {
    setWindowWidth(MOBILE_BREAKPOINT - 1);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(true);
  });

  it('should return false when window width is greater than or equal to mobile breakpoint', () => {
    setWindowWidth(MOBILE_BREAKPOINT);
    const { result } = renderHook(() => useIsMobile());
    expect(result.current).toBe(false);

    setWindowWidth(MOBILE_BREAKPOINT + 1);
    const { result: result2 } = renderHook(() => useIsMobile());
    expect(result2.current).toBe(false);
  });

  it('should update isMobile when window resizes', () => {
    const { result } = renderHook(() => useIsMobile());

    // Initially desktop
    setWindowWidth(1024);
    expect(result.current).toBe(false);

    // Resize to mobile
    act(() => {
      setWindowWidth(MOBILE_BREAKPOINT - 1);
    });
    expect(result.current).toBe(true);

    // Resize back to desktop
    act(() => {
      setWindowWidth(MOBILE_BREAKPOINT);
    });
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
