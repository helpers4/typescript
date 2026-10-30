/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { formatPath } from './formatPath';
import type { PathCommand, Rect } from './types';

/**
 * The path of a rectangle with a radius per corner, as SVG path data. Each radius is clamped to
 * half the smaller side, and a radius of `0` gives a square corner (no arc is written).
 *
 * @param rect - The rectangle
 * @param radius - One radius for the four corners, or `[topLeft, topRight, bottomRight, bottomLeft]` as in CSS `border-radius`. Negative radii count as `0`
 * @returns The path data, closed
 * @example
 * roundedRectPath({ x: 0, y: 0, width: 10, height: 10 }, 0) // => 'M0 0 L10 0 L10 10 L0 10 L0 0 Z'
 * roundedRectPath({ x: 0, y: 0, width: 10, height: 10 }, [5, 0, 0, 0]) // => 'M5 0 L10 0 L10 10 L0 10 L0 5 A5 5 0 0 1 5 0 Z'
 * @since 3.1.10
 */
export function roundedRectPath(rect: Rect, radius: number | readonly [number, number, number, number]): string {
  const limit = Math.min(rect.width, rect.height) / 2;
  const [tl, tr, br, bl] = (typeof radius === 'number' ? [radius, radius, radius, radius] : radius).map((r) =>
    Math.min(Math.max(r, 0), limit),
  ) as [number, number, number, number];
  const { x, y, width, height } = rect;
  const right = x + width;
  const bottom = y + height;
  const commands: PathCommand[] = [{ type: 'M', values: [x + tl, y] }];
  const arc = (r: number, ex: number, ey: number): void => {
    if (r > 0) commands.push({ type: 'A', values: [r, r, 0, 0, 1, ex, ey] });
  };
  commands.push({ type: 'L', values: [right - tr, y] });
  arc(tr, right, y + tr);
  commands.push({ type: 'L', values: [right, bottom - br] });
  arc(br, right - br, bottom);
  commands.push({ type: 'L', values: [x + bl, bottom] });
  arc(bl, x, bottom - bl);
  commands.push({ type: 'L', values: [x, y + tl] });
  arc(tl, x + tl, y);
  commands.push({ type: 'Z', values: [] });
  return formatPath(commands);
}
