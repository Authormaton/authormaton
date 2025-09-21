export type MaybePromise<T> = T | Promise<T>;

export async function safeAwait<T>(
  promise: Promise<T>,
  options?: { onSuccess?: (response: T) => MaybePromise<void>; onError?: (error: Error) => MaybePromise<void> }
): Promise<[error: Error] | [error: null, data: T]> {
  try {
    const response = await promise;
    await options?.onSuccess?.(response);
    return [null, response];
  } catch (error) {
    await options?.onError?.(error as Error);
    return [error as Error];
  }
}

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
