/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isNonEmpty } from './isNonEmpty';

describe('isNonEmpty', () => {
  it('should return true for a non-empty string', () => {
    expect(isNonEmpty('a')).toBe(true);
    expect(isNonEmpty('hello')).toBe(true);
  });

  it('should return true for a whitespace-only string', () => {
    expect(isNonEmpty(' ')).toBe(true);
    expect(isNonEmpty('   ')).toBe(true);
    expect(isNonEmpty('\t')).toBe(true);
  });

  it('should return false for an empty string', () => {
    expect(isNonEmpty('')).toBe(false);
  });

  it('should return false for null', () => {
    expect(isNonEmpty(null)).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(isNonEmpty(undefined)).toBe(false);
  });
});
