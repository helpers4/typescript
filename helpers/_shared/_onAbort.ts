/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Calls `abort` with the signal's reason once `signal` aborts — at once if it already has.
 *
 * Only reads `aborted`, `reason` and `add`/`removeEventListener`, so it works with any
 * `AbortSignal`, a polyfilled one included, and does nothing without a signal.
 * @param signal - The signal to follow, if any
 * @param abort - Stops the work; called at most once
 * @returns A function that removes the listener, to call once the work ends on its own, so
 *   listeners do not pile up on a long-lived signal
 * @ignore
 */
export function onAbort(signal: AbortSignal | undefined, abort: (reason: unknown) => void): () => void {
  if (!signal) return () => {};
  if (signal.aborted) {
    abort(signal.reason);
    return () => {};
  }
  const listener = (): void => abort(signal.reason);
  signal.addEventListener('abort', listener, { once: true });
  return () => signal.removeEventListener('abort', listener);
}
