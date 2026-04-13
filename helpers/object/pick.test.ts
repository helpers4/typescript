/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { pick } from './pick';

describe('pick', () => {
  it('should pick specified keys', () => {
    expect(pick({ a: 1, b: 2, c: 3 }, ['a', 'c'])).toEqual({ a: 1, c: 3 });
  });

  it('should return empty object when no keys match', () => {
    expect(pick({ a: 1, b: 2 }, [])).toEqual({});
  });

  it('should ignore keys not present in object', () => {
    const obj = { a: 1, b: 2 } as Record<string, number>;
    expect(pick(obj, ['a', 'z'])).toEqual({ a: 1 });
  });

  it('should handle single key', () => {
    expect(pick({ a: 1, b: 2, c: 3 }, ['b'])).toEqual({ b: 2 });
  });

  it('should preserve value types', () => {
    const obj = { name: 'test', count: 42, active: true };
    const result = pick(obj, ['name', 'active']);
    expect(result).toEqual({ name: 'test', active: true });
  });

  it('should handle undefined values', () => {
    const obj = { a: undefined, b: 2 } as Record<string, unknown>;
    expect(pick(obj, ['a'])).toEqual({ a: undefined });
  });

  it('should not mutate the original object', () => {
    const obj = { a: 1, b: 2, c: 3 };
    pick(obj, ['a']);
    expect(obj).toEqual({ a: 1, b: 2, c: 3 });
  });
});
