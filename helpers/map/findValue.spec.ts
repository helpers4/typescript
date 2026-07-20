/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { findValue } from './findValue';

describe('findValue — property-based', () => {
  it('the returned value, when present, satisfies the predicate', () => {
    fc.assert(
      fc.property(fc.array(fc.tuple(fc.string(), fc.integer())), (entries) => {
        const map = new Map(entries);
        const value = findValue(map, (v) => v > 0);
        if (value !== undefined) {
          expect(value > 0).toBe(true);
        }
      }),
    );
  });
});

describe('findValue — contract', () => {
  it('empty map returns undefined', () => {
    expect(findValue(new Map(), () => true)).toBeUndefined();
  });
});
