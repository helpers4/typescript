/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isTruthy } from './isTruthy';

describe('isTruthy', () => {
  it('should return false for null', () => {
    expect(isTruthy(null)).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(isTruthy(undefined)).toBe(false);
  });

  it('should return false for 0', () => {
    expect(isTruthy(0)).toBe(false);
  });

  it('should return false for empty string', () => {
    expect(isTruthy('')).toBe(false);
  });

  it('should return false for false', () => {
    expect(isTruthy(false)).toBe(false);
  });

  it('should return false for NaN', () => {
    expect(isTruthy(NaN)).toBe(false);
  });

  it('should return true for truthy values', () => {
    expect(isTruthy(1)).toBe(true);
    expect(isTruthy('hello')).toBe(true);
    expect(isTruthy(true)).toBe(true);
    expect(isTruthy({})).toBe(true);
    expect(isTruthy([])).toBe(true);
  });

  it('should return true for -1', () => {
    expect(isTruthy(-1)).toBe(true);
  });

  it('should narrow types when used with filter', () => {
    const items: (string | null | undefined)[] = ['a', null, 'b', undefined, ''];
    const result = items.filter(isTruthy);
    expect(result).toEqual(['a', 'b']);
  });
});
