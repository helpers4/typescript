/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isDate } from './isDate';

describe('isDate', () => {
  it('should return true for Date instances', () => {
    expect(isDate(new Date())).toBe(true);
    expect(isDate(new Date('2023-01-01'))).toBe(true);
  });

  it('should return true for invalid Date instances', () => {
    expect(isDate(new Date('invalid'))).toBe(true);
  });

  it('should return false for non-Date values', () => {
    expect(isDate('2023-01-01')).toBe(false);
    expect(isDate(1609459200000)).toBe(false);
    expect(isDate(null)).toBe(false);
    expect(isDate(undefined)).toBe(false);
    expect(isDate({})).toBe(false);
  });
});
