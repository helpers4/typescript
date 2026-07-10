/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { RgbColor } from './hexToRgb';
import type { HslColor } from './rgbToHsl';

/**
 * Converts an HSL(A) color into RGB(A).
 *
 * @param color - The color to convert. `h` is normalized modulo 360 (negative
 *   values wrap around), `s`/`l` are expected in 0-100, `a` defaults to 1
 *   (opaque) when omitted.
 * @returns The equivalent RGB(A) color, with `r`/`g`/`b` rounded to 0-255
 * @example
 * hslToRgb({ h: 0, s: 100, l: 50 })
 * // => { r: 255, g: 0, b: 0, a: 1 }
 * @since next
 */
export function hslToRgb({ h, s, l, a = 1 }: HslColor): RgbColor {
  const sN = s / 100;
  const lN = l / 100;
  const c = (1 - Math.abs(2 * lN - 1)) * sN;
  const hPrime = (((h % 360) + 360) % 360) / 60;
  const x = c * (1 - Math.abs((hPrime % 2) - 1));
  const m = lN - c / 2;

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
