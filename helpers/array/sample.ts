/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { clamp } from '../number/clamp';
import { shuffle } from './shuffle';

/**
 * Picks one or more random elements from an array.
 * When called without a count, returns a single element or `undefined` if the array is empty.
 * When called with a count, returns an array of up to `count` random elements sampled without replacement.
 * @param array - The source array to pick from
 * @returns A single random element, or `undefined` if the array is empty
 * @example
 * sample([1, 2, 3, 4, 5])
 * // => 3 (random element)
 * @example
 * sample([1, 2, 3, 4, 5], 3)
 * // => [2, 5, 1] (3 random elements)
 * @since 2.0.0
 */
export function sample<T>(array: readonly T[] | null | undefined): T | undefined;
/**
 * Picks up to `count` random elements from an array, sampled without replacement.
 *
 * @param array - The source array to pick from
 * @param count - Number of elements to pick
 * @returns An array of up to `count` random elements
 * @since 2.0.0
 */
export function sample<T>(array: readonly T[] | null | undefined, count: number): T[];
export function sample<T>(array: readonly T[] | null | undefined, count?: number): T | undefined | T[] {
  if (array == null || array.length === 0) {
    return count === undefined ? undefined : [];
  }

  if (count === undefined) {
    return array[Math.floor(Math.random() * array.length)];
  }

  const clamped = clamp(count, 0, array.length);
  return shuffle(array).slice(0, clamped);
}
