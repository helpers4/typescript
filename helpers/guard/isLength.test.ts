/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isLength } from './isLength';

describe('isLength', () => {
  it('returns true for zero and positive integers', () => {
    expect(isLength(0)).toBe(true);
    expect(isLength(3)).toBe(true);
  });

  it('returns true for MAX_SAFE_INTEGER', () => {
    expect(isLength(Number.MAX_SAFE_INTEGER)).toBe(true);
  });

  it('returns false for negative numbers', () => {
    expect(isLength(-1)).toBe(false);
  });

  it('returns false for non-integers', () => {
    expect(isLength(1.5)).toBe(false);
  });

  it('returns false for numbers beyond MAX_SAFE_INTEGER', () => {
    expect(isLength(Number.MAX_SAFE_INTEGER + 2)).toBe(false);
  });

  it('returns false for non-number types', () => {
    expect(isLength('3')).toBe(false);
    expect(isLength(null)).toBe(false);
    expect(isLength(undefined)).toBe(false);
  });

  it('returns false for NaN and Infinity', () => {
    expect(isLength(Number.NaN)).toBe(false);
    expect(isLength(Number.POSITIVE_INFINITY)).toBe(false);
  });
});
