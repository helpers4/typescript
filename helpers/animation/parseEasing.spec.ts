/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { parseEasing } from './parseEasing';
import { toCssLinear } from './toCssLinear';

describe('parseEasing — property-based', () => {
  it('never throws', () => {
    fc.assert(fc.property(fc.string(), (css) => {
      expect(() => parseEasing(css)).not.toThrow();
    }));
  });

  it('reads back what toCssLinear writes, at the sample points', () => {
    fc.assert(fc.property(fc.integer({ min: 2, max: 40 }), (samples) => {
      const curve = (t: number) => t * t;
      const easing = parseEasing(toCssLinear(curve, samples))!;
      for (let i = 0; i < samples; i++) {
        const t = i / (samples - 1);
        expect(easing(t)).toBeCloseTo(curve(t), 3);
      }
    }));
  });

  it('any valid cubic-bezier() stays finite', () => {
    const unit = fc.double({ min: 0, max: 1, noNaN: true });
    fc.assert(fc.property(unit, fc.double({ min: -2, max: 2, noNaN: true }), unit, fc.double({ min: -2, max: 2, noNaN: true }), unit, (x1, y1, x2, y2, t) => {
      const easing = parseEasing(`cubic-bezier(${x1}, ${y1}, ${x2}, ${y2})`);
      expect(Number.isFinite(easing!(t))).toBe(true);
    }));
  });
});
