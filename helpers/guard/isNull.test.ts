/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isNull } from './isNull';

describe('isNull', () => {
  it('should return true for null', () => {
    expect(isNull(null)).toBe(true);
  });

  it('should return false for undefined', () => {
    expect(isNull(undefined)).toBe(false);
  });

  it('should return false for falsy values', () => {
    expect(isNull(0)).toBe(false);
    expect(isNull('')).toBe(false);
    expect(isNull(false)).toBe(false);
    expect(isNull(NaN)).toBe(false);
  });

  it('should return false for objects', () => {
    expect(isNull({})).toBe(false);
    expect(isNull([])).toBe(false);
  });
});
