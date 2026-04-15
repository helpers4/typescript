/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isFunction } from './isFunction';

describe('isFunction', () => {
  it('should return true for functions', () => {
    expect(isFunction(() => { })).toBe(true);
    expect(isFunction(function () { })).toBe(true);
    expect(isFunction(async () => { })).toBe(true);
    expect(isFunction(class { })).toBe(true);
  });

  it('should return false for non-functions', () => {
    expect(isFunction('function')).toBe(false);
    expect(isFunction(42)).toBe(false);
    expect(isFunction(null)).toBe(false);
    expect(isFunction(undefined)).toBe(false);
    expect(isFunction({})).toBe(false);
    expect(isFunction([])).toBe(false);
  });
});
