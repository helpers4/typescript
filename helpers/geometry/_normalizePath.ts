/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { arcToCubics } from './_arcToCubics';
import type { PathCommand } from './types';

/** The control point mirrored through the current point, or the current point itself without one. */
function reflect(cx: number, cy: number, control: readonly [number, number] | null): [number, number] {
  return control ? [2 * cx - control[0], 2 * cy - control[1]] : [cx, cy];
}

/**
 * Rewrites path commands with absolute `M`, `L`, `C`, `Q` and `Z` only: relative commands become
 * absolute, `H`/`V` become `L`, `S` becomes `C`, `T` becomes `Q` and arcs become cubic curves.
 *
 * @ignore
 */
export function normalizePath(commands: readonly PathCommand[]): PathCommand[] {
  const out: PathCommand[] = [];
  let cx = 0;
  let cy = 0;
  let startX = 0;
  let startY = 0;
  // The control point the next `S` or `T` reflects, when the previous command was a curve of its kind.
  let lastCubic: [number, number] | null = null;
  let lastQuad: [number, number] | null = null;

  for (const { type, values: v } of commands) {
    const relative = type !== type.toUpperCase();
    const ox = relative ? cx : 0;
    const oy = relative ? cy : 0;
    const kind = type.toUpperCase();
    let cubic: [number, number] | null = null;
    let quad: [number, number] | null = null;

    switch (kind) {
      case 'M':
        cx = v[0]! + ox;
        cy = v[1]! + oy;
        startX = cx;
        startY = cy;
        out.push({ type: 'M', values: [cx, cy] });
        break;
      case 'L':
      case 'H':
      case 'V': {
        const x = kind === 'V' ? cx : v[0]! + ox;
        const y = kind === 'H' ? cy : kind === 'V' ? v[0]! + oy : v[1]! + oy;
        cx = x;
        cy = y;
        out.push({ type: 'L', values: [cx, cy] });
        break;
      }
      case 'C':
      case 'S': {
        const s = kind === 'S';
        const [x1, y1]: [number, number] = s
          ? reflect(cx, cy, lastCubic)
          : [v[0]! + ox, v[1]! + oy];
        const i = s ? 0 : 2;
        const x2 = v[i]! + ox;
        const y2 = v[i + 1]! + oy;
        cx = v[i + 2]! + ox;
        cy = v[i + 3]! + oy;
        cubic = [x2, y2];
        out.push({ type: 'C', values: [x1, y1, x2, y2, cx, cy] });
        break;
      }
      case 'Q':
      case 'T': {
        const t = kind === 'T';
        const [x1, y1]: [number, number] = t
          ? reflect(cx, cy, lastQuad)
          : [v[0]! + ox, v[1]! + oy];
        const i = t ? 0 : 2;
        const x = v[i]! + ox;
        const y = v[i + 1]! + oy;
        quad = [x1, y1];
        out.push({ type: 'Q', values: [x1, y1, x, y] });
        cx = x;
        cy = y;
        break;
      }
      case 'A': {
        const x = v[5]! + ox;
        const y = v[6]! + oy;
        if (v[0] === 0 || v[1] === 0) out.push({ type: 'L', values: [x, y] });
        else if (x !== cx || y !== cy) out.push(...arcToCubics(cx, cy, v[0]!, v[1]!, v[2]!, v[3] !== 0, v[4] !== 0, x, y));
        cx = x;
        cy = y;
        break;
      }
      default:
        out.push({ type: 'Z', values: [] });
        cx = startX;
        cy = startY;
    }
    lastCubic = cubic;
    lastQuad = quad;
  }
  return out;
}
