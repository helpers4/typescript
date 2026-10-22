/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { identity } from './identity';

describe('identity', () => {
  it('should return a number unchanged', () => {
    expect(identity(42)).toBe(42);
  });

  it('should return a string unchanged', () => {
    expect(identity('hello')).toBe('hello');
  });

  it('should return a boolean unchanged', () => {
    expect(identity(true)).toBe(true);
    expect(identity(false)).toBe(false);
  });

  it('should return null unchanged', () => {
    expect(identity(null)).toBeNull();
  });

  it('should return undefined unchanged', () => {
    expect(identity(undefined)).toBeUndefined();
  });

  it('should return an object by reference', () => {
    const obj = { a: 1 };
    expect(identity(obj)).toBe(obj);
  });

  it('should return an array by reference', () => {
    const arr = [1, 2, 3];
    expect(identity(arr)).toBe(arr);
  });

  it('should work as a map callback', () => {
    expect([1, 2, 3].map(identity)).toEqual([1, 2, 3]);
  });

  it('should preserve the type', () => {
    const result: number = identity(5);
    expect(result).toBe(5);
  });
});
