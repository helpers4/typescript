/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isJSONObject } from './isJSONObject';

describe('isJSONObject', () => {
  it('returns true for a plain object of JSON values', () => {
    expect(isJSONObject({ a: 1, b: 'two', c: null })).toBe(true);
  });

  it('returns true for an empty object', () => {
    expect(isJSONObject({})).toBe(true);
  });

  it('returns false when a value is not a JSON value', () => {
    expect(isJSONObject({ a: undefined })).toBe(false);
  });

  it('returns false for an array', () => {
    expect(isJSONObject([])).toBe(false);
  });

  it('returns false for a non-plain object', () => {
    expect(isJSONObject(new Date())).toBe(false);
  });

  it('returns false for null', () => {
    expect(isJSONObject(null)).toBe(false);
  });
});
