/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isNullish } from './isNullish';

describe('isNullish', () => {
  it('should return true for null', () => {
    expect(isNullish(null)).toBe(true);
  });

  it('should return true for undefined', () => {
    expect(isNullish(undefined)).toBe(true);
  });

  it('should return false for 0', () => {
    expect(isNullish(0)).toBe(false);
  });

  it('should return false for empty string', () => {
    expect(isNullish('')).toBe(false);
  });

  it('should return false for false', () => {
    expect(isNullish(false)).toBe(false);
  });

  it('should return false for NaN', () => {
    expect(isNullish(NaN)).toBe(false);
  });

  it('should return false for objects', () => {
    expect(isNullish({})).toBe(false);
    expect(isNullish([])).toBe(false);
  });

  it('should return false for non-nullish values', () => {
    expect(isNullish(1)).toBe(false);
    expect(isNullish('hello')).toBe(false);
    expect(isNullish(true)).toBe(false);
  });
});
