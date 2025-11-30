import { useState, useRef, useEffect, useCallback } from 'react';
import { useLoading } from '@/contexts/LoadingContext';

/**
 * Defines a generic type for a server action.
 * A server action is an asynchronous function that takes an input and returns a promise of an output.
 *
 * @template TInput The type of the input arguments for the server action. Use `void` if no input is required.
 * @template TOutput The type of the output (resolved value) of the server action. Use `void` if no output is returned.
 */
type ServerAction<TInput = void, TOutput = void> = (input: TInput) => Promise<TOutput>;

/**
 * `useAction` is a custom React hook for managing the loading state of an asynchronous server action.
 * It integrates with a global loading context and provides a local loading state.
 *
 * @template TInput The type of the input arguments for the server action. Defaults to `void` if not specified.
 * @template TOutput The type of the output (resolved value) of the server action. Defaults to `void` if not specified.
 * @param {ServerAction<TInput, TOutput>} action The asynchronous server action function to be executed. This can be optional.
 * @returns {{ wrappedAction: (input: TInput) => Promise<TOutput | undefined>, isActionLoading: boolean }}
 * An object containing:
 * - `wrappedAction`: A memoized function that executes the provided `action` and manages loading states.
 *                    It returns a Promise that resolves to the action's output or `undefined` if the action is not provided.
 * - `isActionLoading`: A boolean indicating whether the action is currently in progress.
 *
 * @example
 * // 1. Server action with input and output
 * const createPost = async (data: { title: string, content: string }) => {
 *   // Simulate API call
 *   return new Promise<{ id: string, message: string }>((resolve) => {
 *     setTimeout(() => resolve({ id: '123', message: 'Post created!' }), 1000);
 *   });
 * };
 *
 * // In a component:
 * const { wrappedAction: createPostAction, isActionLoading: isCreatingPost } = useAction(createPost);
 *
 * const handleSubmit = async () => {
 *   const result = await createPostAction({ title: 'My Post', content: 'Hello World' });
 *   console.log(result?.message); // "Post created!"
 * };
 *
 * @example
 * // 2. Server action with no input and no output
 * const clearCache = async () => {
 *   // Simulate API call
 *   return new Promise<void>((resolve) => {
 *     setTimeout(() => resolve(), 500);
 *   });
 * };
 *
 * // In a component:
 * const { wrappedAction: clearCacheAction, isActionLoading: isClearingCache } = useAction(clearCache);
 *
 * const handleClear = async () => {
 *   await clearCacheAction();
 *   console.log('Cache cleared!');
 * };
 *
 * @example
 * // 3. Server action with input but no output
 * const logEvent = async (event: { name: string, data: any }) => {
 *   // Simulate API call
 *   return new Promise<void>((resolve) => {
 *     setTimeout(() => resolve(), 200);
 *   });
 * };
 *
 * // In a component:
 * const { wrappedAction: logEventAction, isActionLoading: isLoggingEvent } = useAction(logEvent);
 *
 * const handleLog = async () => {
 *   await logEventAction({ name: 'UserClicked', data: { button: 'Submit' } });
 *   console.log('Event logged!');
 * };
 */
export function useAction<TInput = void, TOutput = void>(action?: ServerAction<TInput, TOutput>) {
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
  const wrappedAction = useCallback(async (input: TInput): Promise<TOutput | undefined> => {
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
  }, [action, setLoading, setIsActionLoading, mounted]);

  return { wrappedAction, isActionLoading };
}
