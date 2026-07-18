/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { DEFAULT_PERCENTAGE_TIERS, percentageToTier } from './percentageToTier';

describe('percentageToTier', () => {
  it('matches the "perfect" tier at exactly 100', () => {
    expect(percentageToTier(100)).toEqual({ min: 100, icon: '✅', color: 'brightgreen', label: 'perfect' });
  });

  it('matches "excellent" for a value inside the 90-99 range', () => {
    expect(percentageToTier(95).label).toBe('excellent');
  });

  it('matches "good" at exactly the 80 boundary', () => {
    expect(percentageToTier(80).label).toBe('good');
  });

  it('matches "fair" just below the 80 boundary', () => {
    expect(percentageToTier(79.9).label).toBe('fair');
  });

  it('matches "poor" for a low value', () => {
    expect(percentageToTier(10).label).toBe('poor');
  });

  it('matches "poor" at exactly the 0 boundary', () => {
    expect(percentageToTier(0).label).toBe('poor');
  });

  it('falls back to the lowest tier for a value below every tier min', () => {
    expect(percentageToTier(-5).label).toBe('poor');
  });

  it('supports values above 100', () => {
    expect(percentageToTier(150).label).toBe('perfect');
  });

  it('accepts custom tiers, matched regardless of input order', () => {
    const tiers = [
      { min: 0, icon: '🔴', color: 'red', label: 'fail' },
      { min: 50, icon: '🟢', color: 'green', label: 'pass' },
    ];
    expect(percentageToTier(75, tiers).label).toBe('pass');
    expect(percentageToTier(25, tiers).label).toBe('fail');
  });

  it('falls back to the lowest custom tier when below all mins', () => {
    const tiers = [{ min: 50, icon: '🟢', color: 'green', label: 'pass' }];
    expect(percentageToTier(10, tiers).label).toBe('pass');
  });

  it('throws a RangeError for an empty tiers array', () => {
    expect(() => percentageToTier(50, [])).toThrow(RangeError);
    expect(() => percentageToTier(50, [])).toThrow('tiers must not be empty');
  });

  it('does not mutate the provided tiers array', () => {
    const tiers = [...DEFAULT_PERCENTAGE_TIERS];
    const original = [...tiers];
    percentageToTier(42, tiers);
    expect(tiers).toEqual(original);
  });
});
