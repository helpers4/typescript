/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { inRange } from './inRange';

describe('inRange — property-based', () => {
  it('any value strictly between min and max returns true for all inclusive modes', () => {
    fc.assert(
      fc.property(
        fc.float({ noNaN: true }),
        fc.float({ noNaN: true }),
        fc.float({ noNaN: true }),
        (a, b, c) => {
          const [min, mid, max] = [a, b, c].sort((x, y) => x - y);
          if (min === mid || mid === max) return; // skip degenerate cases
          for (const inclusive of ['both', 'min', 'max', 'none'] as const) {
            expect(inRange(mid, min, max, { inclusive })).toBe(true);
          }
        }
      )
    );
  });

  it('value outside range is always false for all inclusive modes', () => {
    fc.assert(
      fc.property(
        fc.integer({ min: -100, max: 100 }),
        fc.integer({ min: -100, max: 100 }),
        (min, max) => {
          if (min >= max) return;
          const outside = max + 1;
          for (const inclusive of ['both', 'min', 'max', 'none'] as const) {
            expect(inRange(outside, min, max, { inclusive })).toBe(false);
          }
        }
      )
    );
  });
});
