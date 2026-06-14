/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { isEmpty } from './isEmpty';

describe('isEmpty — property-based', () => {
  it('is always false for arrays with at least one element', () => {
    fc.assert(
      fc.property(fc.array(fc.anything(), { minLength: 1 }), (arr) => {
        expect(isEmpty(arr)).toBe(false);
      }),
    );
  });
});

describe('isEmpty — contracts', () => {
  it('isEmpty and isNonEmpty are logical inverses', async () => {
    const { isNonEmpty } = await import('./isNonEmpty');
    fc.assert(
      fc.property(fc.array(fc.anything()), (arr) => {
        expect(isEmpty(arr)).toBe(!isNonEmpty(arr));
      }),
    );
  });
});
