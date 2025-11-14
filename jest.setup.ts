import '@testing-library/jest-dom';
import { MOBILE_BREAKPOINT } from './src/lib/responsive';

interface MediaQueryListMock {
  matches: boolean;
  media: string;
  onchange: ((this: MediaQueryList, ev: MediaQueryListEvent) => void) | null;
  addEventListener: jest.Mock;
  removeEventListener: jest.Mock;
  dispatchEvent: jest.Mock;
}

const matchMediaCache = new Map<string, MediaQueryListMock>();

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => {
    if (matchMediaCache.has(query)) {
      return matchMediaCache.get(query);
    }

    const listeners: EventListener[] = [];
    const mql: MediaQueryListMock = {
      matches: window.innerWidth < MOBILE_BREAKPOINT,
      media: query,
      onchange: null,
      addEventListener: jest.fn((event, callback) => {
        if (event === 'change') {
          listeners.push(callback as EventListener);
        }
      }),
      removeEventListener: jest.fn((event, callback) => {
        if (event === 'change') {
          const index = listeners.indexOf(callback as EventListener);
          if (index > -1) {
            listeners.splice(index, 1);
          }
        }
      }),
      dispatchEvent: jest.fn(event => {
        listeners.forEach(listener => listener(event));
        return true;
      }),
    };
    matchMediaCache.set(query, mql);
    return mql;
  }),
});
