/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { clamp } from '../number/clamp';
import type { RgbColor } from './hexToRgb';

function toHexByte(n: number): string {
  return Math.round(clamp(n, 0, 255)).toString(16).padStart(2, '0');
}

/**
 * Converts an RGB(A) color into a hex color string.
 *
 * `r`/`g`/`b` are clamped to 0-255 and rounded to the nearest integer before
 * formatting. The alpha channel is only appended (as `#rrggbbaa`) when it is
 * below 1 — fully opaque colors format as the plain 6-digit `#rrggbb`.
 *
 * @param color - The color to convert. `a` defaults to 1 (opaque) when omitted.
 * @returns A lowercase hex color string
 * @example
 * rgbToHex({ r: 255, g: 0, b: 0 })         // => '#ff0000'
 * rgbToHex({ r: 0, g: 255, b: 0, a: 0.5 }) // => '#00ff0080'
 * @since 3.0.0
 */
export function rgbToHex({ r, g, b, a = 1 }: RgbColor): string {
  const alpha = clamp(a, 0, 1);
  const base = `#${toHexByte(r)}${toHexByte(g)}${toHexByte(b)}`;
  return alpha >= 1 ? base : `${base}${toHexByte(alpha * 255)}`;
}
