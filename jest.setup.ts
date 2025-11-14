import '@testing-library/jest-dom';
import { MOBILE_BREAKPOINT } from './src/lib/responsive';

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => {
    const listeners: EventListener[] = [];
    return {
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
  }),
});
