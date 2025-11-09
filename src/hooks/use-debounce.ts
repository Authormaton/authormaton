import { useEffect, useState, useRef } from 'react';

/**
 * `useDebounce` is a custom React hook that debounces a value.
 *
 * @template T The type of the value being debounced.
 * @param {T} value The value to debounce.
 * @param {number} [delay=500] The delay in milliseconds before the debounced value updates. Defaults to 500ms.
 * @param {boolean} [immediate=false] If true, the function is called immediately, then debounced. Defaults to false.
 * @returns {T} The debounced value.
 *
 * @example
 * // Debounce a search input value with a 500ms delay
 * const debouncedSearchTerm = useDebounce(searchTerm, 500);
 *
 * @example
 * // Debounce a click handler, firing immediately and then preventing further calls for 1000ms
 * const handleClick = useDebounce(() => console.log('Clicked!'), 1000, true);
 */
export function useDebounce<T>(value: T, delay: number = 500, immediate: boolean = false): T {
  // State to store the debounced value
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  // Ref to track if it's the initial call when immediate is true
  const initialCall = useRef(true);

  useEffect(() => {
    // If immediate is true and it's the initial render, skip debouncing
    if (immediate && initialCall.current) {
      initialCall.current = false;
      return;
    }

    // Ensure delay is a non-negative number
    const effectiveDelay = Math.max(0, delay);

    // Set a timer to update the debounced value after the specified delay
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, effectiveDelay);

    // Cleanup function: clear the timer if the component unmounts or dependencies change
    return () => {
      clearTimeout(timer);
    };
  }, [value, delay, immediate]); // Re-run effect if value, delay, or immediate changes

  return debouncedValue;
}
