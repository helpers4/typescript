/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * A point in 2D space.
 * @since 3.1.5
 */
export interface Point {
  x: number;
  y: number;
}

/**
 * A width and a height.
 * @since 3.1.5
 */
export interface Size {
  width: number;
  height: number;
}

/**
 * An axis-aligned rectangle: its top-left corner and its size. Width and height are expected to
 * be non-negative.
 * @since 3.1.5
 */
export interface Rect extends Point, Size {}

/**
 * A 2D affine transformation, in the layout of CSS and SVG `matrix(a, b, c, d, e, f)`:
 *
 * ```text
 * x' = a·x + c·y + e
 * y' = b·x + d·y + f
 * ```
 * @since 3.1.5
 */
export interface Matrix {
  a: number;
  b: number;
  c: number;
  d: number;
  e: number;
  f: number;
}
