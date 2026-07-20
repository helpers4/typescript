/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { hasValue } from './hasValue';

describe('hasValue — property-based', () => {
  it('matches Array.from(map.values()).includes(...)', () => {
    fc.assert(
      fc.property(fc.array(fc.tuple(fc.string(), fc.integer())), fc.integer(), (entries, needle) => {
        const map = new Map(entries);
        expect(hasValue(map, needle)).toBe([...map.values()].includes(needle));
      }),
    );
  });
});

describe('hasValue — contract', () => {
  it('empty map never has any value', () => {
    expect(hasValue(new Map(), 'anything')).toBe(false);
  });
});
