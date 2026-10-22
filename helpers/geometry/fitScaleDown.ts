/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { fit } from './fit';
import type { FitAlign } from './fit';
import type { Matrix, Size } from './types';

/**
 * Places content in a box, like {@link fitContain}, but never enlarged (CSS `object-fit: scale-down`). Shortcut for `fit(content, box, { mode: 'scale-down', align })`.
 *
 * @param content - The size of the content
 * @param box - The size of the box
 * @param align - Where to place it, centered by default — see {@link FitAlign}
 * @returns The content-to-box matrix (`a`/`d` scales, `e`/`f` position)
 * @example
 * fitScaleDown({ width: 10, height: 10 }, { width: 100, height: 100 }) // => scale 1, at (45, 45)
 * @since 3.1.5
 */
export function fitScaleDown(content: Size, box: Size, align?: FitAlign): Matrix {
  return fit(content, box, { mode: 'scale-down', align });
}
