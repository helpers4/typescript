/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Error thrown when a promise exceeds the specified timeout duration.
 * @since 2.0.0
 */
export class TimeoutError extends Error {
  constructor(ms: number) {
    super(`Operation timed out after ${ms}ms`);
    this.name = 'TimeoutError';
  }
}

/**
 * Wraps a promise to reject with a `TimeoutError` if it does not resolve within the specified duration.
 * @param promise - The promise to wrap
 * @param ms - Timeout duration in milliseconds
 * @returns A promise that rejects with `TimeoutError` if the timeout is exceeded
 * @example
 * await timeout(fetch('/api/data'), 5000)
 * // rejects with TimeoutError if fetch takes longer than 5s
 * @since 2.0.0
 */
export function timeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new TimeoutError(ms)), ms);

    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      },
    );
  });
}
