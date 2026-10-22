/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isDefined } from './isDefined';

describe('isDefined', () => {
  it('should return true for zero', () => {
    expect(isDefined(0)).toBe(true);
  });

  it('should return true for empty string', () => {
    expect(isDefined('')).toBe(true);
  });

  it('should return true for false', () => {
    expect(isDefined(false)).toBe(true);
  });

  it('should return true for objects and arrays', () => {
    expect(isDefined({})).toBe(true);
    expect(isDefined([])).toBe(true);
  });

  it('should return true for NaN', () => {
    expect(isDefined(NaN)).toBe(true);
  });

  it('should return false for null', () => {
    expect(isDefined(null)).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(isDefined(undefined)).toBe(false);
  });

  it('should narrow types when used with filter', () => {
    const items: (string | null | undefined)[] = ['a', null, 'b', undefined];
    const result = items.filter(isDefined);
    expect(result).toEqual(['a', 'b']);
  });
});
