/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { RgbColor } from './hexToRgb';

function linearize(channel: number): number {
  const c = channel / 255;
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

/**
 * Computes the WCAG 2.x relative luminance of a color: the perceived brightness from 0 (black) to
 * 1 (white), after linearising the sRGB channels. The alpha channel is ignored: flatten a
 * translucent color over its background first (see {@link blendColors}).
 *
 * @param color - An sRGB color, channels 0-255
 * @returns The relative luminance, between 0 and 1
 * @example
 * relativeLuminance({ r: 255, g: 0, b: 0 }) // => 0.2126
 * @example
 * relativeLuminance({ r: 0, g: 0, b: 0 }) // => 0
 * @since next
 */
export function relativeLuminance({ r, g, b }: RgbColor): number {
  return 0.2126 * linearize(r) + 0.7152 * linearize(g) + 0.0722 * linearize(b);
}
