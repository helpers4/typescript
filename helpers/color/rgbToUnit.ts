/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { RgbColor } from './hexToRgb';

/**
 * Converts an {@link RgbColor} (channels from `0` to `255`) into a color whose channels are floats
 * from `0` to `1`, the way Figma, Sketch and Penpot store them. Alpha is kept as it is.
 *
 * @param color - The color. `a` defaults to 1 (opaque)
 * @returns The color with `r`, `g`, `b` from `0` to `1`
 * @example
 * rgbToUnit({ r: 255, g: 51, b: 0 }) // => { r: 1, g: 0.2, b: 0, a: 1 }
 * @since next
 */
export function rgbToUnit({ r, g, b, a = 1 }: RgbColor): RgbColor {
  return { r: r / 255, g: g / 255, b: b / 255, a };
}
