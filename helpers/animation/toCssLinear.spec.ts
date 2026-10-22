/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { toCssLinear } from './toCssLinear';

describe('toCssLinear — property-based', () => {
  it('has one value per sample, all numbers', () => {
    fc.assert(fc.property(fc.integer({ min: 2, max: 100 }), (samples) => {
      const css = toCssLinear((t) => Math.sin(t * 3), samples);
      expect(css.startsWith('linear(') && css.endsWith(')')).toBe(true);
      const values = css.slice(7, -1).split(', ').map(Number);
      expect(values).toHaveLength(samples);
      expect(values.every(Number.isFinite)).toBe(true);
    }));
  });
});
