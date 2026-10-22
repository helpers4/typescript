/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { findKey } from './findKey';

describe('findKey — property-based', () => {
  it('the returned key, when present, maps to a value that matches', () => {
    fc.assert(
      fc.property(fc.array(fc.tuple(fc.string(), fc.integer())), (entries) => {
        const map = new Map(entries);
        const key = findKey(map, (v) => v > 0);
        if (key !== undefined) {
          expect(map.get(key)! > 0).toBe(true);
        }
      }),
    );
  });
});

describe('findKey — contract', () => {
  it('empty map returns undefined', () => {
    expect(findKey(new Map(), () => true)).toBeUndefined();
  });
});
