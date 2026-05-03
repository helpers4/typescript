/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { zip } from './zip';

describe('zip', () => {
  it('zips two arrays of equal length', () => {
    expect(zip([1, 2, 3], ['a', 'b', 'c'])).toEqual([[1, 'a'], [2, 'b'], [3, 'c']]);
  });

  it('truncates to the shorter array', () => {
    expect(zip([1, 2], ['a', 'b', 'c'])).toEqual([[1, 'a'], [2, 'b']]);
    expect(zip([1, 2, 3], ['a'])).toEqual([[1, 'a']]);
  });

  it('returns empty array when any input is empty', () => {
    expect(zip([], ['a', 'b'])).toEqual([]);
    expect(zip([1, 2], [])).toEqual([]);
    expect(zip([], [])).toEqual([]);
  });

  it('zips three arrays', () => {
    expect(zip([1, 2], ['a', 'b'], [true, false])).toEqual([
      [1, 'a', true],
      [2, 'b', false],
    ]);
  });

  it('works with readonly arrays', () => {
    const a = [1, 2] as const;
    const b = ['x', 'y'] as const;
    expect(zip(a, b)).toEqual([[1, 'x'], [2, 'y']]);
  });

  it('returns empty array when called with no arrays', () => {
    const impl = zip as (...arrays: readonly (readonly unknown[])[]) => unknown[][];
    expect(impl()).toEqual([]);
  });
});
