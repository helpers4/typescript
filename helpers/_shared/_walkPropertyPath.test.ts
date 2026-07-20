/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { walkPropertyPath } from './_walkPropertyPath';

describe('walkPropertyPath', () => {
  it('resolves a single-key path', () => {
    expect(walkPropertyPath({ a: 1 }, ['a'])).toBe(1);
  });

  it('resolves a multi-key nested path', () => {
    expect(walkPropertyPath({ a: { b: { c: 42 } } }, ['a', 'b', 'c'])).toBe(42);
  });

  it('returns the value itself for an empty key list', () => {
    const value = { a: 1 };
    expect(walkPropertyPath(value, [])).toBe(value);
  });

  it('returns undefined when a step resolves to null mid-path', () => {
    expect(walkPropertyPath({ a: null }, ['a', 'b'])).toBeUndefined();
  });

  it('returns undefined when a step resolves to a non-object mid-path', () => {
    expect(walkPropertyPath({ a: 1 }, ['a', 'b'])).toBeUndefined();
  });

  it('returns undefined for a missing final key', () => {
    expect(walkPropertyPath({ a: 1 }, ['missing'])).toBeUndefined();
  });

  it('returns undefined when the root value itself is not an object', () => {
    expect(walkPropertyPath(42, ['a'])).toBeUndefined();
  });

  it('walks numeric keys into arrays', () => {
    expect(walkPropertyPath({ items: ['x', 'y'] }, ['items', 1])).toBe('y');
  });

  it('walks symbol keys', () => {
    const id = Symbol('id');
    expect(walkPropertyPath({ [id]: 'alice' }, [id])).toBe('alice');
  });

  it('returns undefined when the root value is null or undefined', () => {
    expect(walkPropertyPath(null, ['a'])).toBeUndefined();
    expect(walkPropertyPath(undefined, ['a'])).toBeUndefined();
  });
});
