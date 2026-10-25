/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Shared pieces of the `*.bench.ts` files. Not part of any published package.
 */

/**
 * Run options for `bench.compare()` and `bench().run()`: short enough that the whole suite runs in
 * minutes, long enough for the nanosecond helpers to reach their steady state. The default (500 ms of
 * timed calls per benchmark) lasts several seconds for a helper that runs 30 million times a second.
 */
export const RUN = { time: 100, warmupTime: 20 } as const;

let last: unknown;

/**
 * Keeps the result of a benchmarked call alive, so the engine cannot remove a pure call whose result
 * nothing reads (dead-code elimination), which would measure an empty loop.
 *
 * @param value - The value a benchmarked function returned
 * @returns `value`, unchanged
 */
export function consume<T>(value: T): T {
  last = value;
  return value;
}

/**
 * The last value given to {@link consume}. Reading it is what makes the store observable.
 *
 * @returns The last consumed value
 */
export function lastConsumed(): unknown {
  return last;
}
