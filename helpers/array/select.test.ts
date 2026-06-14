/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { select } from './select';

describe('select', () => {
  it('should filter and map in one pass', () => {
    expect(select([1, 2, 3, 4, 5], x => x * 2, x => x % 2 === 0)).toEqual([4, 8]);
  });

  it('should return all mapped values when no condition is given', () => {
    expect(select([1, 2, 3], x => x * 10)).toEqual([10, 20, 30]);
  });

  it('should return an empty array when no items pass the condition', () => {
    expect(select([1, 3, 5], x => x * 2, x => x % 2 === 0)).toEqual([]);
  });

  it('should return an empty array for an empty input', () => {
    expect(select([], x => x, () => true)).toEqual([]);
  });

  it('should pass the index to both mapper and condition', () => {
    const indices: number[] = [];
    select([10, 20, 30], (x, i) => { indices.push(i); return x; }, (_, i) => i < 2);
    expect(indices).toEqual([0, 1]);
  });

  it('should support mapping to a different type', () => {
    const result = select(
      [{ name: 'Alice', active: true }, { name: 'Bob', active: false }],
      u => u.name,
      u => u.active,
    );
    expect(result).toEqual(['Alice']);
  });

  it('should not call mapper for items that fail the condition', () => {
    let mapperCalls = 0;
    select([1, 2, 3], x => { mapperCalls++; return x; }, x => x > 2);
    expect(mapperCalls).toBe(1);
  });

  it('should work with readonly arrays', () => {
    const arr: readonly number[] = [1, 2, 3, 4];
    expect(select(arr, x => x * 2, x => x > 2)).toEqual([6, 8]);
  });
});
