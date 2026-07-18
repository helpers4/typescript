/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { roundTo } from '../number/roundTo';
import type { RgbColor } from './hexToRgb';

/**
 * An HSL(A) color with channels expressed as plain numbers.
 */
export interface HslColor {
  /** Hue, 0-360 degrees */
  h: number;
  /** Saturation, 0-100 percent */
  s: number;
  /** Lightness, 0-100 percent */
  l: number;
  /** Alpha channel, 0-1. Defaults to 1 (opaque) when omitted. */
  a?: number;
}

/**
 * Converts an RGB(A) color into HSL(A).
 *
 * `h`/`s`/`l` are rounded to 1 decimal place to avoid floating-point noise.
 *
 * @param color - The color to convert. `r`/`g`/`b` are expected in 0-255,
 *   `a` defaults to 1 (opaque) when omitted.
 * @returns The equivalent HSL(A) color: `h` in 0-360, `s`/`l` in 0-100
 * @example
 * rgbToHsl({ r: 255, g: 0, b: 0 })
 * // => { h: 0, s: 100, l: 50, a: 1 }
 * @since 4.0.0
 */
export function rgbToHsl({ r, g, b, a = 1 }: RgbColor): HslColor {
  const rN = r / 255;
  const gN = g / 255;
  const bN = b / 255;
  const max = Math.max(rN, gN, bN);
  const min = Math.min(rN, gN, bN);
  const delta = max - min;
  const l = (max + min) / 2;

  let h = 0;
  let s = 0;
  if (delta !== 0) {
    s = delta / (1 - Math.abs(2 * l - 1));
    switch (max) {
      case rN:
        h = 60 * (((gN - bN) / delta) % 6);
        break;
      case gN:
        h = 60 * ((bN - rN) / delta + 2);
        break;
      default:
        h = 60 * ((rN - gN) / delta + 4);
        break;
    }
  }
  if (h < 0) h += 360;

  return { h: roundTo(h, 1), s: roundTo(s * 100, 1), l: roundTo(l * 100, 1), a };
}
