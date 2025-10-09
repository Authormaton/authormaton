/**
 * Universal return type for server actions
 * Provides a consistent structure for success and error responses
 */
export enum ErrorCodes {
  UNKNOWN_ERROR = 'UNKNOWN_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNAUTHORIZED = 'UNAUTHORIZED',
  FORBIDDEN = 'FORBIDDEN',
  NOT_FOUND = 'NOT_FOUND',
  BAD_REQUEST = 'BAD_REQUEST',
  CONFLICT = 'CONFLICT',
  SERVICE_UNAVAILABLE = 'SERVICE_UNAVAILABLE',
  TIMEOUT = 'TIMEOUT',
  NETWORK_ERROR = 'NETWORK_ERROR'
}

export type Result<T> = { success: true; data: T } | { success: false; error: string; errorCode: ErrorCodes };

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
 * Creates an error result with error message and code
 * @param message - The error message
 * @param errorCode - The error code
 * @returns An error result containing the message and code
 */
export function error<T>(message: string, errorCode: ErrorCodes = ErrorCodes.UNKNOWN_ERROR): Result<T> {
  return {
    success: false,
    error: message,
    errorCode
  };
}

/**
 * Maps an exception or error to a Result error type
 * @param err - The error or exception
 * @returns An error result containing the error message and code
 */
export function errorFromException<T>(err: unknown): Result<T> {
  if (err instanceof Error) {
    return error<T>(err.message, ErrorCodes.UNKNOWN_ERROR);
  }
  return error<T>(String(err), ErrorCodes.UNKNOWN_ERROR);
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
