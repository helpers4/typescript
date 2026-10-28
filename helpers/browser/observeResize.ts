/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { onAbort } from '../_shared/_onAbort.js';
import type { AbortSignalLike } from '../type/AbortSignalLike';

/**
 * Options for {@link observeResize}.
 * @since 3.1.6
 */
export interface ObserveResizeOptions {
  /** Stops observing when aborted. */
  signal?: AbortSignalLike;
}

/**
 * Calls `callback` each time the size of `element` changes, with a `ResizeObserver` dedicated to
 * it. Like `ResizeObserver` itself, it is also called once soon after it starts observing.
 *
 * To limit how often it runs, wrap the callback with `debounce` or `throttle` from
 * `helpers4/function`. Without `ResizeObserver`, it does nothing and returns a function that
 * does nothing.
 *
 * @param element - The element to observe
 * @param callback - Receives the `ResizeObserverEntry` of `element`
 * @param options - Cancellation — see {@link ObserveResizeOptions}
 * @returns A function that stops observing
 * @example
 * const stop = observeResize(canvas, (entry) => redraw(entry.contentRect));
 * stop();
 * @since 3.1.5
 */
export function observeResize(
  element: Element,
  callback: (entry: ResizeObserverEntry) => void,
  options: ObserveResizeOptions = {},
): () => void {
  const { signal } = options;
  if (typeof globalThis.ResizeObserver !== 'function' || signal?.aborted) return () => {};
  const observer = new globalThis.ResizeObserver((entries) => {
    for (const entry of entries) callback(entry);
  });
  observer.observe(element);
  const stop = (): void => {
    removeListener();
    observer.disconnect();
  };
  const removeListener = onAbort(signal, stop);
  return stop;
}
