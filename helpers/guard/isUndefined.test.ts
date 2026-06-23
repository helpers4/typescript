/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isUndefined } from './isUndefined';

describe('isUndefined', () => {
  it('should return true for undefined', () => {
    expect(isUndefined(undefined)).toBe(true);
  });

  it('should return false for null', () => {
    expect(isUndefined(null)).toBe(false);
  });

  it('should return false for falsy values', () => {
    expect(isUndefined(0)).toBe(false);
    expect(isUndefined('')).toBe(false);
    expect(isUndefined(false)).toBe(false);
    expect(isUndefined(NaN)).toBe(false);
  });

  it('should return false for objects', () => {
    expect(isUndefined({})).toBe(false);
    expect(isUndefined([])).toBe(false);
  });
});
