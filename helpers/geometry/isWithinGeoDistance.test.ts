/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { geoDistance } from './geoDistance';
import { isWithinGeoDistance } from './isWithinGeoDistance';

describe('isWithinGeoDistance', () => {
  it('is true inside the radius and false outside', () => {
    expect(isWithinGeoDistance(48.8566, 2.3522, 5, 48.8606, 2.3376)).toBe(true);
    expect(isWithinGeoDistance(48.8566, 2.3522, 5, 51.5074, -0.1278)).toBe(false);
  });

  it('includes the border', () => {
    const km = geoDistance(48.8566, 2.3522, 51.5074, -0.1278);
    expect(isWithinGeoDistance(48.8566, 2.3522, km, 51.5074, -0.1278)).toBe(true);
    expect(isWithinGeoDistance(48.8566, 2.3522, km - 0.001, 51.5074, -0.1278)).toBe(false);
  });

  it('a radius of 0 only holds the center', () => {
    expect(isWithinGeoDistance(10, 10, 0, 10, 10)).toBe(true);
    expect(isWithinGeoDistance(10, 10, 0, 10, 10.001)).toBe(false);
  });

  it('throws a RangeError for a negative or NaN radius', () => {
    expect(() => isWithinGeoDistance(0, 0, -1, 0, 0)).toThrow(RangeError);
    expect(() => isWithinGeoDistance(0, 0, Number.NaN, 0, 0)).toThrow(RangeError);
  });
});
