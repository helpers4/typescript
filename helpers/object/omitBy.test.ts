/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { omitBy } from './omitBy';

describe('omitBy', () => {
  it('removes entries matching the predicate', () => {
    expect(omitBy({ a: 1, b: undefined, c: 2 }, (value) => value === undefined)).toEqual({ a: 1, c: 2 });
  });

  it('returns a full copy when nothing matches', () => {
    expect(omitBy({ a: 1, b: 2 }, () => false)).toEqual({ a: 1, b: 2 });
  });

  it('returns an empty object when everything matches', () => {
    expect(omitBy({ a: 1, b: 2 }, () => true)).toEqual({});
  });

  it('passes both value and key to the predicate', () => {
    const seen: [unknown, string][] = [];
    omitBy({ a: 1, b: 2 }, (value, key) => {
      seen.push([value, key]);
      return false;
    });
    expect(seen).toEqual([[1, 'a'], [2, 'b']]);
  });

  it('does not mutate the original object', () => {
    const obj = { a: 1, b: 2 };
    omitBy(obj, (value) => value > 1);
    expect(obj).toEqual({ a: 1, b: 2 });
  });

  it('returns null when given null', () => {
    expect(omitBy(null, () => true)).toBeNull();
  });

  it('returns undefined when given undefined', () => {
    expect(omitBy(undefined, () => true)).toBeUndefined();
  });
});
