/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { equalsDeep } from './equalsDeep';

describe('object/equalsDeep', () => {
  it('returns true for identical flat objects', () => {
    expect(equalsDeep({ a: 1, b: 2 }, { a: 1, b: 2 })).toBe(true);
  });

  it('returns false when values differ', () => {
    expect(equalsDeep({ a: 1 }, { a: 2 })).toBe(false);
  });

  it('returns true for same reference', () => {
    const obj = { a: 1 };
    expect(equalsDeep(obj, obj)).toBe(true);
  });

  it('recurses into nested objects', () => {
    expect(equalsDeep({ a: { b: 1 } }, { a: { b: 1 } })).toBe(true);
    expect(equalsDeep({ a: { b: 1 } }, { a: { b: 2 } })).toBe(false);
  });

  it('handles arrays via array/equalsDeep', () => {
    expect(equalsDeep({ arr: [1, 2, 3] }, { arr: [1, 2, 3] })).toBe(true);
    expect(equalsDeep({ arr: [1, 2] }, { arr: [1, 3] })).toBe(false);
  });

  it('compares Date instances by epoch value', () => {
    expect(equalsDeep(
      { d: new Date('2023-01-01') },
      { d: new Date('2023-01-01') },
    )).toBe(true);
  });

  it('compares special objects by reference', () => {
    const fn = () => { /* noop */ };
    expect(equalsDeep({ fn }, { fn })).toBe(true);
    expect(equalsDeep({ fn: () => { /* noop */ } }, { fn: () => { /* noop */ } })).toBe(false);
  });

  it('handles null and undefined', () => {
    expect(equalsDeep(null, null)).toBe(true);
    expect(equalsDeep(undefined, undefined)).toBe(true);
    expect(equalsDeep(null, undefined)).toBe(false);
    expect(equalsDeep({ a: 1 }, null)).toBe(false);
  });

  it('returns false for incompatible types at root', () => {
    expect(equalsDeep({}, [] as unknown as object)).toBe(false);
    expect(equalsDeep(new Date('2023-01-01'), { a: 1 })).toBe(false);
  });

  it('handles arrays at root via array deep comparison', () => {
    expect(equalsDeep([1, 2, 3] as unknown as object, [1, 2, 3] as unknown as object)).toBe(true);
    expect(equalsDeep([1, 2] as unknown as object, [1, 3] as unknown as object)).toBe(false);
  });
});
