/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isValid } from './isValid';

describe('isValid', () => {
  it('should return true for valid Date instances', () => {
    expect(isValid(new Date())).toBe(true);
    expect(isValid(new Date('2023-01-01'))).toBe(true);
    expect(isValid(new Date(0))).toBe(true);
  });

  it('should return false for invalid Date instances', () => {
    expect(isValid(new Date('invalid'))).toBe(false);
    expect(isValid(new Date(NaN))).toBe(false);
  });

  it('should return false for non-Date values', () => {
    expect(isValid('2023-01-01')).toBe(false);
    expect(isValid(1609459200000)).toBe(false);
    expect(isValid(null)).toBe(false);
    expect(isValid(undefined)).toBe(false);
    expect(isValid({})).toBe(false);
  });
});
