/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { camelCaseKeys } from './camelCaseKeys';

describe('camelCaseKeys — property-based', () => {
  it('never produces more keys than the input (collisions can only shrink it)', () => {
    fc.assert(
      fc.property(fc.dictionary(fc.string({ minLength: 1 }).filter((s) => /[a-z]/i.test(s)), fc.integer()), (obj) => {
        const result = camelCaseKeys(obj);
        expect(Object.keys(result).length).toBeLessThanOrEqual(Object.keys(obj).length);
      }),
    );
  });

  it('is idempotent on already-camelCase keys', () => {
    fc.assert(
      fc.property(fc.dictionary(fc.constantFrom('fooBar', 'baz', 'quxQuux'), fc.integer()), (obj) => {
        expect(camelCaseKeys(obj)).toEqual(obj);
      }),
    );
  });
});

describe('camelCaseKeys — contract', () => {
  it('empty object stays empty', () => {
    expect(camelCaseKeys({})).toEqual({});
  });

  it('primitives pass through unchanged', () => {
    expect(camelCaseKeys(42)).toBe(42);
    expect(camelCaseKeys('str')).toBe('str');
    expect(camelCaseKeys(null)).toBe(null);
  });
});
