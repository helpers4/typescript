/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { pickBy } from './pickBy';

describe('pickBy', () => {
  it('keeps only entries matching the predicate', () => {
    expect(pickBy({ a: 1, b: 0, c: 2 }, (value) => value > 0)).toEqual({ a: 1, c: 2 });
  });

  it('returns an empty object when nothing matches', () => {
    expect(pickBy({ a: 1, b: 2 }, () => false)).toEqual({});
  });

  it('returns a full copy when everything matches', () => {
    expect(pickBy({ a: 1, b: 2 }, () => true)).toEqual({ a: 1, b: 2 });
  });

  it('passes both value and key to the predicate', () => {
    const seen: [unknown, string][] = [];
    pickBy({ a: 1, b: 2 }, (value, key) => {
      seen.push([value, key]);
      return true;
    });
    expect(seen).toEqual([[1, 'a'], [2, 'b']]);
  });

  it('does not mutate the original object', () => {
    const obj = { a: 1, b: 2 };
    pickBy(obj, (value) => value > 1);
    expect(obj).toEqual({ a: 1, b: 2 });
  });

  it('returns null when given null', () => {
    expect(pickBy(null, () => true)).toBeNull();
  });

  it('returns undefined when given undefined', () => {
    expect(pickBy(undefined, () => true)).toBeUndefined();
  });

  it('skips prototype-polluting keys', () => {
    const malicious = JSON.parse('{"a":1,"__proto__":{"polluted":"yes"}}');
    const result = pickBy(malicious as Record<string, unknown>, () => true);
    expect(result).toEqual({ a: 1 });
    expect(Object.getPrototypeOf(result)).toBe(Object.prototype);
  });
});
