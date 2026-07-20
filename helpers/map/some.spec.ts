/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { some } from './some';

describe('some — property-based', () => {
  it('matches Array.from(map.values()).some(...)', () => {
    fc.assert(
      fc.property(fc.array(fc.tuple(fc.string(), fc.integer())), (entries) => {
        const map = new Map(entries);
        expect(some(map, (v) => v > 0)).toBe([...map.values()].some((v) => v > 0));
      }),
    );
  });
});

describe('some — contract', () => {
  it('empty map is always false', () => {
    expect(some(new Map(), () => true)).toBe(false);
  });
});
