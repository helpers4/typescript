/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { sum } from './sum';

describe('sum', () => {
  it('should sum an array of numbers', () => {
    expect(sum([1, 2, 3, 4])).toBe(10);
  });

  it('should return 0 for empty array', () => {
    expect(sum([])).toBe(0);
  });

  it('should handle negative numbers', () => {
    expect(sum([1, -2, 3, -4])).toBe(-2);
  });

  it('should handle single element', () => {
    expect(sum([42])).toBe(42);
  });

  it('should handle decimals', () => {
    expect(sum([0.1, 0.2, 0.3])).toBeCloseTo(0.6);
  });

  it('should handle zeros', () => {
    expect(sum([0, 0, 0])).toBe(0);
  });

  it('should handle large arrays', () => {
    expect(sum([100, 200, 300, 400, 500])).toBe(1500);
  });
});
