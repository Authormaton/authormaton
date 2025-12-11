import * as React from 'react';

const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState<boolean>(() => {
    if (typeof window === 'undefined') {
      return false; // Default for SSR
    }
    return window.innerWidth < MOBILE_BREAKPOINT; // Initial value for client
  });

  React.useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const checkIsMobile = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };

    const resizeObserver = new ResizeObserver(() => {
      checkIsMobile();
    });

    resizeObserver.observe(document.body);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return isMobile;
}
