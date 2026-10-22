/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isAsyncFunction } from './isAsyncFunction';

describe('isAsyncFunction', () => {
  it('should return true for async functions', () => {
    expect(isAsyncFunction(async () => { })).toBe(true);
    expect(isAsyncFunction(async function () { })).toBe(true);
  });

  it('should return false for regular functions', () => {
    expect(isAsyncFunction(() => { })).toBe(false);
    expect(isAsyncFunction(function () { })).toBe(false);
  });

  it('should return false for generator functions', () => {
    expect(isAsyncFunction(function* () { })).toBe(false);
  });

  it('should return false for non-functions', () => {
    expect(isAsyncFunction(42)).toBe(false);
    expect(isAsyncFunction('async')).toBe(false);
    expect(isAsyncFunction(null)).toBe(false);
    expect(isAsyncFunction(undefined)).toBe(false);
    expect(isAsyncFunction({})).toBe(false);
    expect(isAsyncFunction(Promise.resolve())).toBe(false);
  });
});
