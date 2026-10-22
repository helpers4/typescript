/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { Matrix, Size } from './types';

/**
 * How {@link fit} sizes content in a box, as CSS `object-fit`:
 * - `'contain'`: as large as possible while staying entirely inside (bands remain on two sides);
 * - `'cover'`: as small as possible while covering the whole box (it overflows on two sides);
 * - `'fill'`: stretched to the box on each axis, proportions not kept;
 * - `'none'`: not scaled;
 * - `'scale-down'`: like `'contain'`, but never enlarged.
 * @since 3.1.5
 */
export type FitMode = 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';

/**
 * Where {@link fit} places content in the space left over (or overflowing), as CSS
 * `object-position`: `0` is left / top, `0.5` centered, `1` right / bottom.
 * @since 3.1.5
 */
export interface FitAlign {
  /** Horizontal position, `0.5` (centered) by default. */
  x?: number;
  /** Vertical position, `0.5` (centered) by default. */
  y?: number;
}

/**
 * Options for {@link fit}.
 * @since 3.1.5
 */
export interface FitOptions {
  /** How to size the content. Defaults to `'contain'`. */
  mode?: FitMode;
  /** Where to place it. Centered by default. */
  align?: FitAlign;
}

/**
 * Places content in a box like CSS `object-fit` and `object-position`, e.g. to show a design
 * frame in a viewport of another size.
 *
 * The result is the matrix from content coordinates to box coordinates: its `a` and `d` are
 * the scales, `e` and `f` the position of the content's top-left corner. Combine it with
 * {@link multiply}, map points with {@link applyToPoint}, or write it with {@link matrixToCss}.
 * Sizes are expected to be positive.
 *
 * @param content - The size of the content
 * @param box - The size of the box
 * @param options - Mode and alignment — see {@link FitOptions}
 * @returns The content-to-box matrix
 * @example
 * fit({ width: 200, height: 100 }, { width: 100, height: 100 })
 * // => { a: 0.5, b: 0, c: 0, d: 0.5, e: 0, f: 25 } (contain, centered)
 * @example
 * fit({ width: 200, height: 100 }, { width: 100, height: 100 }, { mode: 'cover', align: { x: 0 } })
 * // => { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 } (cropped on the right)
 * @since 3.1.5
 */
export function fit(content: Size, box: Size, options: FitOptions = {}): Matrix {
  const { mode = 'contain', align = {} } = options;
  const { x: alignX = 0.5, y: alignY = 0.5 } = align;
  const scaleX = box.width / content.width;
  const scaleY = box.height / content.height;
  let sx: number;
  let sy: number;
  switch (mode) {
    case 'contain':
      sx = sy = Math.min(scaleX, scaleY);
      break;
    case 'cover':
      sx = sy = Math.max(scaleX, scaleY);
      break;
    case 'fill':
      sx = scaleX;
      sy = scaleY;
      break;
    case 'none':
      sx = sy = 1;
      break;
    default:
      sx = sy = Math.min(1, scaleX, scaleY);
      break;
  }
  // `+ 0` turns the -0 of an overflow aligned at 0 into 0.
  return {
    a: sx,
    b: 0,
    c: 0,
    d: sy,
    e: (box.width - content.width * sx) * alignX + 0,
    f: (box.height - content.height * sy) * alignY + 0,
  };
}
