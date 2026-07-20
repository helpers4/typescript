/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { map } from './map';

describe('map — property-based', () => {
  it('result size never exceeds the input size (duplicates can only shrink it)', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (values) => {
        const set = new Set(values);
        expect(map(set, (v) => v % 5).size).toBeLessThanOrEqual(set.size);
      }),
    );
  });

  it('identity transform preserves the set', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (values) => {
        const set = new Set(values);
        expect(map(set, (v) => v)).toEqual(set);
      }),
    );
  });
});

describe('map — contract', () => {
  it('empty set returns an empty set', () => {
    expect(map(new Set<number>(), (v) => v)).toEqual(new Set());
  });
});
