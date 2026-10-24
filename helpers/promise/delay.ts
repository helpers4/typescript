/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { onAbort } from '../_shared/_onAbort.js';

/**
 * Options for {@link delay}.
 * @since next
 */
export interface DelayOptions {
  /** Clears the timer and rejects with the signal's reason when aborted. */
  signal?: AbortSignal;
}

/**
 * Creates a promise that resolves after specified delay
 * @param ms - Milliseconds to delay
 * @param value - Optional value to resolve with
 * @param options - Cancellation — see {@link DelayOptions}
 * @returns Promise that resolves after delay, or rejects with the signal's reason if aborted first
 * @example
 * await delay(100)
 * @example
 * // Stop waiting, and clear the timer, on teardown
 * const controller = new AbortController();
 * delay(5000, undefined, { signal: controller.signal }).then(refresh, () => {});
 * controller.abort();
 * @since 1.9.0
 */
export function delay<T = void>(ms: number, value?: T, options: DelayOptions = {}): Promise<T> {
  const { signal } = options;
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(signal.reason);
      return;
    }
    const timer = setTimeout(() => {
      removeListener();
      resolve(value as T);
    }, ms);
    const removeListener = onAbort(signal, (reason) => {
      clearTimeout(timer);
      reject(reason);
    });
  });
}
