/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Generates an array of sequential numbers from start to end (exclusive).
 * If only one argument is provided, it generates numbers from 0 to that value.
 * @param startOrEnd - The start value (if end is provided) or end value (if end is omitted)
 * @param end - The end value (exclusive)
 * @param step - The increment between values (default: 1 or -1 depending on direction)
 * @returns An array of sequential numbers
 * @example
 * range(5)
 * // => [0, 1, 2, 3, 4]
 * @example
 * range(1, 5)
 * // => [1, 2, 3, 4]
 * @example
 * range(0, 10, 2)
 * // => [0, 2, 4, 6, 8]
 * @example
 * range(5, 0)
 * // => [5, 4, 3, 2, 1]
 * @since 2.0.0
 */
export function range(
  startOrEnd: number,
  end?: number,
  step?: number,
): number[] {
  let start: number;
  let stop: number;

  if (end === undefined) {
    start = 0;
    stop = startOrEnd;
  } else {
    start = startOrEnd;
    stop = end;
  }

  const direction = stop >= start ? 1 : -1;
  const increment = step ?? direction;

  if (increment === 0) return [];
  if (increment > 0 && start >= stop) return [];
  if (increment < 0 && start <= stop) return [];

  const result: number[] = [];
  if (increment > 0) {
    for (let i = start; i < stop; i += increment) {
      result.push(i);
    }
  } else {
    for (let i = start; i > stop; i += increment) {
      result.push(i);
    }
  }

  return result;
}
