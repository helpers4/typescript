/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { parsePropertyPath } from './parsePropertyPath';

describe('parsePropertyPath', () => {
  it('returns [""] for empty string (preserves the empty-key intent)', () => {
    expect(parsePropertyPath('')).toEqual(['']);
  });

  it('splits dot notation into string segments', () => {
    expect(parsePropertyPath('a.b.c')).toEqual(['a', 'b', 'c']);
  });

  it('keeps numeric-looking dot segments as strings', () => {
    expect(parsePropertyPath('layers.1.x')).toEqual(['layers', '1', 'x']);
  });

  it('converts bracket indices to numbers', () => {
    expect(parsePropertyPath('layers[1].x')).toEqual(['layers', 1, 'x']);
  });

  it('handles multiple bracket indices', () => {
    expect(parsePropertyPath('a[0][1]')).toEqual(['a', 0, 1]);
  });

  it('handles mixed dot and bracket notation', () => {
    expect(parsePropertyPath('a[0].b[1].c')).toEqual(['a', 0, 'b', 1, 'c']);
  });

  it('preserves empty segment from consecutive dots ("a..b" → ["a","","b"])', () => {
    // Regression: an earlier single-regex approach silently dropped the empty segment,
    // returning ['a','b'] instead. This made `a..b` behave identically to `a.b`,
    // hiding a likely caller error and breaking round-tripping through set/get.
    expect(parsePropertyPath('a..b')).toEqual(['a', '', 'b']);
  });

  it('treats a bare dot as the empty-string key ("." → [""])', () => {
    // Leading dot = "current level" (stripped), leaving an empty string → [''].
    expect(parsePropertyPath('.')).toEqual(['']);
  });

  it('strips a leading dot so ".[0]" ≡ "[0]"', () => {
    expect(parsePropertyPath('.[0]')).toEqual([0]);
    expect(parsePropertyPath('.a.b')).toEqual(['a', 'b']);
  });

  it('throws RangeError on text trailing the last "]" within a dot-segment', () => {
    // 'a[0]b' is malformed notation; use 'a[0].b' instead.
    expect(() => parsePropertyPath('a[0]b')).toThrow(RangeError);
    expect(() => parsePropertyPath('a[0]b')).toThrow("use 'a[0].b' instead");
  });

  it('handles a single segment with no special chars', () => {
    expect(parsePropertyPath('key')).toEqual(['key']);
  });

  it('returns a cached (but frozen, immutable) result on repeated calls', () => {
    const first = parsePropertyPath('cache.test.path');
    const second = parsePropertyPath('cache.test.path');
    expect(first).toBe(second);
    expect(Object.isFrozen(first)).toBe(true);
  });

  it('evicts the oldest cache entry once the cache is full', () => {
    // Fill the cache past its cap (500) with distinct paths, then confirm the very
    // first one parsed no longer returns the same cached array reference — proving
    // it was evicted rather than the cache growing unbounded.
    const firstPath = '__eviction_probe__';
    const firstResult = parsePropertyPath(firstPath);

    for (let i = 0; i < 500; i++) {
      parsePropertyPath(`__filler_${i}__`);
    }

    const afterEviction = parsePropertyPath(firstPath);
    expect(afterEviction).toEqual(firstResult);
    expect(afterEviction).not.toBe(firstResult);
  });
});
