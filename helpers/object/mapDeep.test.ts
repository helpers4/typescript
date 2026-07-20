/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { mapDeep } from './mapDeep';

describe('mapDeep', () => {
  it('transforms values recursively', () => {
    expect(mapDeep({ a: { b: 1, c: 2 } }, (v) => (typeof v === 'number' ? v * 10 : v))).toEqual({
      a: { b: 10, c: 20 },
    });
  });

  it('transforms keys recursively', () => {
    expect(mapDeep({ a: { b: 1 } }, undefined, (k) => k.toUpperCase())).toEqual({ A: { B: 1 } });
  });

  it('transforms both keys and values', () => {
    expect(
      mapDeep(
        { a: { b: 1 } },
        (v) => (typeof v === 'number' ? v * 10 : v),
        (k) => k.toUpperCase(),
      ),
    ).toEqual({ A: { B: 10 } });
  });

  it('recurses into arrays of objects', () => {
    expect(mapDeep({ list: [{ a: 1 }, { a: 2 }] }, undefined, (k) => k.toUpperCase())).toEqual({
      LIST: [{ A: 1 }, { A: 2 }],
    });
  });

  it('transforms primitives that live directly inside an array', () => {
    expect(mapDeep({ list: [1, 2, 3] }, (v) => (typeof v === 'number' ? v * 10 : v))).toEqual({
      list: [10, 20, 30],
    });
  });

  it('transforms primitives in a bare top-level array', () => {
    expect(mapDeep([1, 2, 3], (v) => (typeof v === 'number' ? v * 10 : v))).toEqual([10, 20, 30]);
  });

  it('passes the stringified index as key for array elements', () => {
    const keys: string[] = [];
    mapDeep([1, 2], (v, key) => {
      keys.push(key);
      return v;
    });
    expect(keys).toEqual(['0', '1']);
  });

  it('leaves Date/Map/Set untouched, only walks into their position', () => {
    const date = new Date('2026-01-01');
    expect(mapDeep({ created: date }, undefined, (k) => k.toUpperCase())).toEqual({ CREATED: date });
  });

  it('defaults to identity when no callbacks are given', () => {
    const obj = { a: { b: 1 } };
    expect(mapDeep(obj)).toEqual(obj);
  });

  it('skips a dangerous mapped key (constructor)', () => {
    expect(mapDeep({ a: 1 }, undefined, () => 'constructor')).toEqual({});
  });

  it('does not mutate the input', () => {
    const input = { a: { b: 1 } };
    mapDeep(input, (v) => (typeof v === 'number' ? v * 10 : v));
    expect(input).toEqual({ a: { b: 1 } });
  });
});
