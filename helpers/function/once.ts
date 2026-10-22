/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * A function wrapped with {@link once}, extended with a `reset()` method.
 * Calling `reset()` clears the cached result so the next call re-invokes
 * the original function.
 */
export type OnceFn<A extends unknown[], R> = ((...args: A) => R) & {
  /** Clears the cached result. The next call will re-invoke the original function. */
  reset: () => void;
};

/**
 * Creates a function that is restricted to be called only once.
 * Subsequent calls return the cached result of the first invocation.
 *
 * The returned function exposes a `.reset()` method to clear the cache and
 * allow the original function to be called again.
 *
 * @param fn - The function to wrap
 * @returns A function that invokes `fn` at most once, with a `.reset()` method
 * @example
 * const init = once(() => expensiveSetup());
 * init(); // runs expensiveSetup
 * init(); // returns cached result, expensiveSetup not called again
 *
 * init.reset(); // clear cache
 * init(); // runs expensiveSetup again
 * @since 2.0.0
 */
export function once<A extends unknown[], R>(fn: (...args: A) => R): OnceFn<A, R> {
  let called = false;
  let result: R;

  const wrapped = (...args: A): R => {
    if (!called) {
      result = fn(...args);
      called = true;
    }
    return result;
  };

  wrapped.reset = (): void => {
    called = false;
  };

  return wrapped;
}
