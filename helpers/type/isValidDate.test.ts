/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isValidDate } from './isValidDate';

describe('isValidDate', () => {
  it('should return true for valid Date instances', () => {
    expect(isValidDate(new Date())).toBe(true);
    expect(isValidDate(new Date('2023-01-01'))).toBe(true);
    expect(isValidDate(new Date(0))).toBe(true);
  });

  it('should return false for invalid Date instances', () => {
    expect(isValidDate(new Date('invalid'))).toBe(false);
    expect(isValidDate(new Date(NaN))).toBe(false);
  });

  it('should return false for non-Date values', () => {
    expect(isValidDate('2023-01-01')).toBe(false);
    expect(isValidDate(1609459200000)).toBe(false);
    expect(isValidDate(null)).toBe(false);
    expect(isValidDate(undefined)).toBe(false);
    expect(isValidDate({})).toBe(false);
  });
});
