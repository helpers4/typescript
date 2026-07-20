/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { toMapByKey } from './toMapByKey';

describe('toMapByKey — property-based', () => {
  it('result size never exceeds the input length', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (items) => {
        const result = toMapByKey(items, (n) => n % 5);
        expect(result.size).toBeLessThanOrEqual(items.length);
      }),
    );
  });

  it('every value in the result was present in the input', () => {
    fc.assert(
      fc.property(fc.array(fc.integer(), { minLength: 1 }), (items) => {
        const result = toMapByKey(items, (n) => n);
        for (const value of result.values()) {
          expect(items).toContain(value);
        }
      }),
    );
  });
});

describe('toMapByKey — contract', () => {
  it('empty input returns an empty map', () => {
    expect(toMapByKey([], (x: never) => x)).toEqual(new Map());
  });
});
