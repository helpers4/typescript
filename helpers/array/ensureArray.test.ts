/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { ensureArray } from './ensureArray';

describe('ensureArray', () => {
  it('should wrap a single value in an array', () => {
    expect(ensureArray('hello')).toEqual(['hello']);
  });

  it('should wrap a number in an array', () => {
    expect(ensureArray(42)).toEqual([42]);
  });

  it('should return the array as-is if already an array', () => {
    const arr = [1, 2, 3];
    expect(ensureArray(arr)).toBe(arr);
  });

  it('should return empty array for null', () => {
    expect(ensureArray(null)).toEqual([]);
  });

  it('should return empty array for undefined', () => {
    expect(ensureArray(undefined)).toEqual([]);
  });

  it('should wrap an object in an array', () => {
    const obj = { name: 'Alice' };
    expect(ensureArray(obj)).toEqual([{ name: 'Alice' }]);
  });

  it('should keep an empty array as-is', () => {
    const arr: number[] = [];
    expect(ensureArray(arr)).toBe(arr);
  });

  it('should wrap false in an array', () => {
    expect(ensureArray(false)).toEqual([false]);
  });

  it('should wrap 0 in an array', () => {
    expect(ensureArray(0)).toEqual([0]);
  });

  it('should wrap empty string in an array', () => {
    expect(ensureArray('')).toEqual(['']);
  });

  it('should flatten to depth 1 when depth is provided', () => {
    expect(ensureArray([[1, [2, 3]], [4]], 1)).toEqual([1, [2, 3], 4]);
  });

  it('should flatten to depth Infinity', () => {
    expect(ensureArray([[1, [2, [3, [4]]]]], Infinity)).toEqual([1, 2, 3, 4]);
  });

  it('should not flatten when depth is 0', () => {
    expect(ensureArray([[1, 2], [3]], 0)).toEqual([[1, 2], [3]]);
  });

  it('should flatten a single value wrapped in arrays', () => {
    expect(ensureArray([[[42]]], 2)).toEqual([42]);
  });

  it('should not flatten when depth is not provided', () => {
    expect(ensureArray([[1, 2], [3]])).toEqual([[1, 2], [3]]);
  });

  it('should return empty array for null even with depth', () => {
    expect(ensureArray(null, 1)).toEqual([]);
  });
});
