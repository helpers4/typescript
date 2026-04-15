/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isRegExp } from './isRegExp';

describe('isRegExp', () => {
  it('should return true for RegExp instances', () => {
    expect(isRegExp(/abc/)).toBe(true);
    expect(isRegExp(new RegExp('abc'))).toBe(true);
    expect(isRegExp(/test/gi)).toBe(true);
  });

  it('should return false for non-RegExp values', () => {
    expect(isRegExp('abc')).toBe(false);
    expect(isRegExp('/abc/')).toBe(false);
    expect(isRegExp(null)).toBe(false);
    expect(isRegExp(undefined)).toBe(false);
    expect(isRegExp({})).toBe(false);
  });
});
