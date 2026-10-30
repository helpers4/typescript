/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * What helpers4 needs of an `AbortSignal`: whether it is aborted, why, and a way to listen for
 * the abort. A real `AbortSignal` is assignable to it, and so is an object of your own in a
 * runtime that has no `AbortController` (GJS, embedded engines) or no DOM typings: the type
 * names nothing but itself, so it compiles without the DOM lib.
 *
 * Every `signal` option of the library takes this type.
 *
 * @example
 * // A signal for a runtime without AbortController
 * const listeners = new Set<() => void>();
 * const signal: AbortSignalLike = {
 *   aborted: false,
 *   addEventListener: (_type, listener) => listeners.add(listener),
 *   removeEventListener: (_type, listener) => listeners.delete(listener),
 * };
 * await delay(1000, { signal });
 * @since 3.1.10
 */
export interface AbortSignalLike {
  /** Whether the work is cancelled. */
  readonly aborted: boolean;
  /** Why it was cancelled: the reason a cancelled promise rejects with. */
  readonly reason?: unknown;
  /** Calls `listener` once when the signal aborts. */
  addEventListener(type: 'abort', listener: () => void, options?: { once?: boolean }): void;
  /** Stops calling `listener`. */
  removeEventListener(type: 'abort', listener: () => void): void;
}
