/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { toggle } from './toggle';

describe('toggle — property-based', () => {
  it('toggling twice returns an array with the same elements as the original', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), fc.integer(), (arr, item) => {
        const twice = toggle(toggle(arr, item), item);
        expect(twice.sort()).toEqual(arr.sort());
      }),
    );
  });

  it('result length changes by exactly one', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), fc.integer(), (arr, item) => {
        const result = toggle(arr, item);
        expect(Math.abs(result.length - arr.length)).toBe(1);
      }),
    );
  });

  it('never mutates the input array', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), fc.integer(), (arr, item) => {
        const copy = [...arr];
        toggle(arr, item);
        expect(arr).toEqual(copy);
      }),
    );
  });
});
