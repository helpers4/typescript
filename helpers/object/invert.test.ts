/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { invert } from './invert';

describe('invert', () => {
  it('swaps keys and values', () => {
    expect(invert({ a: 'x', b: 'y', c: 'z' })).toEqual({ x: 'a', y: 'b', z: 'c' });
  });

  it('works with numeric values', () => {
    expect(invert({ one: 1, two: 2 })).toEqual({ 1: 'one', 2: 'two' });
  });

  it('last key wins on duplicate values', () => {
    expect(invert({ a: 'x', b: 'x' })).toEqual({ x: 'b' });
  });

  it('returns empty object for empty input', () => {
    expect(invert({} as Record<string, string>)).toEqual({});
  });

  it('is its own inverse for bijective objects', () => {
    const obj = { a: 'x', b: 'y', c: 'z' };
    expect(invert(invert(obj))).toEqual(obj);
  });

  it('skips inherited enumerable properties', () => {
    const proto = { inherited: 'skip' } as Record<string, string>;
    const obj = Object.create(proto) as Record<string, string>;
    obj['own'] = 'value';
    expect(invert(obj)).toEqual({ value: 'own' });
  });

  it('returns {} for null', () => {
    expect(invert(null)).toEqual({});
  });

  it('returns {} for undefined', () => {
    expect(invert(undefined)).toEqual({});
  });

  it('skips entries whose value is a dangerous key (__proto__)', () => {
    expect(invert({ a: '__proto__', b: 'safe' })).toEqual({ safe: 'b' });
  });

  it('skips entries whose value is a dangerous key (constructor)', () => {
    expect(invert({ a: 'constructor', b: 'safe' })).toEqual({ safe: 'b' });
  });

  it('skips entries whose source key is a dangerous key (via JSON.parse)', () => {
    const obj = JSON.parse('{"__proto__": "value", "safe": "ok"}') as Record<string, string>;
    expect(invert(obj)).toEqual({ ok: 'safe' });
  });
});
