/**
 * This file is part of helpers4.
 * Copyright (C) 2026 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { distance } from './distance';

describe('distance', () => {
  it('is 0 between a point and itself', () => {
    expect(distance(48.8566, 2.3522, 48.8566, 2.3522)).toBe(0);
  });

  it('matches known distances', () => {
    expect(distance(48.8566, 2.3522, 51.5074, -0.1278)).toBeCloseTo(343.6, 0);
    expect(distance(40.7128, -74.006, 34.0522, -118.2437)).toBeCloseTo(3936, -1);
  });

  it('is a quarter of the circumference from the equator to a pole', () => {
    expect(distance(0, 0, 90, 0)).toBeCloseTo((Math.PI * 6371) / 2, 6);
  });

  it('is half the circumference between antipodes', () => {
    expect(distance(0, 0, 0, 180)).toBeCloseTo(Math.PI * 6371, 3);
    expect(distance(10, 20, -10, -160)).toBeCloseTo(Math.PI * 6371, 3);
  });

  it('is symmetric and crosses the antimeridian', () => {
    expect(distance(0, 179, 0, -179)).toBeCloseTo(distance(0, -179, 0, 179), 9);
    expect(distance(0, 179, 0, -179)).toBeCloseTo(222.4, 0);
  });
});
