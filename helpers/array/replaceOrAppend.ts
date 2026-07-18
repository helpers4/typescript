/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Returns a new array with the first item matching `predicate` replaced by
 * `item` — or `item` appended at the end if no match is found. The common
 * "upsert into a list" pattern.
 *
 * @param array - The source array. `null`/`undefined` are treated as empty.
 * @param item - The replacement (or new) item
 * @param predicate - Called with each existing item to find what to replace
 * @returns A new array with `item` upserted
 * @example
 * replaceOrAppend([{ id: 1, n: 'a' }, { id: 2, n: 'b' }], { id: 1, n: 'A' }, (x) => x.id === 1)
 * // => [{ id: 1, n: 'A' }, { id: 2, n: 'b' }]
 * @example
 * replaceOrAppend([{ id: 1 }], { id: 2 }, (x) => x.id === 2)
 * // => [{ id: 1 }, { id: 2 }]  (no match — appended)
 * @since 4.0.0
 */
export function replaceOrAppend<T>(
  array: readonly T[] | null | undefined,
  item: T,
  predicate: (existing: T) => boolean,
): T[] {
  const list = array ?? [];
  const index = list.findIndex(predicate);

  if (index === -1) return [...list, item];
  return [...list.slice(0, index), item, ...list.slice(index + 1)];
}
