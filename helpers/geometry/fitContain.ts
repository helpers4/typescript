/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { fit } from './fit';
import type { FitAlign } from './fit';
import type { Matrix, Size } from './types';

/**
 * Places content in a box, as large as possible while staying entirely inside the box (CSS `object-fit: contain`). Shortcut for `fit(content, box, { mode: 'contain', align })`.
 *
 * @param content - The size of the content
 * @param box - The size of the box
 * @param align - Where to place it, centered by default — see {@link FitAlign}
 * @returns The content-to-box matrix (`a`/`d` scales, `e`/`f` position)
 * @example
 * fitContain({ width: 200, height: 100 }, { width: 100, height: 100 }) // => scale 0.5, at (0, 25)
 * @since 3.1.5
 */
export function fitContain(content: Size, box: Size, align?: FitAlign): Matrix {
  return fit(content, box, { mode: 'contain', align });
}
