/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { flatten } from './flatten';

describe('flatten', () => {
  it('flattens a nested object into dot-notation keys', () => {
    expect(flatten({ a: { b: { c: 1 }, d: 2 } })).toEqual({ 'a.b.c': 1, 'a.d': 2 });
  });

  it('leaves a flat object unchanged', () => {
    expect(flatten({ a: 1, b: 2 })).toEqual({ a: 1, b: 2 });
  });

  it('returns an empty object for an empty input', () => {
    expect(flatten({})).toEqual({});
  });

  it('keeps an empty nested object as an opaque leaf value', () => {
    expect(flatten({ a: {} })).toEqual({ a: {} });
  });

  it('does not recurse into arrays', () => {
    expect(flatten({ a: [1, 2, { b: 3 }] })).toEqual({ a: [1, 2, { b: 3 }] });
  });

  it('does not recurse into Date, RegExp, or class instances', () => {
    const date = new Date(0);
    const regex = /x/;
    class Point { x = 1; y = 2; }
    const point = new Point();
    expect(flatten({ date, regex, point })).toEqual({ date, regex, point });
  });

  it('handles multiple sibling branches at different depths', () => {
    expect(flatten({ a: { b: 1 }, c: 2, d: { e: { f: 3 } } })).toEqual({
      'a.b': 1,
      c: 2,
      'd.e.f': 3,
    });
  });

  it('handles deeply nested objects', () => {
    expect(flatten({ a: { b: { c: { d: { e: 'deep' } } } } })).toEqual({ 'a.b.c.d.e': 'deep' });
  });
});
