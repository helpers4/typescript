/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { mixColors } from './mixColors';

const byte = fc.integer({ min: 0, max: 255 });
const opaque = fc.record({ r: byte, g: byte, b: byte });
const color = fc.record({ r: byte, g: byte, b: byte, a: fc.double({ min: 0, max: 1, noNaN: true }) });

describe('mixColors — property-based', () => {
  it('0% gives the base and 100% gives the color (opaque)', () => {
    fc.assert(
      fc.property(opaque, opaque, (c, base) => {
        expect(mixColors(c, base, 0)).toEqual({ ...base, a: 1 });
        expect(mixColors(c, base, 100)).toEqual({ ...c, a: 1 });
      }),
    );
  });

  it('the midpoint of black and white is 128', () => {
    expect(mixColors({ r: 0, g: 0, b: 0 }, { r: 255, g: 255, b: 255 })).toEqual({ r: 128, g: 128, b: 128, a: 1 });
    expect(mixColors({ r: 255, g: 255, b: 255 }, { r: 0, g: 0, b: 0 }, 50)).toEqual({ r: 128, g: 128, b: 128, a: 1 });
  });

  it('opaque colors give a plain weighted average', () => {
    fc.assert(
      fc.property(opaque, opaque, fc.integer({ min: 0, max: 100 }), (c, base, percent) => {
        const out = mixColors(c, base, percent);
        for (const key of ['r', 'g', 'b'] as const) {
          expect(Math.abs(out[key] - (c[key] * percent + base[key] * (100 - percent)) / 100)).toBeLessThanOrEqual(0.5 + 1e-9);
        }
        expect(out.a).toBe(1);
      }),
    );
  });

  it('stays inside the channel and alpha ranges, even with percent out of range', () => {
    fc.assert(
      fc.property(color, color, fc.double({ min: -500, max: 500, noNaN: true }), (c, base, percent) => {
        const out = mixColors(c, base, percent);
        for (const channel of [out.r, out.g, out.b]) {
          expect(Number.isInteger(channel)).toBe(true);
          expect(channel).toBeGreaterThanOrEqual(0);
          expect(channel).toBeLessThanOrEqual(255);
        }
        expect(out.a).toBeGreaterThanOrEqual(0);
        expect(out.a).toBeLessThanOrEqual(1);
      }),
    );
  });
});
