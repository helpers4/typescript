/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { snakeCaseKeys } from './snakeCaseKeys';

describe('snakeCaseKeys — property-based', () => {
  it('never produces more keys than the input (collisions can only shrink it)', () => {
    fc.assert(
      fc.property(fc.dictionary(fc.string({ minLength: 1 }).filter((s) => /[a-z]/i.test(s)), fc.integer()), (obj) => {
        const result = snakeCaseKeys(obj);
        expect(Object.keys(result).length).toBeLessThanOrEqual(Object.keys(obj).length);
      }),
    );
  });

  it('is idempotent on already-snake_case keys', () => {
    fc.assert(
      fc.property(fc.dictionary(fc.constantFrom('foo_bar', 'baz', 'qux_quux'), fc.integer()), (obj) => {
        expect(snakeCaseKeys(obj)).toEqual(obj);
      }),
    );
  });
});

describe('snakeCaseKeys — contract', () => {
  it('empty object stays empty', () => {
    expect(snakeCaseKeys({})).toEqual({});
  });

  it('primitives pass through unchanged', () => {
    expect(snakeCaseKeys(42)).toBe(42);
    expect(snakeCaseKeys(null)).toBe(null);
  });
});
