/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isNonEmpty } from './isNonEmpty';

describe('isNonEmpty', () => {
  it('should return true for an object with string keys', () => {
    expect(isNonEmpty({ a: 1 })).toBe(true);
    expect(isNonEmpty({ a: undefined })).toBe(true);
  });

  it('should return false for an empty object', () => {
    expect(isNonEmpty({})).toBe(false);
  });

  it('should not count symbol-keyed properties', () => {
    const sym = Symbol('x');
    const obj: Record<PropertyKey, unknown> = {};
    obj[sym] = 1;
    expect(isNonEmpty(obj)).toBe(false);
  });

  it('should handle null-prototype objects', () => {
    const obj = Object.create(null) as Record<PropertyKey, unknown>;
    expect(isNonEmpty(obj)).toBe(false);
    obj['key'] = 'value';
    expect(isNonEmpty(obj)).toBe(true);
  });

  it('should return false for null', () => {
    expect(isNonEmpty(null)).toBe(false);
  });

  it('should return false for undefined', () => {
    expect(isNonEmpty(undefined)).toBe(false);
  });
});
