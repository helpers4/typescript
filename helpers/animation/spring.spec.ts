/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { spring } from './spring';

const options = fc.record({
  mass: fc.double({ min: 0.1, max: 10, noNaN: true }),
  stiffness: fc.double({ min: 10, max: 1000, noNaN: true }),
  damping: fc.double({ min: 1, max: 100, noNaN: true }),
  initialVelocity: fc.double({ min: -20, max: 20, noNaN: true }),
});

describe('spring — property-based', () => {
  it('has a positive finite duration, and stays settled after it', () => {
    fc.assert(fc.property(options, fc.double({ min: 0, max: 1, noNaN: true }), (o, extra) => {
      const s = spring(o);
      expect(s.durationMs).toBeGreaterThan(0);
      expect(Number.isFinite(s.durationMs)).toBe(true);
      expect(s.at(s.durationMs * (1 + extra))).toBe(1);
    }));
  });
});
