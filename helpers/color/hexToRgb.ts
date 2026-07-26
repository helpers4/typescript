/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { roundTo } from '../number/roundTo';
import { HEX_COLOR_DIGITS } from '../_shared/_hexColorGrammar.js';

/**
 * An RGB(A) color with channels expressed as plain numbers, convenient for
 * further conversion or manipulation.
 */
export interface RgbColor {
  /** Red channel, 0-255 */
  r: number;
  /** Green channel, 0-255 */
  g: number;
  /** Blue channel, 0-255 */
  b: number;
  /** Alpha channel, 0-1. Defaults to 1 (opaque) when omitted. */
  a?: number;
}

const HEX_PATTERN = /* @__PURE__ */ new RegExp(`^#?(${HEX_COLOR_DIGITS})$`, 'i');

function expandShortHex(digits: string): string {
  return digits.length <= 4
    ? digits
        .split('')
        .map((c) => c + c)
        .join('')
    : digits;
}

/**
 * Parses a hex color string (`#rgb`, `#rgba`, `#rrggbb`, `#rrggbbaa` — the
 * leading `#` is optional) into its RGB(A) channels.
 *
 * @param hex - The hex color string to parse
 * @returns The parsed color, or `null` if `hex` is not a valid hex color
 * @example
 * hexToRgb('#ff0000')     // => { r: 255, g: 0, b: 0, a: 1 }
 * hexToRgb('0f08')        // => { r: 0, g: 255, b: 0, a: 0.533 }
 * hexToRgb('not-a-color') // => null
 * @since 3.0.0
 */
export function hexToRgb(hex: string): RgbColor | null {
  const match = HEX_PATTERN.exec(hex.trim());
  if (!match) return null;

  const digits = expandShortHex(match[1]!);
  const r = Number.parseInt(digits.slice(0, 2), 16);
  const g = Number.parseInt(digits.slice(2, 4), 16);
  const b = Number.parseInt(digits.slice(4, 6), 16);
  const a = digits.length === 8 ? roundTo(Number.parseInt(digits.slice(6, 8), 16) / 255, 3) : 1;

  return { r, g, b, a };
}
