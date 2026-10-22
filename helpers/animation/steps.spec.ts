/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { steps } from './steps';
import type { StepPosition } from './steps';

const position = fc.constantFrom<StepPosition>('jump-start', 'jump-end', 'jump-both', 'start', 'end');

describe('steps — property-based', () => {
  it('is non-decreasing, in [0, 1], and ends at 1', () => {
    fc.assert(fc.property(fc.integer({ min: 1, max: 20 }), position, fc.double({ min: 0, max: 1, noNaN: true }), fc.double({ min: 0, max: 1, noNaN: true }), (count, pos, a, b) => {
      const easing = steps(count, pos);
      const [low, high] = a <= b ? [a, b] : [b, a];
      expect(easing(low)).toBeLessThanOrEqual(easing(high));
      expect(easing(low)).toBeGreaterThanOrEqual(0);
      expect(easing(1)).toBe(1);
    }));
  });
});
