/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { get } from './get.js';
import { set } from './set.js';
import type { ContainsUnsafeStringKey, DeepGet, DeepSet, ParsePath } from './_types.js';

/**
 * Updates the value at a path by applying a function to its current value,
 * creating intermediate objects as needed. Equivalent to
 * `set(obj, path, updater(get(obj, path)))` in a single call.
 *
 * Uses the same path syntax and type-inference rules as {@link get} and
 * {@link set} — see those for the full behavior (string vs. `PropertyKey[]`
 * paths, prototype-pollution guarding, etc.).
 *
 * @param obj - The object to mutate
 * @param path - Dot/bracket-notation string literal or explicit `PropertyKey[]`
 * @param updater - Called with the current value (`undefined` if the path is
 *   absent); its return value is written back at the path
 * @returns The mutated object (same reference, narrowed type)
 * @example
 * update({ count: 1 }, 'count', (n) => (n ?? 0) + 1)
 * // => { count: 2 }
 * @example
 * // Missing intermediate objects are created, just like set()
 * update({}, 'stats.hits', (n: number | undefined) => (n ?? 0) + 1)
 * // => { stats: { hits: 1 } }
 * @since 3.0.0
 */
export function update<
  T extends object,
  const P extends string | readonly PropertyKey[],
  V extends DeepGet<T, ParsePath<P>>,
>(
  obj: T,
  path: P,
  updater: (current: DeepGet<T, ParsePath<P>> | undefined) => V,
): string extends P ? T : readonly PropertyKey[] extends P ? T : ContainsUnsafeStringKey<ParsePath<P>> extends true ? T : DeepSet<T, ParsePath<P>, V>;
export function update(
  obj: object,
  path: string | PropertyKey[],
  updater: (current: unknown) => unknown,
): object {
  const current = get(obj, path);
  return set(obj, path, updater(current));
}
