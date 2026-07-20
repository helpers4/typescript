/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { reduce } from './reduce';

describe('reduce — property-based', () => {
  it('summing values equals summing Array.from(map.values())', () => {
    fc.assert(
      fc.property(fc.array(fc.tuple(fc.string(), fc.integer())), (entries) => {
        const map = new Map(entries);
        const viaReduce = reduce(map, (acc, v) => acc + v, 0);
        const viaArray = [...map.values()].reduce((acc, v) => acc + v, 0);
        expect(viaReduce).toBe(viaArray);
      }),
    );
  });
});

describe('reduce — contract', () => {
  it('empty map returns the initial value unchanged', () => {
    expect(reduce(new Map(), () => { throw new Error('never called'); }, 'seed')).toBe('seed');
  });
});
