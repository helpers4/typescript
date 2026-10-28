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

/**
 * One command of SVG path data: its letter (uppercase is absolute, lowercase relative to the
 * current point) and its numbers, as written in the `d` attribute.
 *
 * | Letter | Command | Numbers |
 * | --- | --- | --- |
 * | `M` `L` `T` | move, line, smooth quadratic | `x y` |
 * | `H` `V` | horizontal, vertical line | `x` or `y` |
 * | `C` | cubic Bézier | `x1 y1 x2 y2 x y` |
 * | `S` `Q` | smooth cubic, quadratic | `x2 y2 x y` or `x1 y1 x y` |
 * | `A` | elliptical arc | `rx ry rotation large-arc sweep x y` |
 * | `Z` | close the subpath | none |
 * @since next
 */
export interface PathCommand {
  type: string;
  values: number[];
}
