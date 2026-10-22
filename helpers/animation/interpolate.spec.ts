/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { interpolate } from './interpolate';

const finite = fc.double({ min: -1e6, max: 1e6, noNaN: true });

describe('interpolate — property-based', () => {
  it('returns from at 0 and to at 1, for any shape', () => {
    fc.assert(fc.property(fc.array(fc.tuple(finite, finite), { maxLength: 8 }), (pairs) => {
      const from = { values: pairs.map(([a]) => a) };
      const to = { values: pairs.map(([, b]) => b) };
      expect(interpolate(from, to, 0)).toEqual(from);
      expect(interpolate(from, to, 1)).toEqual(to);
    }));
  });

  it('stays between from and to for t in [0, 1]', () => {
    fc.assert(fc.property(finite, finite, fc.double({ min: 0, max: 1, noNaN: true }), (a, b, t) => {
      const value = interpolate(a, b, t);
      expect(value).toBeGreaterThanOrEqual(Math.min(a, b) - 1e-6);
      expect(value).toBeLessThanOrEqual(Math.max(a, b) + 1e-6);
    }));
  });
});
