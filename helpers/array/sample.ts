/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { shuffle } from './shuffle';

/**
 * Picks one or more random elements from an array.
 * When called without a count, returns a single element or `undefined` if the array is empty.
 * When called with a count, returns an array of up to `count` random elements sampled without replacement.
 * @param array - The source array to pick from
 * @param count - Optional number of elements to pick (without replacement)
 * @returns A single random element (or `undefined`) when no count is given, or an array of random elements when count is given
 * @example
 * sample([1, 2, 3, 4, 5])
 * // => 3 (random element)
 * @example
 * sample([1, 2, 3, 4, 5], 3)
 * // => [2, 5, 1] (3 random elements)
 * @since 2.0.0
 */
export function sample<T>(array: readonly T[] | null | undefined): T | undefined;
export function sample<T>(array: readonly T[] | null | undefined, count: number): T[];
export function sample<T>(array: readonly T[] | null | undefined, count?: number): T | undefined | T[] {
  if (array == null || array.length === 0) {
    return count === undefined ? undefined : [];
  }

  if (count === undefined) {
    return array[Math.floor(Math.random() * array.length)];
  }

  const clamped = Math.max(0, Math.min(count, array.length));
  return shuffle(array).slice(0, clamped);
}
