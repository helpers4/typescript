/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { replaceOrAppend } from './replaceOrAppend';

describe('replaceOrAppend — property-based', () => {
  it('the result always contains the item', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), fc.integer(), (arr, item) => {
        const result = replaceOrAppend(arr, item, (x) => x === item);
        expect(result).toContain(item);
      }),
    );
  });

  it('when nothing matches, the length grows by exactly one', () => {
    fc.assert(
      fc.property(fc.array(fc.integer({ min: 0, max: 100 })), fc.integer({ min: 1000, max: 2000 }), (arr, item) => {
        const result = replaceOrAppend(arr, item, (x) => x === item);
        expect(result.length).toBe(arr.length + 1);
      }),
    );
  });

  it('when something matches, the length is unchanged', () => {
    fc.assert(
      fc.property(fc.array(fc.integer(), { minLength: 1 }), (arr) => {
        const target = arr[0]!;
        const result = replaceOrAppend(arr, target, (x) => x === target);
        expect(result.length).toBe(arr.length);
      }),
    );
  });
});
