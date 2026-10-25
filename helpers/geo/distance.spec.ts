/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { distance } from './distance';

const lat = fc.double({ min: -90, max: 90, noNaN: true });
const lon = fc.double({ min: -180, max: 180, noNaN: true });

describe('distance — property-based', () => {
  it('is symmetric', () => {
    fc.assert(
      fc.property(lat, lon, lat, lon, (a, b, c, d) => {
        expect(distance(a, b, c, d)).toBeCloseTo(distance(c, d, a, b), 6);
      }),
    );
  });

  it('is never negative nor above half the circumference', () => {
    fc.assert(
      fc.property(lat, lon, lat, lon, (a, b, c, d) => {
        const km = distance(a, b, c, d);
        expect(km).toBeGreaterThanOrEqual(0);
        expect(km).toBeLessThanOrEqual(Math.PI * 6371 + 1e-6);
      }),
    );
  });

  it('respects the triangle inequality', () => {
    fc.assert(
      fc.property(lat, lon, lat, lon, lat, lon, (a, b, c, d, e, f) => {
        expect(distance(a, b, e, f)).toBeLessThanOrEqual(distance(a, b, c, d) + distance(c, d, e, f) + 1e-6);
      }),
    );
  });
});
