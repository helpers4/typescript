/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import type { PathCommand } from './types';

/**
 * Converts an elliptical arc (SVG endpoint form, implementation notes F.6.5) to cubic Bézier
 * segments, at most a quarter turn each. Radii that are too small are scaled up so the arc reaches
 * its end point. The caller handles the degenerate cases (a zero radius, equal end points).
 *
 * @ignore
 */
export function arcToCubics(
  x1: number,
  y1: number,
  rx: number,
  ry: number,
  rotation: number,
  largeArc: boolean,
  sweep: boolean,
  x2: number,
  y2: number,
): PathCommand[] {
  const phi = (rotation * Math.PI) / 180;
  const cos = Math.cos(phi);
  const sin = Math.sin(phi);
  const dx = (x1 - x2) / 2;
  const dy = (y1 - y2) / 2;
  const x1p = cos * dx + sin * dy;
  const y1p = -sin * dx + cos * dy;
  rx = Math.abs(rx);
  ry = Math.abs(ry);
  const lambda = (x1p * x1p) / (rx * rx) + (y1p * y1p) / (ry * ry);
  if (lambda > 1) {
    rx *= Math.sqrt(lambda);
    ry *= Math.sqrt(lambda);
  }
  const num = rx * rx * ry * ry - rx * rx * y1p * y1p - ry * ry * x1p * x1p;
  const den = rx * rx * y1p * y1p + ry * ry * x1p * x1p;
  const coef = (largeArc === sweep ? -1 : 1) * Math.sqrt(Math.max(0, num / den));
  const cxp = (coef * rx * y1p) / ry;
  const cyp = (-coef * ry * x1p) / rx;
  const cx = cos * cxp - sin * cyp + (x1 + x2) / 2;
  const cy = sin * cxp + cos * cyp + (y1 + y2) / 2;
  const theta = Math.atan2((y1p - cyp) / ry, (x1p - cxp) / rx);
  let delta = Math.atan2((-y1p - cyp) / ry, (-x1p - cxp) / rx) - theta;
  if (!sweep && delta > 0) delta -= 2 * Math.PI;
  if (sweep && delta < 0) delta += 2 * Math.PI;

  const count = Math.max(1, Math.ceil(Math.abs(delta) / (Math.PI / 2) - 1e-9));
  const step = delta / count;
  const k = (4 / 3) * Math.tan(step / 4);
  const map = (ux: number, uy: number): [number, number] => [
    cx + rx * cos * ux - ry * sin * uy,
    cy + rx * sin * ux + ry * cos * uy,
  ];
  const out: PathCommand[] = [];
  for (let i = 0; i < count; i++) {
    const a = theta + i * step;
    const b = a + step;
    const [c1x, c1y] = map(Math.cos(a) - k * Math.sin(a), Math.sin(a) + k * Math.cos(a));
    const [c2x, c2y] = map(Math.cos(b) + k * Math.sin(b), Math.sin(b) - k * Math.cos(b));
    const [ex, ey] = i === count - 1 ? [x2, y2] : map(Math.cos(b), Math.sin(b));
    out.push({ type: 'C', values: [c1x, c1y, c2x, c2y, ex, ey] });
  }
  return out;
}
