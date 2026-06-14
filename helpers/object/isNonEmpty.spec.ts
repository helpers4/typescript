/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { isNonEmpty } from './isNonEmpty';

describe('isNonEmpty — property-based', () => {
  it('is always true for objects with at least one string key', () => {
    fc.assert(
      fc.property(
        fc.record({ key: fc.string() }, { requiredKeys: ['key'] }),
        (obj) => {
          expect(isNonEmpty(obj)).toBe(true);
        },
      ),
    );
  });

  it('is always false for objects with no string keys', () => {
    expect(isNonEmpty({})).toBe(false);
  });
});

describe('isNonEmpty — contracts', () => {
  it('is equivalent to Object.keys(value).length > 0', () => {
    fc.assert(
      fc.property(fc.dictionary(fc.string(), fc.anything()), (obj) => {
        expect(isNonEmpty(obj)).toBe(Object.keys(obj).length > 0);
      }),
    );
  });
});
