/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { kebabCaseKeys } from './kebabCaseKeys';

describe('kebabCaseKeys — property-based', () => {
  it('never produces more keys than the input (collisions can only shrink it)', () => {
    fc.assert(
      fc.property(fc.dictionary(fc.string({ minLength: 1 }).filter((s) => /[a-z]/i.test(s)), fc.integer()), (obj) => {
        const result = kebabCaseKeys(obj);
        expect(Object.keys(result).length).toBeLessThanOrEqual(Object.keys(obj).length);
      }),
    );
  });

  it('is idempotent on already-kebab-case keys', () => {
    fc.assert(
      fc.property(fc.dictionary(fc.constantFrom('foo-bar', 'baz', 'qux-quux'), fc.integer()), (obj) => {
        expect(kebabCaseKeys(obj)).toEqual(obj);
      }),
    );
  });
});

describe('kebabCaseKeys — contract', () => {
  it('empty object stays empty', () => {
    expect(kebabCaseKeys({})).toEqual({});
  });

  it('primitives pass through unchanged', () => {
    expect(kebabCaseKeys(42)).toBe(42);
    expect(kebabCaseKeys(null)).toBe(null);
  });
});
