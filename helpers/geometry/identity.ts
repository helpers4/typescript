/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { Matrix } from './types';

/**
 * The matrix that changes nothing.
 *
 * @returns `{ a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 }`
 * @example
 * applyToPoint(identity(), { x: 3, y: 4 }) // => { x: 3, y: 4 }
 * @since next
 */
export function identity(): Matrix {
  return { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };
}
