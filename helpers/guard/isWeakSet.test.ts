/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isWeakSet } from './isWeakSet';

describe('isWeakSet', () => {
  it('should return true for WeakSet instances', () => {
    expect(isWeakSet(new WeakSet())).toBe(true);
    const item = {};
    expect(isWeakSet(new WeakSet([item]))).toBe(true);
  });

  it('should return false for non-WeakSet values', () => {
    expect(isWeakSet(new Set())).toBe(false);
    expect(isWeakSet(new WeakMap())).toBe(false);
    expect(isWeakSet({})).toBe(false);
    expect(isWeakSet(null)).toBe(false);
    expect(isWeakSet(undefined)).toBe(false);
  });
});
