/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { validatePositiveCount } from './_validatePositiveCount';

describe('validatePositiveCount', () => {
  it('returns the value unchanged when already a positive integer', () => {
    expect(validatePositiveCount(3, 'count')).toBe(3);
  });

  it('floors a non-integer', () => {
    expect(validatePositiveCount(2.9, 'count')).toBe(2);
  });

  it('returns Infinity unchanged', () => {
    expect(validatePositiveCount(Number.POSITIVE_INFINITY, 'count')).toBe(Number.POSITIVE_INFINITY);
  });

  it('throws RangeError for zero, negative, or NaN', () => {
    expect(() => validatePositiveCount(0, 'count')).toThrow(RangeError);
    expect(() => validatePositiveCount(-1, 'count')).toThrow(RangeError);
    expect(() => validatePositiveCount(Number.NaN, 'count')).toThrow(RangeError);
  });

  it('throws RangeError for negative infinity', () => {
    expect(() => validatePositiveCount(Number.NEGATIVE_INFINITY, 'count')).toThrow(RangeError);
  });

  it('includes the label and value in the error message', () => {
    expect(() => validatePositiveCount(-1, 'createSemaphore: permits')).toThrow(
      'createSemaphore: permits must be a positive number or Infinity, got -1',
    );
  });
});
