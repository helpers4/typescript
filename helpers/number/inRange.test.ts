/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { inRange } from './inRange';

describe('inRange', () => {
  describe('default (inclusive: both)', () => {
    it('returns true for value inside range', () => {
      expect(inRange(5, 1, 10)).toBe(true);
    });

    it('returns true for value at min boundary', () => {
      expect(inRange(1, 1, 10)).toBe(true);
    });

    it('returns true for value at max boundary', () => {
      expect(inRange(10, 1, 10)).toBe(true);
    });

    it('returns false for value below min', () => {
      expect(inRange(0, 1, 10)).toBe(false);
    });

    it('returns false for value above max', () => {
      expect(inRange(11, 1, 10)).toBe(false);
    });
  });

  describe('inclusive: none', () => {
    it('returns true for value strictly inside range', () => {
      expect(inRange(5, 1, 10, { inclusive: 'none' })).toBe(true);
    });

    it('returns false for value at min', () => {
      expect(inRange(1, 1, 10, { inclusive: 'none' })).toBe(false);
    });

    it('returns false for value at max', () => {
      expect(inRange(10, 1, 10, { inclusive: 'none' })).toBe(false);
    });
  });

  describe('inclusive: min', () => {
    it('returns true at min, false at max', () => {
      expect(inRange(1, 1, 10, { inclusive: 'min' })).toBe(true);
      expect(inRange(10, 1, 10, { inclusive: 'min' })).toBe(false);
    });
  });

  describe('inclusive: max', () => {
    it('returns false at min, true at max', () => {
      expect(inRange(1, 1, 10, { inclusive: 'max' })).toBe(false);
      expect(inRange(10, 1, 10, { inclusive: 'max' })).toBe(true);
    });
  });

  it('works with negative numbers', () => {
    expect(inRange(-3, -5, -1)).toBe(true);
    expect(inRange(-5, -5, -1)).toBe(true);
    expect(inRange(-6, -5, -1)).toBe(false);
  });

  it('works with decimals', () => {
    expect(inRange(1.5, 1.0, 2.0)).toBe(true);
    expect(inRange(2.1, 1.0, 2.0)).toBe(false);
  });
});
