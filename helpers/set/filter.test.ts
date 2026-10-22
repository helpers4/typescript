/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { filter } from './filter';

describe('filter', () => {
  it('keeps only values matching the predicate', () => {
    expect(filter(new Set([1, 2, 3, 4]), (v) => v % 2 === 0)).toEqual(new Set([2, 4]));
  });

  it('returns an empty set when nothing matches', () => {
    expect(filter(new Set([1]), () => false)).toEqual(new Set());
  });

  it('returns all values when everything matches', () => {
    const set = new Set([1, 2]);
    expect(filter(set, () => true)).toEqual(set);
  });

  it('does not mutate the original set', () => {
    const set = new Set([1, 2]);
    filter(set, (v) => v > 1);
    expect(set.size).toBe(2);
  });
});
