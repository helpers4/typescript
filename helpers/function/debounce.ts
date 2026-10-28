/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { onAbort } from '../_shared/_onAbort.js';
import type { AbortSignalLike } from '../type/AbortSignalLike';

/**
 * Options for {@link debounce}.
 * @since 3.1.6
 */
export interface DebounceOptions {
  /** Drops the pending call when aborted; later calls are ignored. */
  signal?: AbortSignalLike;
}

/**
 * A function returned by {@link debounce}.
 * @since 3.1.6
 */
export interface Debounced<A extends unknown[]> {
  (...args: A): void;
  /** Drops the pending call, if any. The function can still be called afterwards. */
  cancel(): void;
}

/**
 * Creates a debounced function that delays invoking func until after delay milliseconds have elapsed since the last time the debounced function was invoked
 *
 * Call `cancel()`, or abort the `signal`, on teardown: otherwise the pending call still runs
 * after its owner is gone.
 * @param func - The function to debounce
 * @param delay - The number of milliseconds to delay
 * @param options - Cancellation — see {@link DebounceOptions}
 * @returns The debounced function, with a `cancel()` method
 * @example
 * const save = debounce(() => store(form), 300, { signal: controller.signal });
 * input.addEventListener('input', save);
 * // controller.abort() drops a save still waiting
 * @since 1.9.0
 */
export function debounce<A extends unknown[], R>(
  func: (...args: A) => R,
  delay: number,
  options: DebounceOptions = {},
): Debounced<A> {
  const { signal } = options;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  function cancel(): void {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  }

  onAbort(signal, cancel);

  return Object.assign(
    (...args: A) => {
      if (signal?.aborted) return;
      cancel();
      timeoutId = setTimeout(() => {
        timeoutId = null;
        func(...args);
      }, delay);
    },
    { cancel },
  );
}
