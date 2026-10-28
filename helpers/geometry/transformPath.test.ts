/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { applyToPoint } from './applyToPoint';
import { parsePath } from './parsePath';
import { rotate } from './rotate';
import { scale } from './scale';
import { transformPath } from './transformPath';
import { translate } from './translate';
import type { Matrix } from './types';

const identity: Matrix = { a: 1, b: 0, c: 0, d: 1, e: 0, f: 0 };

/** The end points of a path, whatever the commands. */
function ends(d: string): number[][] {
  return parsePath(d).filter((c) => c.values.length).map((c) => c.values.slice(-2));
}

describe('transformPath', () => {
  it('moves a path, writing it absolute', () => {
    expect(transformPath('M0 0 h10 v10 z', translate(5, 5))).toBe('M5 5 L15 5 L15 15 Z');
  });

  it('reads relative commands from the current point', () => {
    expect(transformPath('m1 1 l2 0 c1 0 1 1 0 2 q1 1 2 0', identity)).toBe('M1 1 L3 1 C4 1 4 2 3 3 Q4 4 5 3');
  });

  it('reflects the previous control point for S and T', () => {
    expect(transformPath('M0 0 C0 1 1 2 2 2 S4 3 4 2', identity)).toBe('M0 0 C0 1 1 2 2 2 C3 2 4 3 4 2');
    expect(transformPath('M0 0 Q1 1 2 0 T4 0', identity)).toBe('M0 0 Q1 1 2 0 Q3 -1 4 0');
  });

  it('starts S and T from the current point when no curve precedes', () => {
    expect(transformPath('M1 1 S2 2 3 3', identity)).toBe('M1 1 C1 1 2 2 3 3');
    expect(transformPath('M1 1 T3 3', identity)).toBe('M1 1 Q1 1 3 3');
    expect(transformPath('M0 0 C0 1 1 2 2 2 L3 3 S4 4 5 5', identity)).toBe('M0 0 C0 1 1 2 2 2 L3 3 C3 3 4 4 5 5');
    expect(transformPath('M0 0 Q1 1 2 2 L3 3 T4 4', identity)).toBe('M0 0 Q1 1 2 2 L3 3 Q3 3 4 4');
  });

  it('goes back to the start of the subpath after a close', () => {
    expect(transformPath('M1 1 L3 1 z l1 1', identity)).toBe('M1 1 L3 1 Z L2 2');
  });

  it('turns a zero-radius arc into a line and skips an arc to the same point', () => {
    expect(transformPath('M0 0 A0 5 0 0 1 5 5', identity)).toBe('M0 0 L5 5');
    expect(transformPath('M0 0 A5 0 0 0 1 5 5', identity)).toBe('M0 0 L5 5');
    expect(transformPath('M1 1 A5 5 0 0 1 1 1', identity)).toBe('M1 1');
  });

  it('turns an arc into cubics that reach its end point', () => {
    const d = transformPath('M0 0 A5 5 0 0 1 10 0', identity);
    expect(d.startsWith('M0 0 C')).toBe(true);
    expect(ends(d).at(-1)).toEqual([10, 0]);
  });

  it('keeps a half circle on the circle', () => {
    const cubics = parsePath(transformPath('M0 0 A5 5 0 0 1 10 0', identity));
    expect(cubics).toHaveLength(3);
    const mid = cubics[1]!.values;
    expect(Math.hypot(mid[4]! - 5, mid[5]!)).toBeCloseTo(5, 4);
    expect(mid[5]).toBeLessThan(0);
  });

  it('follows the sweep and large-arc flags', () => {
    const through = (flags: string) => parsePath(transformPath(`M0 0 A5 5 0 ${flags} 6 0`, identity)).at(-1)!.values;
    const small = parsePath(transformPath('M0 0 A5 5 0 0 1 6 0', identity));
    const large = parsePath(transformPath('M0 0 A5 5 0 1 1 6 0', identity));
    expect(small.length).toBeLessThan(large.length);
    expect(through('0 0')).toEqual([expect.any(Number), expect.any(Number), expect.any(Number), expect.any(Number), 6, 0]);
    const top = (flags: string) => Math.min(...parsePath(transformPath(`M0 0 A5 5 0 ${flags} 6 0`, identity)).flatMap((c) => c.values.filter((_, i) => i % 2 === 1)));
    expect(top('0 1')).toBeLessThan(top('0 0'));
  });

  it('sweeps the same way whatever the direction of the chord', () => {
    for (const d of ['M10 0 A5 5 0 0 1 0 0', 'M0 10 A5 5 0 0 1 0 0', 'M0 0 A5 5 0 0 1 0 10']) {
      const ys = parsePath(transformPath(d, identity)).flatMap((c) => c.values);
      expect(ys.every(Number.isFinite)).toBe(true);
    }
    for (const flags of ['0 0', '0 1', '1 0', '1 1']) {
      const d = parsePath(transformPath(`M-4.924 0.868 A5 5 0 ${flags} -4.924 -0.868`, identity));
      expect(d.at(-1)!.values.slice(-2)).toEqual([-4.924, -0.868]);
    }
    for (let degrees = 10; degrees < 360; degrees += 35) {
      const end = [5 * Math.cos((degrees * Math.PI) / 180), 5 * Math.sin((degrees * Math.PI) / 180)];
      for (const flags of ['0 0', '0 1', '1 0', '1 1']) {
        const d = parsePath(transformPath(`M5 0 A5 5 0 ${flags} ${end[0]} ${end[1]}`, identity));
        const last = d.at(-1)!.values;
        expect(last[4]).toBeCloseTo(end[0]!, 5);
        expect(last[5]).toBeCloseTo(end[1]!, 5);
      }
    }
    const back = parsePath(transformPath('M10 0 A5 5 0 0 1 0 0', identity));
    expect(Math.max(...back.map((c) => c.values.at(-1)!))).toBeGreaterThan(0);
  });

  it('scales up radii that are too small', () => {
    const d = transformPath('M0 0 A1 1 0 0 1 10 0', identity);
    expect(ends(d).at(-1)).toEqual([10, 0]);
    const mid = parsePath(d)[1]!.values;
    expect(Math.hypot(mid[4]! - 5, mid[5]!)).toBeCloseTo(5, 4);
  });

  it('handles a rotated ellipse', () => {
    const d = transformPath('M0 0 A10 5 30 0 1 8 4', identity);
    expect(ends(d).at(-1)).toEqual([8, 4]);
  });

  it('transforms with a rotation and a scale', () => {
    const m: Matrix = { a: 0, b: 2, c: -2, d: 0, e: 0, f: 0 };
    expect(transformPath('M1 0 L0 1', m)).toBe('M0 2 L-2 0');
    const r = transformPath('M1 0 L0 1', rotate(Math.PI / 2), 3);
    expect(r).toBe('M0 1 L-1 0');
    expect(transformPath('M1 1', scale(2, 3))).toBe('M2 3');
  });

  it('agrees with applyToPoint on every end point', () => {
    const m: Matrix = { a: 1.5, b: 0.2, c: -0.3, d: 0.8, e: 7, f: -2 };
    const d = 'M1 2 L3 4 C1 1 2 2 3 3';
    const expected = ends(d).map((p) => applyToPoint(m, { x: p[0]!, y: p[1]! }));
    ends(transformPath(d, m)).forEach((p, i) => {
      expect(p[0]).toBeCloseTo(expected[i]!.x, 5);
      expect(p[1]).toBeCloseTo(expected[i]!.y, 5);
    });
  });

  it('rejects invalid path data', () => {
    expect(() => transformPath('L1 1', identity)).toThrow(SyntaxError);
  });
});
