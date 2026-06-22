/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { map } from './map';

describe('map', () => {
  it('transforms values with mapValue', () => {
    expect(map({ a: 1, b: 2 }, v => v * 10)).toEqual({ a: 10, b: 20 });
  });

  it('transforms keys with mapKey', () => {
    expect(map({ a: 1, b: 2 }, undefined, k => (k as string).toUpperCase())).toEqual({ A: 1, B: 2 });
  });

  it('transforms both values and keys', () => {
    expect(
      map({ a: 1, b: 2 }, v => v * 10, k => (k as string).toUpperCase())
    ).toEqual({ A: 10, B: 20 });
  });

  it('with no callbacks returns a shallow copy', () => {
    const original = { x: 1, y: 2 };
    const result = map(original);
    expect(result).toEqual(original);
    expect(result).not.toBe(original);
  });

  it('callback receives correct (value, key) pair', () => {
    const calls: [unknown, unknown][] = [];
    map({ a: 1, b: 2 }, (v, k) => { calls.push([v, k]); return v; });
    expect(calls).toEqual([[1, 'a'], [2, 'b']]);
  });

  it('mapKey callback receives correct (key, value) pair', () => {
    const calls: [unknown, unknown][] = [];
    map({ a: 1, b: 2 }, undefined, (k, v) => { calls.push([k, v]); return k as string; });
    expect(calls).toEqual([['a', 1], ['b', 2]]);
  });

  it('returns empty object for empty input', () => {
    expect(map({})).toEqual({});
  });

  it('last writer wins when two keys collide', () => {
    // Both 'a' and 'b' → 'x'
    const result = map({ a: 1, b: 2 }, undefined, () => 'x');
    expect(result).toEqual({ x: 2 });
  });

  it('works with numeric values', () => {
    expect(map({ count: 5, limit: 10 }, v => String(v))).toEqual({ count: '5', limit: '10' });
  });

  it('returns {} for null', () => {
    expect(map(null)).toEqual({});
  });

  it('returns {} for undefined', () => {
    expect(map(undefined)).toEqual({});
  });

  it('skips entries whose mapped key is a dangerous property name', () => {
    expect(map({ a: 1, b: 2 }, undefined, () => '__proto__')).toEqual({});
    expect(map({ a: 1 }, undefined, () => 'constructor')).toEqual({});
  });
});
