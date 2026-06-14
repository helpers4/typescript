/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { isEmpty } from './isEmpty';

describe('isEmpty — property-based', () => {
  it('is always false for objects with at least one string key', () => {
    fc.assert(
      fc.property(
        fc.record({ key: fc.string() }, { requiredKeys: ['key'] }),
        (obj) => {
          expect(isEmpty(obj)).toBe(false);
        },
      ),
    );
  });
});

describe('isEmpty — contracts', () => {
  it('isEmpty and isNonEmpty are logical inverses', async () => {
    const { isNonEmpty } = await import('./isNonEmpty');
    fc.assert(
      fc.property(fc.dictionary(fc.string(), fc.anything()), (obj) => {
        expect(isEmpty(obj)).toBe(!isNonEmpty(obj));
      }),
    );
  });

  it('is equivalent to Object.keys(value).length === 0', () => {
    fc.assert(
      fc.property(fc.dictionary(fc.string(), fc.anything()), (obj) => {
        expect(isEmpty(obj)).toBe(Object.keys(obj).length === 0);
      }),
    );
  });
});
