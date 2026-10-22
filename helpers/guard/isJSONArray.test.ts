/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isJSONArray } from './isJSONArray';

describe('isJSONArray', () => {
  it('returns true for an array of JSON values', () => {
    expect(isJSONArray([1, 'two', null, { a: true }])).toBe(true);
  });

  it('returns true for an empty array', () => {
    expect(isJSONArray([])).toBe(true);
  });

  it('returns false when an element is not a JSON value', () => {
    expect(isJSONArray([1, undefined])).toBe(false);
  });

  it('returns false for a non-array', () => {
    expect(isJSONArray({})).toBe(false);
    expect(isJSONArray('not an array')).toBe(false);
    expect(isJSONArray(null)).toBe(false);
  });
});
