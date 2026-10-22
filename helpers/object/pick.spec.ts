/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { pick } from './pick';

describe('pick — property-based', () => {
  it('result only has keys from the keys array that exist on obj', () => {
    fc.assert(
      fc.property(
        fc.record({ a: fc.integer(), b: fc.string(), c: fc.boolean() }),
        fc.subarray(['a', 'b', 'c'] as const),
        (obj, keys) => {
          const result = pick(obj, keys as (keyof typeof obj)[]);
          for (const key of Object.keys(result)) {
            expect(keys).toContain(key);
          }
        }
      )
    );
  });

  it('pick(obj, Object.keys(obj)) deep-equals obj', () => {
    fc.assert(
      fc.property(
        fc.record({ a: fc.integer(), b: fc.string() }),
        (obj) => {
          const result = pick(obj, Object.keys(obj) as (keyof typeof obj)[]);
          expect(result).toEqual(obj);
        }
      )
    );
  });
});

describe('pick — contract', () => {
  it('pick({a:1,b:2}, ["a"]) → {a:1}', () => {
    expect(pick({ a: 1, b: 2 }, ['a'])).toEqual({ a: 1 });
  });

  it('pick({a:1}, ["b"]) → {} (key not present)', () => {
    expect(pick({ a: 1 } as Record<string, unknown>, ['b'])).toEqual({});
  });

  it('undefined → undefined', () => {
    expect(pick(undefined, ['a'])).toBeUndefined();
  });

  it('null → null', () => {
    expect(pick(null, ['a'])).toBeNull();
  });

  it('does not pick inherited keys (uses hasOwnProperty)', () => {
    const proto = { inherited: 99 };
    const obj = Object.create(proto) as Record<string, unknown>;
    obj.own = 1;
    expect(pick(obj, ['inherited'])).toEqual({});
  });

  it('pick with empty keys array → {}', () => {
    expect(pick({ a: 1, b: 2 }, [])).toEqual({});
  });
});
