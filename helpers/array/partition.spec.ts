/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import * as fc from 'fast-check';
import { describe, expect, it } from 'vitest';
import { partition } from './partition';

describe('partition — property-based', () => {
  it('passing.concat(failing) has same length as input', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (arr) => {
        const [passing, failing] = partition(arr, (v) => v > 0);
        expect(passing.length + failing.length).toBe(arr.length);
      }),
    );
  });

  it('every passing item satisfies predicate', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (arr) => {
        const [passing] = partition(arr, (v) => v % 2 === 0);
        return passing.every((v) => v % 2 === 0);
      }),
    );
  });

  it('every failing item does NOT satisfy predicate', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (arr) => {
        const [, failing] = partition(arr, (v) => v % 2 === 0);
        return failing.every((v) => v % 2 !== 0);
      }),
    );
  });

  it('no items are lost or duplicated', () => {
    fc.assert(
      fc.property(fc.array(fc.integer()), (arr) => {
        const [passing, failing] = partition(arr, (v) => v > 0);
        const combined = [...passing, ...failing].sort((a, b) => a - b);
        const original = [...arr].sort((a, b) => a - b);
        expect(combined).toEqual(original);
      }),
    );
  });
});

describe('partition — contract', () => {
  it('all pass: failing is empty', () => {
    const [passing, failing] = partition([1, 2, 3], () => true);
    expect(passing).toEqual([1, 2, 3]);
    expect(failing).toEqual([]);
  });

  it('none pass: passing is empty', () => {
    const [passing, failing] = partition([1, 2, 3], () => false);
    expect(passing).toEqual([]);
    expect(failing).toEqual([1, 2, 3]);
  });

  it('empty array returns [[], []]', () => {
    const [passing, failing] = partition([], () => true);
    expect(passing).toEqual([]);
    expect(failing).toEqual([]);
  });

  it('mixed: splits correctly', () => {
    const [evens, odds] = partition([1, 2, 3, 4, 5], (v) => v % 2 === 0);
    expect(evens).toEqual([2, 4]);
    expect(odds).toEqual([1, 3, 5]);
  });
});
