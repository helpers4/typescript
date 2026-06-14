/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { isEmpty } from './isEmpty';

describe('isEmpty — property-based', () => {
  it('is always false for non-empty strings', () => {
    fc.assert(
      fc.property(fc.string({ minLength: 1 }), (s) => {
        expect(isEmpty(s)).toBe(false);
      }),
    );
  });
});

describe('isEmpty — contracts', () => {
  it('isEmpty and isNonEmpty are logical inverses', async () => {
    const { isNonEmpty } = await import('./isNonEmpty');
    fc.assert(
      fc.property(fc.string(), (s) => {
        expect(isEmpty(s)).toBe(!isNonEmpty(s));
      }),
    );
  });

  it('is equivalent to s === ""', () => {
    fc.assert(
      fc.property(fc.string(), (s) => {
        expect(isEmpty(s)).toBe(s === '');
      }),
    );
  });
});
