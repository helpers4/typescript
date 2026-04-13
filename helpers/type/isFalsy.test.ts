/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isFalsy } from './isFalsy';

describe('isFalsy', () => {
  it('should return true for null', () => {
    expect(isFalsy(null)).toBe(true);
  });

  it('should return true for undefined', () => {
    expect(isFalsy(undefined)).toBe(true);
  });

  it('should return true for 0', () => {
    expect(isFalsy(0)).toBe(true);
  });

  it('should return true for empty string', () => {
    expect(isFalsy('')).toBe(true);
  });

  it('should return true for false', () => {
    expect(isFalsy(false)).toBe(true);
  });

  it('should return true for NaN', () => {
    expect(isFalsy(NaN)).toBe(true);
  });

  it('should return false for truthy values', () => {
    expect(isFalsy(1)).toBe(false);
    expect(isFalsy('hello')).toBe(false);
    expect(isFalsy(true)).toBe(false);
    expect(isFalsy({})).toBe(false);
    expect(isFalsy([])).toBe(false);
  });

  it('should return false for -1', () => {
    expect(isFalsy(-1)).toBe(false);
  });
});
