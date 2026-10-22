/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { sortKeys } from './sortKeys';

describe('sortKeys', () => {
  it('sorts keys alphabetically by default', () => {
    expect(Object.keys(sortKeys({ b: 2, a: 1, c: 3 }))).toEqual(['a', 'b', 'c']);
  });

  it('preserves the values for each key', () => {
    expect(sortKeys({ b: 2, a: 1 })).toEqual({ a: 1, b: 2 });
  });

  it('accepts a custom comparator', () => {
    expect(Object.keys(sortKeys({ a: 1, b: 2, c: 3 }, (a, b) => b.localeCompare(a)))).toEqual(['c', 'b', 'a']);
  });

  it('is shallow — nested object keys are not re-sorted', () => {
    const result = sortKeys({ b: { z: 1, y: 2 }, a: 1 });
    expect(Object.keys(result.b)).toEqual(['z', 'y']);
  });

  it('handles an empty object', () => {
    expect(sortKeys({})).toEqual({});
  });

  it('does not mutate the input', () => {
    const input = { b: 2, a: 1 };
    sortKeys(input);
    expect(Object.keys(input)).toEqual(['b', 'a']);
  });

  it('skips a dangerous key (__proto__, via JSON.parse)', () => {
    const obj = JSON.parse('{"__proto__": 1, "a": 2}') as Record<string, number>;
    expect(sortKeys(obj)).toEqual({ a: 2 });
  });

  it('skips a dangerous key (constructor)', () => {
    expect(sortKeys({ constructor: 1, a: 2 })).toEqual({ a: 2 });
  });
});
