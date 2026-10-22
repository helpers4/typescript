/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { RgbColor } from './hexToRgb';
import type { HsbColor } from './rgbToHsb';

/**
 * Converts an HSB(A) color (also called HSV), as shown by design tool color pickers, into
 * RGB(A).
 *
 * @param color - The color to convert: `h` in degrees (any value, wrapped into 0-360), `s`/`b`
 *   in 0-100, `a` defaults to 1 (opaque) when omitted.
 * @returns The equivalent RGB(A) color, channels rounded to integers in 0-255
 * @example
 * hsbToRgb({ h: 0, s: 100, b: 100 })
 * // => { r: 255, g: 0, b: 0, a: 1 }
 * @since 3.1.5
 */
export function hsbToRgb({ h, s, b, a = 1 }: HsbColor): RgbColor {
  const v = b / 100;
  const c = v * (s / 100);
  const hPrime = (((h % 360) + 360) % 360) / 60;
  const x = c * (1 - Math.abs((hPrime % 2) - 1));
  const m = v - c;

  let rN: number;
  let gN: number;
  let bN: number;
  if (hPrime < 1) [rN, gN, bN] = [c, x, 0];
  else if (hPrime < 2) [rN, gN, bN] = [x, c, 0];
  else if (hPrime < 3) [rN, gN, bN] = [0, c, x];
  else if (hPrime < 4) [rN, gN, bN] = [0, x, c];
  else if (hPrime < 5) [rN, gN, bN] = [x, 0, c];
  else [rN, gN, bN] = [c, 0, x];

  return {
    r: Math.round((rN + m) * 255),
    g: Math.round((gN + m) * 255),
    b: Math.round((bN + m) * 255),
    a,
  };
}
