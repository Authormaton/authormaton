import { useEffect, useState, useRef } from 'react';

/**
 * `useDebouncedValue` is a custom React hook that debounces a value.
 *
 * @template T The type of the value being debounced.
 * @param {T} value The value to debounce.
 * @param {number} [delay=500] The delay in milliseconds before the debounced value updates. Defaults to 500ms.
 * @returns {T} The debounced value.
 *
 * @example
 * // Debounce a search input value with a 500ms delay
 * const debouncedSearchTerm = useDebouncedValue(searchTerm, 500);
 */
export function useDebouncedValue<T>(value: T, delay: number = 500): T {
  // State to store the debounced value
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
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
