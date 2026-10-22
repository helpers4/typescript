/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { cubicBezier } from './cubicBezier';

/**
 * The keyword easings of CSS.
 * @since next
 */
export type CssEasingKeyword = 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out';

const CURVES: Record<Exclude<CssEasingKeyword, 'linear'>, [number, number, number, number]> = {
  ease: [0.25, 0.1, 0.25, 1],
  'ease-in': [0.42, 0, 1, 1],
  'ease-out': [0, 0, 0.58, 1],
  'ease-in-out': [0.42, 0, 0.58, 1],
};

/**
 * The easing function of a CSS keyword, e.g. to play in JavaScript the easing a design tool
 * exported as `'ease-out'`. The input is clamped to `[0, 1]`, like {@link cubicBezier}.
 *
 * @param keyword - `'linear'`, `'ease'`, `'ease-in'`, `'ease-out'` or `'ease-in-out'`
 * @returns The easing function
 * @example
 * cssEasing('ease-in-out')(0.5) // => 0.5
 * @since next
 */
export function cssEasing(keyword: CssEasingKeyword): (t: number) => number {
  if (keyword === 'linear') return (t) => Math.min(1, Math.max(0, t));
  return cubicBezier(...CURVES[keyword]);
}
