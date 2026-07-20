/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { median } from './median';

describe('median — property-based', () => {
  it('is always between the min and max of the array', () => {
    fc.assert(
      fc.property(fc.array(fc.integer(), { minLength: 1 }), (arr) => {
        const m = median(arr);
        expect(m).toBeGreaterThanOrEqual(Math.min(...arr));
        expect(m).toBeLessThanOrEqual(Math.max(...arr));
      }),
    );
  });

  it('does not mutate the input', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (arr) => {
        const copy = [...arr];
        median(arr);
        expect(arr).toEqual(copy);
      }),
    );
  });
});

describe('median — contract', () => {
  it('empty array returns NaN', () => {
    expect(median([])).toBeNaN();
  });
});
