/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { range } from './range';

describe('range', () => {
  it('should generate range from 0 to n with single argument', () => {
    expect(range(5)).toEqual([0, 1, 2, 3, 4]);
  });

  it('should generate range from start to end', () => {
    expect(range(1, 5)).toEqual([1, 2, 3, 4]);
  });

  it('should generate range with custom step', () => {
    expect(range(0, 10, 2)).toEqual([0, 2, 4, 6, 8]);
  });

  it('should generate descending range', () => {
    expect(range(5, 0)).toEqual([5, 4, 3, 2, 1]);
  });

  it('should generate descending range with negative step', () => {
    expect(range(10, 0, -3)).toEqual([10, 7, 4, 1]);
  });

  it('should return empty array for range(0)', () => {
    expect(range(0)).toEqual([]);
  });

  it('should return empty array for step 0', () => {
    expect(range(1, 5, 0)).toEqual([]);
  });

  it('should return empty array for wrong direction step', () => {
    expect(range(0, 5, -1)).toEqual([]);
    expect(range(5, 0, 1)).toEqual([]);
  });

  it('should handle negative start/end', () => {
    expect(range(-3, 3)).toEqual([-3, -2, -1, 0, 1, 2]);
  });

  it('should handle single negative argument', () => {
    expect(range(-5)).toEqual([0, -1, -2, -3, -4]);
  });

  it('should handle equal start and end', () => {
    expect(range(3, 3)).toEqual([]);
  });

  it('should work with decimal step', () => {
    const result = range(0, 1, 0.25);
    expect(result).toEqual([0, 0.25, 0.5, 0.75]);
  });
});
