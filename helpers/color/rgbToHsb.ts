/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { roundTo } from '../number/roundTo';
import type { RgbColor } from './hexToRgb';

/**
 * An HSB(A) color (also called HSV), the model of design tool color pickers.
 * @since next
 */
export interface HsbColor {
  /** Hue, 0-360 degrees */
  h: number;
  /** Saturation, 0-100 percent */
  s: number;
  /** Brightness (value), 0-100 percent */
  b: number;
  /** Alpha channel, 0-1. Defaults to 1 (opaque) when omitted. */
  a?: number;
}

/**
 * Converts an RGB(A) color into HSB(A), the model design tools (Figma, Sketch, XD) show in their
 * color pickers. Unlike HSL lightness, brightness `100` is the pure color, not white.
 *
 * `h`/`s`/`b` are rounded to 1 decimal place to avoid floating-point noise.
 *
 * @param color - The color to convert. `r`/`g`/`b` are expected in 0-255,
 *   `a` defaults to 1 (opaque) when omitted.
 * @returns The equivalent HSB(A) color: `h` in 0-360, `s`/`b` in 0-100
 * @example
 * rgbToHsb({ r: 255, g: 0, b: 0 })
 * // => { h: 0, s: 100, b: 100, a: 1 }
 * @since next
 */
export function rgbToHsb({ r, g, b, a = 1 }: RgbColor): HsbColor {
  const rN = r / 255;
  const gN = g / 255;
  const bN = b / 255;
  const max = Math.max(rN, gN, bN);
  const delta = max - Math.min(rN, gN, bN);

  let h = 0;
  if (delta !== 0) {
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
  const s = max === 0 ? 0 : delta / max;

  return { h: roundTo(h, 1), s: roundTo(s * 100, 1), b: roundTo(max * 100, 1), a };
}
