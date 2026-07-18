/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

/**
 * Converts a 32-bit packed ARGB integer (as used by e.g. Chromium's
 * `Local State` profile `background_color` field) into a CSS `rgb()` string.
 * The alpha byte (top 8 bits) is read but discarded — the result is always opaque.
 *
 * @param argb - A 32-bit integer where bits 24-31 are alpha, 16-23 are red,
 *   8-15 are green, and 0-7 are blue
 * @returns A `rgb(r,g,b)` CSS color string
 * @example
 * argbToRgb(0xffff0000) // => 'rgb(255,0,0)'  (opaque red)
 * argbToRgb(0x8000ff00) // => 'rgb(0,255,0)'  (alpha byte is ignored)
 * @since 3.0.0
 */
export function argbToRgb(argb: number): string {
  const r = (argb >>> 16) & 0xff;
  const g = (argb >>> 8) & 0xff;
  const b = argb & 0xff;
  return `rgb(${r},${g},${b})`;
}
