/**
 * Universal return type for server actions
 * Provides a consistent structure for success and error responses
 */
export type Result<T> = { success: true; data: T } | { success: false; error: string };

/**
 * Creates a success result with data
 * @param data - The data to return in the result
 * @returns A success result containing the data
 */
export function success<T>(data: T): Result<T> {
  return {
    data,
    success: true
  };
}

/**
 * Creates an error result with error message
 * @param message - The error message
 * @returns An error result containing the message
 */
export function error<T>(message: string): Result<T> {
  return {
    success: false,
    error: message
  };
}

/**
 * Maps an exception or error to a Result error type
 * @param err - The error or exception
 * @returns An error result containing the error message
 */
export function errorFromException<T>(err: unknown): Result<T> {
  if (err instanceof Error) {
    return error<T>(err.message);
  }
  return error<T>(String(err));
}

/**
 * Wraps a promise and returns a Result type
 * @param promise - The promise to wrap
 * @returns A promise that resolves to a Result
 */
export async function fromPromise<T>(promise: Promise<T>): Promise<Result<T>> {
  try {
    const data = await promise;
    return success(data);
  } catch (err) {
    return errorFromException<T>(err);
  }
}
