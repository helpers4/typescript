/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { clamp } from './clamp';

describe('clamp — property-based', () => {
  it('result is always >= min', () => {
    fc.assert(
      fc.property(
        fc.float({ noNaN: true, noDefaultInfinity: true }),
        fc.float({ noNaN: true, noDefaultInfinity: true }),
        fc.float({ noNaN: true, noDefaultInfinity: true }),
        (value, a, b) => {
          const min = Math.min(a, b);
          const max = Math.max(a, b);
          expect(clamp(value, min, max)).toBeGreaterThanOrEqual(min);
        }
      )
    );
  });

  it('result is always <= max', () => {
    fc.assert(
      fc.property(
        fc.float({ noNaN: true, noDefaultInfinity: true }),
        fc.float({ noNaN: true, noDefaultInfinity: true }),
        fc.float({ noNaN: true, noDefaultInfinity: true }),
        (value, a, b) => {
          const min = Math.min(a, b);
          const max = Math.max(a, b);
          expect(clamp(value, min, max)).toBeLessThanOrEqual(max);
        }
      )
    );
  });

  it('when min === max, always returns min', () => {
    fc.assert(
      fc.property(
        fc.float({ noNaN: true, noDefaultInfinity: true }),
        fc.float({ noNaN: true, noDefaultInfinity: true }),
        (value, minMax) => {
          expect(clamp(value, minMax, minMax)).toBe(minMax);
        }
      )
    );
  });

  it('value within [min, max] is returned unchanged', () => {
    fc.assert(
      fc.property(
        fc.float({ noNaN: true, noDefaultInfinity: true }),
        fc.float({ noNaN: true, noDefaultInfinity: true }),
        (a, b) => {
          const min = Math.min(a, b);
          const max = Math.max(a, b);
          const value = (min + max) / 2;
          expect(clamp(value, min, max)).toBe(value);
        }
      )
    );
  });
});

describe('clamp — contract', () => {
  it('-Infinity → returns min', () => {
    expect(clamp(-Infinity, 0, 100)).toBe(0);
  });

  it('+Infinity → returns max', () => {
    expect(clamp(Infinity, 0, 100)).toBe(100);
  });

  it('NaN behavior: Math.min/Math.max propagate NaN', () => {
    // clamp(NaN, 0, 100) => Math.min(Math.max(NaN, 0), 100) => Math.min(NaN, 100) => NaN
    expect(clamp(NaN, 0, 100)).toBeNaN();
  });

  it('min > max behavior: follows Math.min(Math.max(value, min), max)', () => {
    // When min > max, Math.max(5, 10) = 10, Math.min(10, 1) = 1
    // Result is always max when min > max (regardless of value)
    expect(clamp(5, 10, 1)).toBe(1);
    expect(clamp(0, 10, 1)).toBe(1);
    expect(clamp(20, 10, 1)).toBe(1);
  });

  it('value below min → returns min', () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  it('value above max → returns max', () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it('value at exact boundaries → returns value', () => {
    expect(clamp(0, 0, 10)).toBe(0);
    expect(clamp(10, 0, 10)).toBe(10);
  });
});
