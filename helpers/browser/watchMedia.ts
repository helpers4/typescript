/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { onAbort } from '../_shared/_onAbort.js';
import type { AbortSignalLike } from '../type/AbortSignalLike';

/**
 * Options for {@link watchMedia}.
 * @since 3.1.6
 */
export interface WatchMediaOptions {
  /** Stops watching when aborted. */
  signal?: AbortSignalLike;
}

/**
 * Calls `listener` each time a CSS media query starts or stops matching.
 *
 * It is not called with the current value: read it with {@link matchesMedia}. Outside a browser
 * (no `matchMedia`), it does nothing and returns a function that does nothing.
 *
 * @param query - A media query, e.g. `'(prefers-reduced-motion: reduce)'`
 * @param listener - Receives whether the query matches after the change
 * @param options - Cancellation — see {@link WatchMediaOptions}
 * @returns A function that stops watching
 * @example
 * const stop = watchMedia('(prefers-color-scheme: dark)', (dark) => setTheme(dark ? 'dark' : 'light'));
 * stop();
 * @since 3.1.5
 */
export function watchMedia(
  query: string,
  listener: (matches: boolean) => void,
  options: WatchMediaOptions = {},
): () => void {
  const { signal } = options;
  if (typeof globalThis.matchMedia !== 'function' || signal?.aborted) return () => {};
  const list = globalThis.matchMedia(query);
  const onChange = (event: MediaQueryListEvent) => listener(event.matches);
  list.addEventListener('change', onChange);
  const stop = (): void => {
    removeListener();
    list.removeEventListener('change', onChange);
  };
  const removeListener = onAbort(signal, stop);
  return stop;
}
