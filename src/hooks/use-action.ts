import { useState, useRef, useEffect } from 'react';
import { useLoading } from '@/contexts/LoadingContext';

// Define a generic type for a server action, which takes an input and returns a promise of an output.
type ServerAction<TInput, TOutput> = (input: TInput) => Promise<TOutput>;

/**
 * `useAction` is a custom React hook for managing the loading state of an asynchronous server action.
 * It integrates with a global loading context and provides a local loading state.
 *
 * @template TInput The type of the input arguments for the server action.
 * @template TOutput The type of the output (resolved value) of the server action.
 * @param {ServerAction<TInput, TOutput>} action The asynchronous server action function to be executed.
 * @returns {{ wrappedAction: (input: TInput) => Promise<TOutput | undefined>, isActionLoading: boolean }} 
 * An object containing:
 * - `wrappedAction`: A function that executes the provided `action` and manages loading states.
 * - `isActionLoading`: A boolean indicating whether the action is currently in progress.
 *
 * @example
 * // Define a server action
 * const myServerAction = async (data: { name: string }) => {
 *   // Simulate API call
 *   return new Promise<{ message: string }>((resolve) => {
 *     setTimeout(() => resolve({ message: `Hello, ${data.name}!` }), 1000);
 *   });
 * };
 *
 * // In a component:
 * const { wrappedAction, isActionLoading } = useAction(myServerAction);
 *
 * const handleClick = async () => {
 *   const result = await wrappedAction({ name: 'World' });
 *   console.log(result?.message);
 * };
 */
export function useAction<TInput, TOutput>(action?: ServerAction<TInput, TOutput>) {
  // Local state to track if the specific action is loading
  const [isActionLoading, setIsActionLoading] = useState(false);
  // Access the global loading context setter
  const { setLoading } = useLoading();
  // Ref to track if the component is mounted to prevent state updates on unmounted components
  const mounted = useRef(true);

  useEffect(() => {
    // Set mounted ref to false on unmount
    return () => {
      mounted.current = false;
    };
  }, []);

  // A wrapper function that executes the server action and manages loading states
  const wrappedAction = async (input: TInput): Promise<TOutput | undefined> => {
    // If the action function itself is not provided, log an error and return undefined.
    if (!action) {
      console.error("useAction: The provided action function is undefined.");
      return undefined;
    }

    // Set local and global loading states to true before action execution
    if (mounted.current) {
      setIsActionLoading(true);
      setLoading(true);
    }

    try {
      // Execute the actual server action
      return await action(input);
    } catch (error) {
      // Log any errors that occur during the action execution
      console.error("useAction: Error during action execution:", error);
      throw error; // Re-throw the error to be handled by the caller
    } finally {
      // Ensure loading states are reset after action completion, regardless of success or failure
      if (mounted.current) {
        setIsActionLoading(false);
        setLoading(false);
      }
    }
  };

  return { wrappedAction, isActionLoading };
}
