/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { argbToRgb } from './argbToRgb';

describe('argbToRgb — property-based', () => {
  it('always returns a well-formed rgb() string with channels in [0,255]', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 0xffffffff }), (argb) => {
        const result = argbToRgb(argb);
        const match = /^rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)$/.exec(result);
        expect(match).not.toBeNull();
        const [r, g, b] = [match![1], match![2], match![3]].map(Number);
        for (const channel of [r, g, b]) {
          expect(channel).toBeGreaterThanOrEqual(0);
          expect(channel).toBeLessThanOrEqual(255);
        }
      }),
    );
  });

  it('is insensitive to the alpha byte (top 8 bits)', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: 0, max: 0xffffff }),
        fc.integer({ min: 0, max: 0xff }),
        fc.integer({ min: 0, max: 0xff }),
        (rgb, alpha1, alpha2) => {
          const argb1 = alpha1 * 0x1000000 + rgb;
          const argb2 = alpha2 * 0x1000000 + rgb;
          expect(argbToRgb(argb1)).toBe(argbToRgb(argb2));
        },
      ),
    );
  });
});
