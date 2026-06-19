/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { mean } from './mean';

describe('mean — property-based', () => {
  it('mean([x]) === x for any number', () => {
    fc.assert(
      fc.property(fc.float({ noNaN: true, noDefaultInfinity: true }).filter(x => !Object.is(x, -0)), (x) => {
        expect(mean([x])).toBe(x);
      })
    );
  });

  it('result is between min and max for any non-empty array', () => {
    fc.assert(
      fc.property(
        fc.array(fc.float({ noNaN: true, noDefaultInfinity: true }), { minLength: 1 }),
        (arr) => {
          const result = mean(arr);
          expect(result).toBeGreaterThanOrEqual(Math.min(...arr));
          expect(result).toBeLessThanOrEqual(Math.max(...arr));
        }
      )
    );
  });
});
