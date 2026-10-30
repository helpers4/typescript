/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { RgbColor } from './hexToRgb';

/**
 * Converts a color whose channels are floats from `0` to `1` (as Figma, Sketch and Penpot store
 * them) into an {@link RgbColor}, with channels from `0` to `255`. Alpha is already `0`–`1` and
 * is kept as it is. The channels are not rounded: {@link rgbToCss} and {@link rgbToHex} do it.
 *
 * @param color - The color, with `r`, `g`, `b` from `0` to `1`. `a` defaults to 1 (opaque)
 * @returns The color with channels from `0` to `255`
 * @example
 * rgbToHex(unitToRgb({ r: 1, g: 0.5, b: 0, a: 0.5 })) // => '#ff800080'
 * @since 3.1.10
 */
export function unitToRgb({ r, g, b, a = 1 }: RgbColor): RgbColor {
  return { r: r * 255, g: g * 255, b: b * 255, a };
}
