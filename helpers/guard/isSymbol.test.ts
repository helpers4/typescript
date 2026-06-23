/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isSymbol } from './isSymbol';

describe('isSymbol', () => {
  it('should return true for symbols', () => {
    expect(isSymbol(Symbol('test'))).toBe(true);
    expect(isSymbol(Symbol.iterator)).toBe(true);
    expect(isSymbol(Symbol())).toBe(true);
  });

  it('should return false for non-symbols', () => {
    expect(isSymbol('symbol')).toBe(false);
    expect(isSymbol(42)).toBe(false);
    expect(isSymbol(null)).toBe(false);
    expect(isSymbol(undefined)).toBe(false);
    expect(isSymbol({})).toBe(false);
  });
});
