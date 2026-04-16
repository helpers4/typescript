/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { compact } from './compact';

describe('compact — property-based', () => {
  it('result contains only truthy values', () => {
    fc.assert(
      fc.property(fc.array(fc.oneof(fc.integer(), fc.string(), fc.boolean(), fc.constant(null), fc.constant(undefined))), (arr) => {
        const result = compact(arr);
        return result.every((v) => Boolean(v));
      }),
    );
  });

  it('result length is <= input length', () => {
    fc.assert(
      fc.property(fc.array(fc.oneof(fc.integer(), fc.string(), fc.constant(null), fc.constant(undefined), fc.boolean())), (arr) => {
        expect(compact(arr).length).toBeLessThanOrEqual(arr.length);
      }),
    );
  });

  it('all items in result pass Boolean test', () => {
    fc.assert(
      fc.property(fc.array(fc.oneof(fc.integer({ min: 1 }), fc.string({ minLength: 1 }), fc.constant(true))), (arr) => {
        expect(compact(arr)).toEqual(arr);
      }),
    );
  });
});

describe('compact — contract', () => {
  it('removes all falsy values', () => {
    expect(compact([0, '', false, null, undefined, Number.NaN])).toEqual([]);
  });

  it('keeps all truthy values unchanged', () => {
    expect(compact([1, 'a', true])).toEqual([1, 'a', true]);
  });

  it('mixed array keeps only truthy', () => {
    expect(compact([1, null, 'hello', false, 0, 'world', undefined])).toEqual([1, 'hello', 'world']);
  });

  it('empty array returns []', () => {
    expect(compact([])).toEqual([]);
  });

  it('all truthy returns same values', () => {
    expect(compact([1, 2, 3])).toEqual([1, 2, 3]);
  });

  it('NaN is removed', () => {
    expect(compact([Number.NaN])).toEqual([]);
  });

  it('empty string is removed', () => {
    expect(compact([''])).toEqual([]);
  });
});
