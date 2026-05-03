/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { lerp } from './lerp';

describe('lerp (property-based)', () => {
  it('lerp(a, b, 0) === a for any finite a, b', () => {
    fc.assert(
      fc.property(fc.float({ noNaN: true }), fc.float({ noNaN: true }), (a, b) => {
        expect(lerp(a, b, 0)).toBe(a);
      }),
    );
  });

  it('lerp(a, a, t) === a for any a and t (no movement)', () => {
    fc.assert(
      fc.property(
        fc.float({ noNaN: true, noDefaultInfinity: true }),
        fc.float({ min: 0, max: 1, noNaN: true }),
        (a, t) => {
          expect(lerp(a, a, t)).toBe(a);
        },
      ),
    );
  });

  it('lerp(a, b, t) is between a and b when t is in [0, 1]', () => {
    fc.assert(
      fc.property(
        fc.float({ noNaN: true, noDefaultInfinity: true }),
        fc.float({ noNaN: true, noDefaultInfinity: true }),
        fc.float({ min: 0, max: 1, noNaN: true }),
        (a, b, t) => {
          const result = lerp(a, b, t);
          const min = Math.min(a, b);
          const max = Math.max(a, b);
          expect(result).toBeGreaterThanOrEqual(min - 1e-9);
          expect(result).toBeLessThanOrEqual(max + 1e-9);
        },
      ),
    );
  });

  it('lerp is symmetric: lerp(a,b,t) ≈ lerp(b,a,1-t)', () => {
    fc.assert(
      fc.property(
        fc.float({ min: 0, max: 100, noNaN: true }),
        fc.float({ min: 0, max: 100, noNaN: true }),
        fc.float({ min: 0, max: Math.fround(0.9), noNaN: true }),
        (a, b, t) => {
          expect(lerp(a, b, t)).toBeCloseTo(lerp(b, a, 1 - t), 4);
        },
      ),
    );
  });
});
