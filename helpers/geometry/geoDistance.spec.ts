/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { geoDistance } from './geoDistance';

const lat = fc.double({ min: -90, max: 90, noNaN: true });
const lon = fc.double({ min: -180, max: 180, noNaN: true });

describe('geoDistance — property-based', () => {
  it('is symmetric', () => {
    fc.assert(
      fc.property(lat, lon, lat, lon, (a, b, c, d) => {
        expect(geoDistance(a, b, c, d)).toBeCloseTo(geoDistance(c, d, a, b), 3);
      }),
    );
  });

  it('is never negative nor above half the circumference', () => {
    fc.assert(
      fc.property(lat, lon, lat, lon, (a, b, c, d) => {
        const km = geoDistance(a, b, c, d);
        expect(km).toBeGreaterThanOrEqual(0);
        expect(km).toBeLessThanOrEqual(Math.PI * 6371 + 1e-3);
      }),
    );
  });

  it('respects the triangle inequality', () => {
    fc.assert(
      fc.property(lat, lon, lat, lon, lat, lon, (a, b, c, d, e, f) => {
        expect(geoDistance(a, b, e, f)).toBeLessThanOrEqual(geoDistance(a, b, c, d) + geoDistance(c, d, e, f) + 1e-3);
      }),
    );
  });
});
