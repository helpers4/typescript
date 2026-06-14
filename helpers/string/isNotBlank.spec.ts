/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { isNotBlank } from './isNotBlank';

describe('isNotBlank — property-based', () => {
  it('is always true for strings containing at least one non-whitespace character', () => {
    fc.assert(
      fc.property(
        fc.string({ minLength: 1 }).filter((s) => s.trim().length > 0),
        (s) => {
          expect(isNotBlank(s)).toBe(true);
        },
      ),
    );
  });
});

describe('isNotBlank — contracts', () => {
  it('is equivalent to value.trim() !== ""', () => {
    fc.assert(
      fc.property(fc.string(), (s) => {
        expect(isNotBlank(s)).toBe(s.trim() !== '');
      }),
    );
  });
});
