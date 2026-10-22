/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { omit } from './omit';

describe('omit — property-based', () => {
  it('result has none of the omitted keys', () => {
    fc.assert(
      fc.property(
        fc.record({ a: fc.integer(), b: fc.string(), c: fc.boolean() }),
        fc.subarray(['a', 'b', 'c'] as const),
        (obj, keys) => {
          const result = omit(obj, keys as (keyof typeof obj)[]);
          for (const key of keys) {
            expect(key in result).toBe(false);
          }
        }
      )
    );
  });

  it('all non-omitted keys are preserved', () => {
    fc.assert(
      fc.property(
        fc.record({ a: fc.integer(), b: fc.string(), c: fc.boolean() }),
        fc.subarray(['a', 'b', 'c'] as const),
        (obj, omittedKeys) => {
          const result = omit(obj, omittedKeys as (keyof typeof obj)[]);
          const remainingKeys = Object.keys(obj).filter(
            (k) => !omittedKeys.includes(k as 'a' | 'b' | 'c')
          );
          for (const key of remainingKeys) {
            expect((result as Record<string, unknown>)[key]).toBe(
              (obj as Record<string, unknown>)[key]
            );
          }
        }
      )
    );
  });

  it('result is a new object (not same reference)', () => {
    fc.assert(
      fc.property(fc.record({ a: fc.integer() }), (obj) => {
        const result = omit(obj, []);
        expect(result).not.toBe(obj);
      })
    );
  });
});

describe('omit — contract', () => {
  it('omit({a:1,b:2}, ["b"]) → {a:1}', () => {
    expect(omit({ a: 1, b: 2 }, ['b'])).toEqual({ a: 1 });
  });

  it('omit({a:1}, []) → {a:1}', () => {
    expect(omit({ a: 1 }, [])).toEqual({ a: 1 });
  });

  it('omit({}, ["a"]) → {}', () => {
    expect(omit({} as Record<string, unknown>, ['a'])).toEqual({});
  });

  it('undefined → undefined', () => {
    expect(omit(undefined, ['a'])).toBeUndefined();
  });

  it('null → null', () => {
    expect(omit(null, ['a'])).toBeNull();
  });

  it('omit all keys → {}', () => {
    expect(omit({ a: 1, b: 2 }, ['a', 'b'])).toEqual({});
  });
});
