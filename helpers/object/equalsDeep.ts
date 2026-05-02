/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { diff } from './diff';

/**
 * Recursive structural object equality.
 *
 * Boolean wrapper around {@link diff} \u2014 returns `true` when the two values
 * are deeply equal according to the same rules. Use this when you only
 * need a yes/no answer; use {@link diff} when you also need to know
 * *what* differs.
 *
 * For a one-level boolean check use {@link equalsShallow}.
 *
 * @param objA - First value (object, `null`, or `undefined`).
 * @param objB - Second value (object, `null`, or `undefined`).
 * @returns `true` if both inputs are deeply equal, `false` otherwise.
 * @since 2.0.0
 */
export function equalsDeep(
  objA: object | undefined | null,
  objB: object | undefined | null,
): boolean {
  return diff(objA, objB) === true;
}
