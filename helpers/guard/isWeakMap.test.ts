/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isWeakMap } from './isWeakMap';

describe('isWeakMap', () => {
  it('should return true for WeakMap instances', () => {
    expect(isWeakMap(new WeakMap())).toBe(true);
    const key = {};
    expect(isWeakMap(new WeakMap([[key, 1]]))).toBe(true);
  });

  it('should return false for non-WeakMap values', () => {
    expect(isWeakMap(new Map())).toBe(false);
    expect(isWeakMap(new WeakSet())).toBe(false);
    expect(isWeakMap({})).toBe(false);
    expect(isWeakMap(null)).toBe(false);
    expect(isWeakMap(undefined)).toBe(false);
  });
});
