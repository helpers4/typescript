/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { lerp } from './lerp';

describe('lerp', () => {
  it('returns start when t = 0', () => {
    expect(lerp(0, 100, 0)).toBe(0);
    expect(lerp(10, 50, 0)).toBe(10);
  });

  it('returns end when t = 1', () => {
    expect(lerp(0, 100, 1)).toBe(100);
    expect(lerp(10, 50, 1)).toBe(50);
  });

  it('returns midpoint when t = 0.5', () => {
    expect(lerp(0, 100, 0.5)).toBe(50);
    expect(lerp(10, 20, 0.5)).toBe(15);
  });

  it('returns quarter point when t = 0.25', () => {
    expect(lerp(0, 100, 0.25)).toBe(25);
  });

  it('extrapolates beyond end when t > 1', () => {
    expect(lerp(0, 10, 2)).toBe(20);
  });

  it('extrapolates below start when t < 0', () => {
    expect(lerp(0, 10, -1)).toBe(-10);
  });

  it('works with negative ranges', () => {
    expect(lerp(-100, 100, 0.5)).toBe(0);
    expect(lerp(-100, 100, 0)).toBe(-100);
    expect(lerp(-100, 100, 1)).toBe(100);
  });

  it('works with equal start and end', () => {
    expect(lerp(5, 5, 0.7)).toBe(5);
  });

  it('works with floating point values', () => {
    expect(lerp(1.5, 2.5, 0.5)).toBeCloseTo(2.0);
  });
});
