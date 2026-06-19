/**
 * This file is part of helpers4.
 * Copyright (C) 2025 baxyz
 * SPDX-License-Identifier: LGPL-3.0-or-later
 */

import { describe, expect, it } from 'vitest';
import { parsePath } from './_parsePath';

describe('parsePath', () => {
  it('returns [""] for empty string (preserves the empty-key intent)', () => {
    expect(parsePath('')).toEqual(['']);
  });

  it('splits dot notation into string segments', () => {
    expect(parsePath('a.b.c')).toEqual(['a', 'b', 'c']);
  });

  it('keeps numeric-looking dot segments as strings', () => {
    expect(parsePath('layers.1.x')).toEqual(['layers', '1', 'x']);
  });

  it('converts bracket indices to numbers', () => {
    expect(parsePath('layers[1].x')).toEqual(['layers', 1, 'x']);
  });

  it('handles multiple bracket indices', () => {
    expect(parsePath('a[0][1]')).toEqual(['a', 0, 1]);
  });

  it('handles mixed dot and bracket notation', () => {
    expect(parsePath('a[0].b[1].c')).toEqual(['a', 0, 'b', 1, 'c']);
  });

  it('preserves empty segment from consecutive dots ("a..b" → ["a","","b"])', () => {
    // Regression: old single-regex approach silently dropped the empty segment,
    // returning ['a','b'] instead. This made `a..b` behave identically to `a.b`,
    // hiding a likely caller error and breaking round-tripping through set/get.
    expect(parsePath('a..b')).toEqual(['a', '', 'b']);
  });

  it('treats a bare dot as the empty-string key ("." → [""])', () => {
    // Leading dot = "current level" (stripped), leaving an empty string → [''].
    expect(parsePath('.')).toEqual(['']);
  });

  it('strips a leading dot so ".[0]" ≡ "[0]"', () => {
    expect(parsePath('.[0]')).toEqual([0]);
    expect(parsePath('.a.b')).toEqual(['a', 'b']);
  });

  it('throws RangeError on text trailing the last "]" within a dot-segment', () => {
    // 'a[0]b' is malformed notation; use 'a[0].b' instead.
    expect(() => parsePath('a[0]b')).toThrow(RangeError);
    expect(() => parsePath('a[0]b')).toThrow("use 'a[0].b' instead");
  });

  it('handles a single segment with no special chars', () => {
    expect(parsePath('key')).toEqual(['key']);
  });
});
