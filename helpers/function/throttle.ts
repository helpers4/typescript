/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { onAbort } from '../_shared/_onAbort.js';
import type { AbortSignalLike } from '../type/AbortSignalLike';

/**
 * Options for {@link throttle}.
 * @since 3.1.6
 */
export interface ThrottleOptions {
  /** Drops the pending trailing call when aborted; later calls are ignored. */
  signal?: AbortSignalLike;
}

/**
 * A function returned by {@link throttle}.
 * @since 3.1.6
 */
export interface Throttled<A extends unknown[]> {
  (...args: A): void;
  /** Drops the pending trailing call, if any, and resets the wait. The function can still be called afterwards. */
  cancel(): void;
}

/**
 * Creates a throttled function that only invokes func at most once per every wait milliseconds
 *
 * Call `cancel()`, or abort the `signal`, on teardown: otherwise the trailing call still runs
 * after its owner is gone.
 * @param func - The function to throttle
 * @param wait - The number of milliseconds to throttle invocations to
 * @param options - Cancellation — see {@link ThrottleOptions}
 * @returns The throttled function, with a `cancel()` method
 * @example
 * const onScroll = throttle(() => updateHeader(), 100, { signal: controller.signal });
 * window.addEventListener('scroll', onScroll, { signal: controller.signal });
 * // controller.abort() removes the listener and drops a trailing call still waiting
 * @since 1.9.0
 */
export function throttle<A extends unknown[], R>(
  func: (...args: A) => R,
  wait: number,
  options: ThrottleOptions = {},
): Throttled<A> {
  const { signal } = options;
  let lastCallTime = 0;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  function cancel(): void {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
    lastCallTime = 0;
  }

  onAbort(signal, cancel);

  return Object.assign((...args: A) => {
    if (signal?.aborted) return;
    const now = Date.now();

    if (now - lastCallTime >= wait) {
      lastCallTime = now;
      func(...args);
    } else if (!timeoutId) {
      timeoutId = setTimeout(() => {
        lastCallTime = Date.now();
        timeoutId = null;
        func(...args);
      }, wait - (now - lastCallTime));
    }
  }, { cancel });
}
