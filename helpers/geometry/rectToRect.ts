/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { Matrix, Rect } from './types';

/**
 * The translation and scale that put one rectangle exactly on another, for animating or fitting
 * between two boxes. An axis where `from` has no extent is only translated (scale `1`).
 *
 * @param from - The rectangle to move
 * @param to - The rectangle to reach
 * @returns The matrix that maps `from` onto `to`
 * @example
 * rectToRect({ x: 0, y: 0, width: 10, height: 10 }, { x: 5, y: 5, width: 20, height: 10 })
 * // => { a: 2, b: 0, c: 0, d: 1, e: 5, f: 5 }
 * @since next
 */
export function rectToRect(from: Rect, to: Rect): Matrix {
  const a = from.width === 0 ? 1 : to.width / from.width;
  const d = from.height === 0 ? 1 : to.height / from.height;
  return { a, b: 0, c: 0, d, e: to.x - from.x * a, f: to.y - from.y * d };
}
