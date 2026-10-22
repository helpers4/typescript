/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Result tuple representing either a successful value or an error.
 * On success: `[undefined, T]`. On error: `[Error, undefined]`.
 */
export type Result<T> = [error: undefined, value: T] | [error: Error, value: undefined];

/**
 * Wraps a function so it never throws. Instead, it returns a `[error, result]` tuple.
 * Useful for avoiding try/catch blocks and handling errors in a functional style.
 * @param fn - The function to wrap (sync or async)
 * @returns A new function that returns a `Result` tuple
 * @example
 * const safeParse = tryit(JSON.parse);
 * const [error, data] = safeParse('{"a":1}');
 * // error === undefined, data === { a: 1 }
 * @example
 * const [error, data] = safeParse('invalid');
 * // error instanceof SyntaxError, data === undefined
 * @since 2.0.0
 */
export function tryit<TArgs extends readonly unknown[], TReturn>(
  fn: (...args: TArgs) => TReturn,
): (...args: TArgs) => TReturn extends Promise<infer U> ? Promise<Result<U>> : Result<TReturn> {
  return ((...args: TArgs) => {
    try {
      const result = fn(...args);
      if (result instanceof Promise) {
        return result.then(
          (value) => [undefined, value] as Result<unknown>,
          (error) => [error instanceof Error ? error : new Error(String(error)), undefined] as Result<never>,
        );
      }
      return [undefined, result];
    } catch (error) {
      return [error instanceof Error ? error : new Error(String(error)), undefined];
    }
  }) as (...args: TArgs) => TReturn extends Promise<infer U> ? Promise<Result<U>> : Result<TReturn>;
}
