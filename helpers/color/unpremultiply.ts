/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { RgbColor } from './hexToRgb';

/**
 * Divides the color channels by the alpha channel: the inverse of {@link premultiply}. A fully
 * transparent color has lost its channels, so it comes back as transparent black.
 *
 * @param color - A premultiplied color; a missing alpha is 1
 * @returns The straight (non-premultiplied) color
 * @example
 * unpremultiply({ r: 127.5, g: 50, b: 0, a: 0.5 }) // => { r: 255, g: 100, b: 0, a: 0.5 }
 * @since 3.1.8
 */
export function unpremultiply({ r, g, b, a = 1 }: RgbColor): RgbColor {
  return a === 0 ? { r: 0, g: 0, b: 0, a: 0 } : { r: r / a, g: g / a, b: b / a, a };
}
