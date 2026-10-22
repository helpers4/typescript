/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { fit } from './fit';
import type { FitAlign } from './fit';
import type { Matrix, Size } from './types';

/**
 * Places content in a box, stretched to the box on each axis, without keeping its proportions (CSS `object-fit: fill`). Shortcut for `fit(content, box, { mode: 'fill', align })`.
 *
 * @param content - The size of the content
 * @param box - The size of the box
 * @param align - Where to place it, centered by default — see {@link FitAlign}
 * @returns The content-to-box matrix (`a`/`d` scales, `e`/`f` position)
 * @example
 * fitFill({ width: 200, height: 100 }, { width: 100, height: 100 }) // => scales 0.5 and 1, at (0, 0)
 * @since next
 */
export function fitFill(content: Size, box: Size, align?: FitAlign): Matrix {
  return fit(content, box, { mode: 'fill', align });
}
