/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Returns a new array with `item` removed if present, or appended if absent —
 * the common "toggle a selection" pattern.
 *
 * By default, presence is checked with `SameValueZero` equality (like
 * `Array.prototype.includes`). Pass `key` to compare by a derived identity
 * instead — useful for toggling objects by id rather than by reference.
 *
 * @param array - The source array. `null`/`undefined` are treated as empty.
 * @param item - The item to add or remove
 * @param key - Optional function deriving the identity to compare by
 * @returns A new array with `item` toggled
 * @example
 * toggle([1, 2, 3], 2)
 * // => [1, 3]
 * toggle([1, 3], 2)
 * // => [1, 3, 2]
 * @example
 * // Toggle by a derived key instead of reference equality
 * toggle([{ id: 1 }, { id: 2 }], { id: 1 }, (x) => x.id)
 * // => [{ id: 2 }]
 * @since 3.0.0
 */
export function toggle<T>(
  array: readonly T[] | null | undefined,
  item: T,
  key?: (item: T) => unknown,
): T[] {
  const list = array ?? [];
  const identify = key ?? ((value: T) => value);
  const itemKey = identify(item);
  const index = list.findIndex((existing) => identify(existing) === itemKey);

  if (index === -1) return [...list, item];
  return [...list.slice(0, index), ...list.slice(index + 1)];
}
