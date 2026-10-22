/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { toMapByKey } from './toMapByKey';

describe('toMapByKey — property-based', () => {
  it('result size never exceeds the input size', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (values) => {
        const set = new Set(values);
        expect(toMapByKey(set, (n) => n % 5).size).toBeLessThanOrEqual(set.size);
      }),
    );
  });
});

describe('toMapByKey — contract', () => {
  it('empty set returns an empty map', () => {
    expect(toMapByKey(new Set<never>(), (x) => x)).toEqual(new Map());
  });
});
