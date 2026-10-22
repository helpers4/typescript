/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { isLength } from './isLength';

describe('isLength — property-based', () => {
  it('is true for any non-negative safe integer', () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: Number.MAX_SAFE_INTEGER }), (n) => {
        expect(isLength(n)).toBe(true);
      }),
    );
  });

  it('is false for any negative integer', () => {
    fc.assert(
      fc.property(fc.integer({ max: -1 }), (n) => {
        expect(isLength(n)).toBe(false);
      }),
    );
  });

  it('is false for any non-number value', () => {
    fc.assert(
      fc.property(
        fc.oneof(fc.string(), fc.boolean(), fc.constant(null), fc.constant(undefined)),
        (value) => {
          expect(isLength(value)).toBe(false);
        },
      ),
    );
  });
});

describe('isLength — contract', () => {
  it('boundary: MAX_SAFE_INTEGER is valid, one more is not', () => {
    expect(isLength(Number.MAX_SAFE_INTEGER)).toBe(true);
    expect(isLength(Number.MAX_SAFE_INTEGER + 2)).toBe(false);
  });
});
