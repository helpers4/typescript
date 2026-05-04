/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/** Callback registered via the `defer` function. Receives the error if the main work threw. */
export type DeferCallback = (error?: unknown) => void | Promise<void>;

/**
 * Runs an async function and guarantees that all deferred callbacks are
 * executed afterwards, in LIFO order (last registered = first executed),
 * regardless of whether the main work succeeds or throws.
 *
 * Inspired by Radashi's `defer`. Useful for resource cleanup, temporary file
 * removal, or any "undo" logic that must run even on failure.
 *
 * @param fn - An async function that receives a `defer` registration function.
 * @returns The resolved value of `fn`.
 * @throws Re-throws any error from `fn` after running all callbacks.
 * @example
 * const result = await defer(async (d) => {
 *   d(() => console.log('cleanup 1'));
 *   d(() => console.log('cleanup 2'));
 *   return 42;
 * });
 * // logs: 'cleanup 2', 'cleanup 1'
 * // result === 42
 * @example
 * // Cleanup runs even when the main work throws
 * await defer(async (d) => {
 *   d(() => releaseLock());
 *   throw new Error('oops');
 * }).catch(() => {});
 * // releaseLock() is still called
 * @since next
 */
export async function defer<T>(
  fn: (defer: (callback: DeferCallback) => void) => Promise<T>,
): Promise<T> {
  const callbacks: DeferCallback[] = [];
  const addDefer = (cb: DeferCallback): void => {
    callbacks.push(cb);
  };

  let result: T;
  let caughtError: unknown;
  let threw = false;

  try {
    result = await fn(addDefer);
  } catch (err) {
    caughtError = err;
    threw = true;
  }

  for (let i = callbacks.length - 1; i >= 0; i--) {
    // Sequential LIFO execution is intentional: each cleanup awaits the previous
    // eslint-disable-next-line no-await-in-loop
    await callbacks[i]!(threw ? caughtError : undefined);
  }

  if (threw) throw caughtError;
  return result!;
}
