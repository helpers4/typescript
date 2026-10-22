/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { clamp } from '../number/clamp';
import { roundTo } from '../number/roundTo';
import type { HslColor } from './rgbToHsl';

/**
 * Formats an HSL(A) color as a CSS `hsl()` value, in the modern space-separated syntax.
 *
 * The hue is wrapped into 0-360, saturation and lightness are clamped to 0-100, all three rounded
 * to 1 decimal place; alpha is clamped to 0-1, rounded to 3 decimals, and left out when the color
 * is opaque.
 *
 * @param color - The color to format. `a` defaults to 1 (opaque) when omitted.
 * @returns `hsl(h s% l%)`, or `hsl(h s% l% / a)` when translucent
 * @example
 * hslToCss({ h: 210, s: 100, l: 50 })         // => 'hsl(210 100% 50%)'
 * hslToCss({ h: -30, s: 80, l: 40, a: 0.25 }) // => 'hsl(330 80% 40% / 0.25)'
 * @since 3.1.5
 */
export function hslToCss({ h, s, l, a = 1 }: HslColor): string {
  const hue = roundTo((((h % 360) + 360) % 360), 1) % 360;
  const channels = `${hue} ${roundTo(clamp(s, 0, 100), 1)}% ${roundTo(clamp(l, 0, 100), 1)}%`;
  const alpha = clamp(a, 0, 1);
  return alpha >= 1 ? `hsl(${channels})` : `hsl(${channels} / ${roundTo(alpha, 3)})`;
}
