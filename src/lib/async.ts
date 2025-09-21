export type MaybePromise<T> = T | Promise<T>;

export async function safeAwait<T>(promise: Promise<T>): Promise<[error: Error] | [error: null, data: T]> {
  try {
    const response = await promise;
    return [null, response];
  } catch (error) {
    return [error as Error];
  }
}

export async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
