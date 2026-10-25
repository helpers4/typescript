/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { RgbColor } from './hexToRgb';
import { relativeLuminance } from './relativeLuminance';

/**
 * Computes the WCAG 2 contrast ratio between two colors, from 1 (identical) to 21 (black on
 * white). The lighter color is always put over the darker one, so the order of the arguments does
 * not matter. The ratio is not rounded, so it can be compared as it is with the WCAG thresholds:
 * 4.5 (AA, normal text), 3 (AA, large text and UI components), 7 (AAA, normal text) and 4.5 (AAA,
 * large text). Alpha is ignored: flatten translucent colors first (see {@link blendColors}).
 *
 * @param foreground - The text (or foreground) color
 * @param background - The color behind it
 * @returns The contrast ratio, between 1 and 21
 * @example
 * contrastRatio({ r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 }) // => 21
 * @example
 * contrastRatio({ r: 119, g: 119, b: 119 }, { r: 255, g: 255, b: 255 }) >= 4.5 // => false (about 4.48)
 * @since next
 */
export function contrastRatio(foreground: RgbColor, background: RgbColor): number {
  const a = relativeLuminance(foreground);
  const b = relativeLuminance(background);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}
