/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isEmpty } from './isEmpty';

describe('isEmpty', () => {
  it('should return true for an empty object', () => {
    expect(isEmpty({})).toBe(true);
  });

  it('should return false for an object with string keys', () => {
    expect(isEmpty({ a: 1 })).toBe(false);
    expect(isEmpty({ a: undefined })).toBe(false);
  });

  it('should not count symbol-keyed properties', () => {
    const sym = Symbol('x');
    const obj: Record<PropertyKey, unknown> = {};
    obj[sym] = 1;
    expect(isEmpty(obj)).toBe(true);
  });

  it('should return false for an object with multiple keys', () => {
    expect(isEmpty({ a: 1, b: 2, c: 3 })).toBe(false);
  });

  it('should handle null-prototype objects', () => {
    const obj = Object.create(null) as Record<PropertyKey, unknown>;
    expect(isEmpty(obj)).toBe(true);
    obj['key'] = 'value';
    expect(isEmpty(obj)).toBe(false);
  });
});
