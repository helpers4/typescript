/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { titleCaseKeys } from './titleCaseKeys';

describe('titleCaseKeys — property-based', () => {
  it('never produces more keys than the input (collisions can only shrink it)', () => {
    fc.assert(
      fc.property(fc.dictionary(fc.string({ minLength: 1 }).filter((s) => /[a-z]/i.test(s)), fc.integer()), (obj) => {
        const result = titleCaseKeys(obj);
        expect(Object.keys(result).length).toBeLessThanOrEqual(Object.keys(obj).length);
      }),
    );
  });
});

describe('titleCaseKeys — contract', () => {
  it('empty object stays empty', () => {
    expect(titleCaseKeys({})).toEqual({});
  });

  it('primitives pass through unchanged', () => {
    expect(titleCaseKeys(42)).toBe(42);
    expect(titleCaseKeys(null)).toBe(null);
  });
});
