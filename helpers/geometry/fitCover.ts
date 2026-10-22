/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { Fit, Size } from './types';

/**
 * Scales content to cover a whole box, keeping its proportions, and centers it, like CSS
 * `object-fit: cover`: the content overflows on two sides when the proportions differ, so
 * `x` or `y` is negative.
 *
 * Sizes are expected to be positive.
 *
 * @param content - The size of the content
 * @param box - The size of the box
 * @returns The scale, and the position of the scaled content's top-left corner in the box
 * @example
 * fitCover({ width: 200, height: 100 }, { width: 100, height: 100 })
 * // => { scale: 1, x: -50, y: 0 }
 * @since next
 */
export function fitCover(content: Size, box: Size): Fit {
  const scale = Math.max(box.width / content.width, box.height / content.height);
  return { scale, x: (box.width - content.width * scale) / 2, y: (box.height - content.height * scale) / 2 };
}
