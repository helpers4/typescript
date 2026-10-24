/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { onAbort } from '../_shared/_onAbort.js';

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
 * Options for {@link timeout}.
 * @since 3.1.6
 */
export interface TimeoutOptions {
  /** Clears the timer and rejects with the signal's reason when aborted, without waiting for `promise`. */
  signal?: AbortSignal;
}

/**
 * Wraps a promise to reject with a `TimeoutError` if it does not resolve within the specified duration.
 *
 * The timer is cleared as soon as `promise` settles. If it may never settle, pass a `signal` so
 * the timer can be cleared on teardown too.
 *
 * @param promise - The promise to wrap
 * @param ms - Timeout duration in milliseconds
 * @param options - Cancellation — see {@link TimeoutOptions}
 * @returns A promise that rejects with `TimeoutError` if the timeout is exceeded, or with the
 *   signal's reason if aborted first
 * @example
 * await timeout(fetch('/api/data'), 5000)
 * // rejects with TimeoutError if fetch takes longer than 5s
 * @example
 * await timeout(connect(), 5000, { signal: controller.signal })
 * // controller.abort() clears the timer at once
 * @since 2.0.0
 */
export function timeout<T>(promise: Promise<T>, ms: number, options: TimeoutOptions = {}): Promise<T> {
  const { signal } = options;
  return new Promise<T>((resolve, reject) => {
    if (signal?.aborted) {
      reject(signal.reason);
      return;
    }
    const timer = setTimeout(() => {
      removeListener();
      reject(new TimeoutError(ms));
    }, ms);
    const removeListener = onAbort(signal, (reason) => {
      clearTimeout(timer);
      reject(reason);
    });

    promise.then(
      (value) => {
        clearTimeout(timer);
        removeListener();
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        removeListener();
        reject(error);
      },
    );
  });
}
