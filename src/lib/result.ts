/**
 * Universal return type for server actions
 * Provides a consistent structure for success and error responses
 */
export type Result<T> = { success: true; data: T } | { success: false; error: string };

/**
 * Creates a success result with data
 */
export function success<T>(data: T): Result<T> {
  return {
    data,
    success: true
  };
}

/**
 * Creates an error result with error message
 */
export function error<T>(message: string): Result<T> {
  return {
    success: false,
    error: message
  };
}
