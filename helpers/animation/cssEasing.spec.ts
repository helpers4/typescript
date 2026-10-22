/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { cssEasing } from './cssEasing';
import type { CssEasingKeyword } from './cssEasing';

const keyword = fc.constantFrom<CssEasingKeyword>('linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out');

describe('cssEasing — property-based', () => {
  it('stays in [0, 1] and starts at 0 and ends at 1', () => {
    fc.assert(fc.property(keyword, fc.double({ noNaN: true }), (name, t) => {
      const easing = cssEasing(name);
      const value = easing(t);
      expect(value).toBeGreaterThanOrEqual(0);
      expect(value).toBeLessThanOrEqual(1);
      expect(easing(0)).toBe(0);
      expect(easing(1)).toBe(1);
    }));
  });

  it('ease-in and ease-out mirror each other', () => {
    fc.assert(fc.property(fc.double({ min: 0, max: 1, noNaN: true }), (t) => {
      expect(cssEasing('ease-in')(t)).toBeCloseTo(1 - cssEasing('ease-out')(1 - t), 6);
    }));
  });
});
