/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { RgbColor } from './hexToRgb';

/**
 * Multiplies the color channels by the alpha channel (premultiplied alpha), the form compositing
 * and GPU blending work in. The channels are returned as they are, not rounded, so that
 * {@link unpremultiply} gives the color back.
 *
 * @param color - A straight (non-premultiplied) color; a missing alpha is 1
 * @returns The premultiplied color
 * @example
 * premultiply({ r: 255, g: 100, b: 0, a: 0.5 }) // => { r: 127.5, g: 50, b: 0, a: 0.5 }
 * @since next
 */
export function premultiply({ r, g, b, a = 1 }: RgbColor): RgbColor {
  return { r: r * a, g: g * a, b: b * a, a };
}
