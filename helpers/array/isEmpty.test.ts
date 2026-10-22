/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isEmpty } from './isEmpty';

describe('isEmpty', () => {
  it('should return true for an empty array', () => {
    expect(isEmpty([])).toBe(true);
  });

  it('should return false for a non-empty array', () => {
    expect(isEmpty([1])).toBe(false);
  });

  it('should return false for an array with multiple elements', () => {
    expect(isEmpty([1, 2, 3])).toBe(false);
  });

  it('should return false for an array containing falsy values', () => {
    expect(isEmpty([null])).toBe(false);
    expect(isEmpty([undefined])).toBe(false);
    expect(isEmpty([0])).toBe(false);
    expect(isEmpty([''])).toBe(false);
    expect(isEmpty([false])).toBe(false);
  });

  it('should work with readonly arrays', () => {
    const arr: readonly number[] = [];
    expect(isEmpty(arr)).toBe(true);
  });

  it('should return true for an empty array regardless of declared type', () => {
    const arr: string[] = [];
    expect(isEmpty(arr)).toBe(true);
  });

  it('should narrow type to readonly never[] | null | undefined in true branch', () => {
    const arr: string[] | null = null;
    if (isEmpty(arr)) {
      const _: readonly never[] | null | undefined = arr;
      expect(_).toBeNull();
    }
  });

  it('should return true for null', () => {
    expect(isEmpty(null)).toBe(true);
  });

  it('should return true for undefined', () => {
    expect(isEmpty(undefined)).toBe(true);
  });
});
