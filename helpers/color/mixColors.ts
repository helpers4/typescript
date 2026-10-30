/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { clamp } from '../number/clamp';
import { roundTo } from '../number/roundTo';
import type { RgbColor } from './hexToRgb';
import { premultiply } from './premultiply';
import { unpremultiply } from './unpremultiply';

/**
 * Mixes two colors in sRGB, as CSS `color-mix(in srgb, color P%, base)` does: `percent`% of
 * `color` and the rest of `base`. Alpha is interpolated in premultiplied space (CSS Color 4), so a
 * translucent color weighs less in the result. Opaque colors give a plain weighted average of the
 * channels.
 *
 * @param color - The color to mix in
 * @param base - The color it is mixed into
 * @param percent - Share of `color`, from 0 (all `base`) to 100 (all `color`); clamped. Defaults to 50.
 * @throws {RangeError} If `percent` is `NaN`
 * @returns The straight result: channels rounded to integers, alpha to 3 decimals
 * @example
 * mixColors({ r: 255, g: 0, b: 0 }, { r: 0, g: 0, b: 255 }, 25) // => { r: 64, g: 0, b: 191, a: 1 }
 * @example
 * mixColors({ r: 255, g: 0, b: 0, a: 0.5 }, { r: 0, g: 0, b: 255 }) // => { r: 85, g: 0, b: 170, a: 0.75 }
 * @since 3.1.10
 */
export function mixColors(color: RgbColor, base: RgbColor, percent = 50): RgbColor {
  if (Number.isNaN(percent)) throw new RangeError('mixColors: percent must be a number');
  const p = clamp(percent, 0, 100) / 100;
  const c = premultiply(color);
  const d = premultiply(base);
  const mixed = unpremultiply({
    r: c.r * p + d.r * (1 - p),
    g: c.g * p + d.g * (1 - p),
    b: c.b * p + d.b * (1 - p),
    a: c.a! * p + d.a! * (1 - p),
  });
  return { r: Math.round(mixed.r), g: Math.round(mixed.g), b: Math.round(mixed.b), a: roundTo(mixed.a!, 3) };
}
