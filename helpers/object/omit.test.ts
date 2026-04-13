/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { omit } from './omit';

describe('omit', () => {
  it('should omit specified keys', () => {
    expect(omit({ a: 1, b: 2, c: 3 }, ['b'])).toEqual({ a: 1, c: 3 });
  });

  it('should return copy when no keys to omit', () => {
    const obj = { a: 1, b: 2 };
    const result = omit(obj, []);
    expect(result).toEqual({ a: 1, b: 2 });
    expect(result).not.toBe(obj);
  });

  it('should handle omitting all keys', () => {
    expect(omit({ a: 1, b: 2 }, ['a', 'b'])).toEqual({});
  });

  it('should ignore keys not present', () => {
    const obj = { a: 1, b: 2 } as Record<string, number>;
    expect(omit(obj, ['z' as keyof typeof obj])).toEqual({ a: 1, b: 2 });
  });

  it('should handle multiple keys', () => {
    expect(omit({ a: 1, b: 2, c: 3, d: 4 }, ['a', 'c'])).toEqual({ b: 2, d: 4 });
  });

  it('should preserve value types', () => {
    const obj = { name: 'test', count: 42, active: true };
    expect(omit(obj, ['count'])).toEqual({ name: 'test', active: true });
  });

  it('should not mutate the original object', () => {
    const obj = { a: 1, b: 2, c: 3 };
    omit(obj, ['a']);
    expect(obj).toEqual({ a: 1, b: 2, c: 3 });
  });
});
