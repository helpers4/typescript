/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { isNonEmpty } from './isNonEmpty';

describe('isNonEmpty — property-based', () => {
  it('is always true for strings with at least one character', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (s) => {
        expect(isNonEmpty(s)).toBe(true);
      }),
    );
  });

  it('is always false for the empty string', () => {
    expect(isNonEmpty('')).toBe(false);
  });
});

describe('isNonEmpty — contracts', () => {
  it('is equivalent to s.length > 0', () => {
    fc.assert(
      fc.property(fc.string(), (s) => {
        expect(isNonEmpty(s)).toBe(s.length > 0);
      }),
    );
  });

  it('narrows string | null | undefined to string in the truthy branch', () => {
    const value: string | null | undefined = 'hello';
    if (isNonEmpty(value)) {
      expect(value.toLowerCase()).toBe('hello');
    }
  });
});
