/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { isJSONValue } from './isJSONValue';

describe('isJSONValue', () => {
  it('returns true for primitives', () => {
    expect(isJSONValue('str')).toBe(true);
    expect(isJSONValue(42)).toBe(true);
    expect(isJSONValue(true)).toBe(true);
    expect(isJSONValue(null)).toBe(true);
  });

  it('returns true for a nested plain object/array structure', () => {
    expect(isJSONValue({ a: [1, 'two', null, { b: true }] })).toBe(true);
  });

  it('returns false for undefined', () => {
    expect(isJSONValue(undefined)).toBe(false);
  });

  it('returns false for functions and symbols', () => {
    expect(isJSONValue(() => {})).toBe(false);
    expect(isJSONValue(Symbol('x'))).toBe(false);
  });

  it('returns false for NaN and Infinity', () => {
    expect(isJSONValue(Number.NaN)).toBe(false);
    expect(isJSONValue(Number.POSITIVE_INFINITY)).toBe(false);
  });

  it('returns false for non-plain objects like Date and Map', () => {
    expect(isJSONValue(new Date())).toBe(false);
    expect(isJSONValue(new Map())).toBe(false);
  });

  it('returns false when a nested value is invalid', () => {
    expect(isJSONValue({ a: [1, undefined] })).toBe(false);
  });

  it('handles empty arrays and objects', () => {
    expect(isJSONValue([])).toBe(true);
    expect(isJSONValue({})).toBe(true);
  });

  it('returns false for a circular object instead of overflowing the stack', () => {
    const obj: Record<string, unknown> = { a: 1 };
    obj['self'] = obj;
    expect(isJSONValue(obj)).toBe(false);
  });

  it('returns false for a circular array instead of overflowing the stack', () => {
    const arr: unknown[] = [1, 2];
    arr.push(arr);
    expect(isJSONValue(arr)).toBe(false);
  });

  it('a value referenced twice without a cycle is still valid', () => {
    const shared = { x: 1 };
    expect(isJSONValue({ a: shared, b: shared })).toBe(true);
  });
});
