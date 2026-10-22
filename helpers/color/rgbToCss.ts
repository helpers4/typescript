/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { clamp } from '../number/clamp';
import { roundTo } from '../number/roundTo';
import type { RgbColor } from './hexToRgb';

/**
 * Formats an RGB(A) color as a CSS `rgb()` value, in the modern space-separated syntax that
 * every current browser and SVG renderer reads.
 *
 * Channels are clamped to 0-255 and rounded; alpha is clamped to 0-1, rounded to 3 decimals, and
 * left out when the color is opaque.
 *
 * @param color - The color to format. `a` defaults to 1 (opaque) when omitted.
 * @returns `rgb(r g b)`, or `rgb(r g b / a)` when translucent
 * @example
 * rgbToCss({ r: 255, g: 128, b: 0 })         // => 'rgb(255 128 0)'
 * rgbToCss({ r: 255, g: 128, b: 0, a: 0.5 }) // => 'rgb(255 128 0 / 0.5)'
 * @since next
 */
export function rgbToCss({ r, g, b, a = 1 }: RgbColor): string {
  const channels = [r, g, b].map((n) => Math.round(clamp(n, 0, 255))).join(' ');
  const alpha = clamp(a, 0, 1);
  return alpha >= 1 ? `rgb(${channels})` : `rgb(${channels} / ${roundTo(alpha, 3)})`;
}
